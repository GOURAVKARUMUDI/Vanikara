export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getProviderForModel, CygmaAIError } from '@/lib/ai/providers';
import type { AIMessage } from '@/lib/ai/providers';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { sanitize, apiResponse, logError, logInfo } from "@/lib/security";
import { isRateLimited } from "@/lib/rateLimit";

const CYGMA_SYSTEM_INSTRUCTION = `You are CYGMA AI, the flagship intelligence platform developed by VANIKARA Intelligence Private Limited.
Deliver responses with a professional, accurate, and highly technical tone. 
Your core fields are software engineering, academic support, cybersecurity architecture, coding, and business operations advice.
Identify clearly as CYGMA AI, powered by state-of-the-art base models connected through secure company API nodes. 
Do not claim to have trained or own the underlying base models.
Format responses using Markdown when appropriate: use code blocks for code, bold for emphasis, bullet points for lists.`;

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    // 0. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const limitCheck = await isRateLimited(ip);
    if (limitCheck.limited) {
      return NextResponse.json(
        apiResponse(false, null, "Too many requests. Please wait a minute before querying CYGMA again."),
        { 
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((limitCheck.reset - Date.now()) / 1000))
          }
        }
      );
    }

    // 1. Authenticate
    const cookieStore = await cookies();
    const sb = createClient(cookieStore);
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
      return NextResponse.json(
        apiResponse(false, null, "Unauthorized access. Please log in."),
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, null, "Invalid JSON in request body."),
        { status: 400 }
      );
    }

    const { prompt, model = 'gpt-4o', conversationId } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        apiResponse(false, null, "Prompt parameter is required and must be a non-empty string."),
        { status: 400 }
      );
    }

    if (prompt.length > 32_000) {
      return NextResponse.json(
        apiResponse(false, null, "Prompt exceeds maximum length."),
        { status: 413 }
      );
    }

    const sPrompt = sanitize(prompt).slice(0, 32_000);

    logInfo('AI Route', 'Text request received', {
      requestId,
      model,
      promptLength: sPrompt.length,
      userId: user.id,
    });

    // 3. Build conversation history for multi-turn context
    let conversationHistory: AIMessage[] = [];

    if (conversationId) {
      try {
        const { data: dbMessages } = await sb
          .from('messages')
          .select('sender_role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(20);

        if (dbMessages && dbMessages.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          conversationHistory = dbMessages.map((m: any) => ({
            role: m.sender_role as 'user' | 'assistant',
            content: m.content,
          }));
        }
      } catch (_histErr) {
        logError('AI Route', 'Failed fetching conversation history', { requestId });
      }
    }

    // 4. Generate text response
    const provider = getProviderForModel(model);

    const allMessages: AIMessage[] = [
      ...conversationHistory,
      { role: 'user', content: sPrompt },
    ];

    const reply = await provider.generateText(allMessages, {
      model,
      systemInstruction: CYGMA_SYSTEM_INSTRUCTION,
      requestId,
    });

    // 5. Log to database
    try {
      await sb.from('ai_logs').insert({
        user_id: user.id,
        prompt: sPrompt,
        response: reply,
      });
    } catch (_dbErr) {
      logError('AI Route', 'Failed logging to ai_logs', { requestId });
    }

    logInfo('AI Route', 'Text request completed', {
      requestId,
      model,
      replyLength: reply.length,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json(apiResponse(true, { reply }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const classified = e instanceof CygmaAIError ? e : null;

    logError('AI Route', e, {
      requestId,
      statusCode: classified?.statusCode || 500,
      errorType: classified?.type || 'UNKNOWN',
      latencyMs: Date.now() - startTime,
    });

    const userMessage = classified?.userMessage
      || "Something went wrong while processing your request. Please try again.";

    return NextResponse.json(
      apiResponse(false, null, userMessage),
      { status: classified?.statusCode || 500 }
    );
  }
}
