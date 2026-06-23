export const dynamic = "force-dynamic";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { getProviderForModel, CygmaAIError } from '@/lib/ai/providers';
import type { AIMessage } from '@/lib/ai/providers';
import { sanitize, logError, logInfo } from '@/lib/security';
import { isRateLimited } from "@/lib/rateLimit";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const MAX_PROMPT_LENGTH = 32_000;       // ~8k tokens
const MAX_HISTORY_MESSAGES = 20;        // Last 20 messages for multi-turn context
const GUEST_MAX_HISTORY = 10;           // Guests can send fewer history messages
const STREAM_TIMEOUT_MS = 60_000;       // 60 second max stream duration

// ─────────────────────────────────────────────
// CYGMA Brand System Instruction
// ─────────────────────────────────────────────

const CYGMA_SYSTEM_INSTRUCTION = `You are CYGMA AI, the flagship intelligence system developed by VANIKARA Intelligence Private Limited.
Establish yourself as a precise, helpful, and highly competent engineering assistant.
Tone & Guidelines:
- Professional, accurate, helpful, and technically expert.
- Assist users with software engineering, programming assistance, academic education, digital business guidance, and cybersecurity support.
- If asked about your origin, state neutrally that you are CYGMA AI, powered by state-of-the-art base models connected through secure company API nodes. Do not claim proprietary ownership of connected underlying base models.
- Format responses using Markdown when appropriate: use code blocks for code, bold for emphasis, bullet points for lists, and tables when comparing items.`;

const GUEST_SYSTEM_ADDENDUM = `
You are running in a Guest Workspace. Your user does not have an authenticated account yet.
Some features are restricted for guests.
Allowed:
- General chat, code generation, translation, explaining concepts, text summarization, brainstorming, general math, writing.
Restricted:
- Saving chat/conversation history, file uploads/PDF analysis (RAG), long-term memory, custom agents, team workspaces, personal settings.

CRITICAL INSTRUCTION FOR RESTRICTED ACTIONS:
If the user asks you to remember details, upload documents, save conversation logs, or configure custom agents, you MUST reply with exactly this response format and nothing else:
"This capability is available inside your authenticated workspace.

Sign in to unlock:
• File uploads
• Long-term memory
• Document intelligence
• Workspace history
• Custom AI agents"

If the user asks general questions, answer them normally and professionally. Never mention that you are a demo, simulation, or running in sandbox mode.`;

// ─────────────────────────────────────────────
// Guest Restricted Query Detector
// ─────────────────────────────────────────────

function isRestrictedGuestQuery(q: string): boolean {
  const lower = q.toLowerCase().trim();

  // File upload or doc analysis requests
  if (
    (lower.includes("upload") || lower.includes("parse") || lower.includes("analyze") || lower.includes("scan") || lower.includes("index")) &&
    (lower.includes("file") || lower.includes("pdf") || lower.includes("document") || lower.includes("docx") || lower.includes("csv") || lower.includes("txt") || lower.includes("image"))
  ) {
    return true;
  }

  // Memory queries
  if (
    lower.includes("remember this") ||
    lower.includes("remember me") ||
    lower.includes("save this conversation") ||
    lower.includes("save my chat") ||
    lower.includes("store my preference") ||
    lower.includes("save memory")
  ) {
    return true;
  }

  // Agent configurations
  if (
    lower.includes("create custom agent") ||
    lower.includes("custom agent") ||
    lower.includes("create an agent")
  ) {
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────
// Request Validation
// ─────────────────────────────────────────────

interface ValidatedRequest {
  prompt: string;
  model: string;
  fileContext: string;
  conversationId?: string;
  history: AIMessage[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateRequestBody(body: any): ValidatedRequest | { error: string; status: number } {
  if (!body || typeof body !== 'object') {
    return { error: 'Request body must be a JSON object.', status: 400 };
  }

  const { prompt, model = 'gpt-4o', fileContext = '', conversationId, history = [] } = body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return { error: 'Prompt parameter is required and must be a non-empty string.', status: 400 };
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters.`, status: 413 };
  }

  if (typeof model !== 'string') {
    return { error: 'Model parameter must be a string.', status: 400 };
  }

  // Validate history array if provided
  const validatedHistory: AIMessage[] = [];
  if (Array.isArray(history)) {
    for (const msg of history.slice(-GUEST_MAX_HISTORY)) {
      if (msg && typeof msg.role === 'string' && typeof msg.content === 'string' &&
          (msg.role === 'user' || msg.role === 'assistant')) {
        validatedHistory.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content.slice(0, 8000), // Cap individual message length
        });
      }
    }
  }

  return {
    prompt: prompt.trim(),
    model,
    fileContext: typeof fileContext === 'string' ? fileContext : '',
    conversationId: typeof conversationId === 'string' ? conversationId : undefined,
    history: validatedHistory,
  };
}

// ─────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    // 0. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const limitCheck = await isRateLimited(ip);
    if (limitCheck.limited) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a minute before querying CYGMA again." }),
        { 
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((limitCheck.reset - Date.now()) / 1000))
          }
        }
      );
    }
    
    // 1. Parse and validate request body
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validation = validateRequestBody(body);
    if ('error' in validation) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: validation.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prompt, model, fileContext, conversationId, history: clientHistory } = validation;

    // 2. Authenticate (optional — guests allowed)
    const cookieStore = await cookies();
    const sb = createClient(cookieStore);
    const { data: { user } } = await sb.auth.getUser();
    const isGuest = !user;

    const sPrompt = sanitize(prompt);
    let activeConversationId = conversationId;

    logInfo('Stream Route', 'Request received', {
      requestId,
      model,
      isGuest,
      promptLength: sPrompt.length,
      hasFileContext: !!fileContext,
      hasConversationId: !!conversationId,
    });

    // 3. Initialize / Fetch conversation session (Authenticated Users only)
    if (!isGuest) {
      if (!activeConversationId) {
        const title = sPrompt.length > 30 ? `${sPrompt.slice(0, 30)}...` : sPrompt;
        const { data: newConv, error: convErr } = await sb
          .from('conversations')
          .insert({
            user_id: user.id,
            title,
            selected_model: model,
          })
          .select()
          .single();

        if (convErr || !newConv) {
          logError('Stream Route', 'Failed to create conversation session', {
            requestId,
            errorType: 'DATABASE',
          });
          activeConversationId = crypto.randomUUID();
        } else {
          activeConversationId = newConv.id;
        }
      }

      // Log user prompt message to Supabase
      try {
        await sb.from('messages').insert({
          conversation_id: activeConversationId,
          sender_role: 'user',
          content: sPrompt,
        });
      } catch (_dbErr) {
        logError('Stream Route', 'Failed logging user prompt', { requestId });
      }
    } else {
      if (!activeConversationId) {
        activeConversationId = crypto.randomUUID();
      }
    }

    // 4. Build conversation history for multi-turn context
    let conversationHistory: AIMessage[] = [];

    if (!isGuest && activeConversationId) {
      // Fetch recent messages from Supabase for authenticated users
      try {
        const { data: dbMessages } = await sb
          .from('messages')
          .select('sender_role, content')
          .eq('conversation_id', activeConversationId)
          .order('created_at', { ascending: true })
          .limit(MAX_HISTORY_MESSAGES);

        if (dbMessages && dbMessages.length > 0) {
          // Exclude the last message (it's the prompt we just inserted)
          const historyMessages = dbMessages.slice(0, -1);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          conversationHistory = historyMessages.map((m: any) => ({
            role: m.sender_role as 'user' | 'assistant',
            content: m.content,
          }));
        }
      } catch (_histErr) {
        logError('Stream Route', 'Failed fetching conversation history', { requestId });
      }
    } else if (isGuest && clientHistory.length > 0) {
      // Use client-provided history for guests (already validated & capped)
      conversationHistory = clientHistory;
    }

    // 5. Construct system instruction
    let systemInstruction = CYGMA_SYSTEM_INSTRUCTION;

    if (fileContext) {
      systemInstruction += `\nGround your answers in the following document context:\n"""\n${fileContext}\n"""`;
    }

    if (isGuest) {
      systemInstruction += GUEST_SYSTEM_ADDENDUM;
    }

    // 6. Build message stream
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Emit conversation metadata first
        controller.enqueue(
          encoder.encode(`[METADATA]:${JSON.stringify({ conversationId: activeConversationId })}\n`)
        );

        let fullReply = '';

        // Intercept restricted queries for guest users
        if (isGuest && isRestrictedGuestQuery(sPrompt)) {
          const restrictedWarning = `This capability is available inside your authenticated workspace.

Sign in to unlock:
• File uploads
• Long-term memory
• Document intelligence
• Workspace history
• Custom AI agents`;

          for (let i = 0; i < restrictedWarning.length; i += 6) {
            const slice = restrictedWarning.slice(i, i + 6);
            fullReply += slice;
            controller.enqueue(encoder.encode(slice));
            await new Promise(r => setTimeout(r, 10));
          }
        } else {
          // Stream from AI provider
          try {
            const provider = getProviderForModel(model);

            // Build full messages array with conversation history + current prompt
            const allMessages: AIMessage[] = [
              ...conversationHistory,
              { role: 'user', content: sPrompt },
            ];

            const providerStream = await provider.generateStream(allMessages, {
              model,
              systemInstruction,
              requestId,
              ...(isGuest ? { maxTokens: 800 } : {}),
            });

            const reader = providerStream.getReader();

            // Add timeout safety net
            const timeoutId = setTimeout(() => {
              try {
                reader.cancel();
                if (!fullReply) {
                  const timeoutMsg = 'The response took too long. Please try again.';
                  controller.enqueue(encoder.encode(timeoutMsg));
                  fullReply = timeoutMsg;
                }
              } catch {
                // Reader may already be closed
              }
            }, STREAM_TIMEOUT_MS);

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                  fullReply += value;
                  controller.enqueue(encoder.encode(value));
                }
              }
            } finally {
              clearTimeout(timeoutId);
            }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (aiErr: any) {
            const classified = aiErr instanceof CygmaAIError
              ? aiErr
              : new CygmaAIError({
                  type: 'UNKNOWN',
                  statusCode: 500,
                  userMessage: 'Something went wrong while processing your request. Please try again.',
                  developerMessage: aiErr?.message || String(aiErr),
                });

            logError('Stream Route', classified.developerMessage, {
              requestId,
              model,
              statusCode: classified.statusCode,
              errorType: classified.type,
              latencyMs: Date.now() - startTime,
            });

            // Stream a user-friendly error message (not the internal details)
            const errorText = classified.userMessage;
            for (let i = 0; i < errorText.length; i += 8) {
              const slice = errorText.slice(i, i + 8);
              fullReply += slice;
              controller.enqueue(encoder.encode(slice));
              await new Promise(r => setTimeout(r, 15));
            }
          }
        }

        // 7. Log assistant response to Supabase (Authenticated Users only)
        if (!isGuest) {
          try {
            await sb.from('messages').insert({
              conversation_id: activeConversationId,
              sender_role: 'assistant',
              content: fullReply,
            });
          } catch (_dbErr) {
            logError('Stream Route', 'Failed logging assistant message', { requestId });
          }
        }

        logInfo('Stream Route', 'Request completed', {
          requestId,
          model,
          isGuest,
          replyLength: fullReply.length,
          latencyMs: Date.now() - startTime,
        });

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Request-Id': requestId,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError('Stream Route', error, {
      requestId,
      latencyMs: Date.now() - startTime,
    });

    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again.',
        requestId,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
