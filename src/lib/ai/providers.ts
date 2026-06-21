import { openai, isOpenAIConfigured } from '@/lib/openai';
import { logError, logInfo } from '@/lib/security';
import type OpenAI from 'openai';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProviderOptions {
  model: string;
  systemInstruction?: string;
  maxTokens?: number;
  temperature?: number;
  requestId?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  generateStream(messages: AIMessage[], options: AIProviderOptions): Promise<ReadableStream<string>>;
  generateText(messages: AIMessage[], options: AIProviderOptions): Promise<string>;
}

// ─────────────────────────────────────────────
// Error Classification
// ─────────────────────────────────────────────

export type CygmaErrorType =
  | 'INVALID_API_KEY'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'MODEL_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'PROVIDER_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'CONTEXT_LENGTH_EXCEEDED'
  | 'QUOTA_EXCEEDED'
  | 'UNKNOWN';

export class CygmaAIError extends Error {
  public readonly type: CygmaErrorType;
  public readonly statusCode: number;
  public readonly userMessage: string;
  public readonly developerMessage: string;
  public readonly retryAfter?: number;

  constructor(params: {
    type: CygmaErrorType;
    statusCode: number;
    userMessage: string;
    developerMessage: string;
    retryAfter?: number;
  }) {
    super(params.developerMessage);
    this.name = 'CygmaAIError';
    this.type = params.type;
    this.statusCode = params.statusCode;
    this.userMessage = params.userMessage;
    this.developerMessage = params.developerMessage;
    this.retryAfter = params.retryAfter;
  }
}

/**
 * Classify a raw OpenAI SDK error into a structured CygmaAIError.
 */
function classifyOpenAIError(err: any): CygmaAIError {
  const status = err?.status || err?.response?.status || 0;
  const code = err?.code || err?.error?.code || '';
  const message = err?.message || String(err);

  // Authentication failures
  if (status === 401 || code === 'invalid_api_key') {
    return new CygmaAIError({
      type: 'INVALID_API_KEY',
      statusCode: 401,
      userMessage: 'AI services are temporarily unavailable. Our team has been notified.',
      developerMessage: `OpenAI authentication failed (401): ${message}`,
    });
  }

  // Permission / billing issues
  if (status === 403) {
    return new CygmaAIError({
      type: 'INSUFFICIENT_PERMISSIONS',
      statusCode: 403,
      userMessage: 'AI services are temporarily unavailable. Our team has been notified.',
      developerMessage: `OpenAI permission denied (403): ${message}`,
    });
  }

  // Model not found
  if (status === 404 || code === 'model_not_found') {
    return new CygmaAIError({
      type: 'MODEL_NOT_FOUND',
      statusCode: 404,
      userMessage: 'The requested AI model is unavailable. Switching to an alternative.',
      developerMessage: `OpenAI model not found (404): ${message}`,
    });
  }

  // Rate limiting & Quota
  if (status === 429 || code === 'rate_limit_exceeded' || code === 'insufficient_quota') {
    const isQuota = code === 'insufficient_quota' || message.includes('quota') || message.includes('exceeded your current quota');
    
    if (isQuota) {
      return new CygmaAIError({
        type: 'QUOTA_EXCEEDED',
        statusCode: 429,
        userMessage: 'AI billing quota exceeded. Please check payment method or update API key.',
        developerMessage: `OpenAI quota exceeded (429): ${message}`,
      });
    }

    const retryAfter = err?.headers?.['retry-after']
      ? parseInt(err.headers['retry-after'], 10)
      : undefined;
    return new CygmaAIError({
      type: 'RATE_LIMITED',
      statusCode: 429,
      userMessage: 'CYGMA AI is experiencing high demand. Please try again in a moment.',
      developerMessage: `OpenAI rate limited (429): ${message}`,
      retryAfter,
    });
  }

  // Context length exceeded
  if (code === 'context_length_exceeded' || message.includes('maximum context length')) {
    return new CygmaAIError({
      type: 'CONTEXT_LENGTH_EXCEEDED',
      statusCode: 400,
      userMessage: 'Your message is too long for the current model. Please shorten your input or start a new conversation.',
      developerMessage: `Context length exceeded: ${message}`,
    });
  }

  // Provider unavailable (5xx)
  if (status >= 500) {
    return new CygmaAIError({
      type: 'PROVIDER_UNAVAILABLE',
      statusCode: status,
      userMessage: 'AI services are temporarily unavailable. Please try again shortly.',
      developerMessage: `OpenAI server error (${status}): ${message}`,
    });
  }

  // Network-level failures
  if (
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    message.includes('timeout') ||
    message.includes('network') ||
    err?.name === 'AbortError'
  ) {
    return new CygmaAIError({
      type: 'NETWORK_ERROR',
      statusCode: 0,
      userMessage: 'Unable to reach AI services. Please check your connection and retry.',
      developerMessage: `Network error: ${message}`,
    });
  }

  // Unknown / fallback
  return new CygmaAIError({
    type: 'UNKNOWN',
    statusCode: status || 500,
    userMessage: 'Something went wrong while processing your request. Please try again.',
    developerMessage: `Unclassified OpenAI error: ${message}`,
  });
}

// ─────────────────────────────────────────────
// Model Resolution
// ─────────────────────────────────────────────

/**
 * Maps UI-facing model identifiers to valid OpenAI API model strings.
 * The fallback chain is used when the primary model is unavailable.
 */
const MODEL_MAP: Record<string, string> = {
  'gpt-4o':           'gpt-4o',
  'gpt-4o-mini':      'gpt-4o-mini',
  'gpt-4':            'gpt-4',
  'gpt-4-turbo':      'gpt-4-turbo',
  'gpt-3.5-turbo':    'gpt-4o-mini',  // Deprecated model → migrate to gpt-4o-mini
  // Sidebar models that aren't connected yet route through OpenAI as fallback
  'claude-3-5-sonnet': 'gpt-4o',
  'gemini-1.5-pro':    'gpt-4o',
};

const FALLBACK_CHAIN: string[] = ['gpt-4o', 'gpt-4o-mini'];

const RATE_LIMIT_MAX_RETRIES = 3;
const RATE_LIMIT_BASE_DELAY_MS = 2000; // 2 seconds, doubles each retry

function resolveModel(requestedModel: string): string {
  return MODEL_MAP[requestedModel] || 'gpt-4o-mini';
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────
// Mock Response Helper
// ─────────────────────────────────────────────

function getMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi')) {
    return "Hello! I am CYGMA AI, your professional engineering assistant. How can I help you today?";
  }
  if (lower.includes('python') && (lower.includes('reverse') || lower.includes('function'))) {
    return "Here is a Python function to reverse a string:\n\n```python\ndef reverse_string(s: str) -> str:\n    return s[::-1]\n```\n\nThis uses Python's slice syntax to efficiently reverse the input string.";
  }
  if (lower.includes('react') && (lower.includes('hook') || lower.includes('state') || lower.includes('component'))) {
    return "React hooks are special functions that let you 'hook into' React state and lifecycle features from function components. They allow you to manage state, side effects, and context without writing ES6 classes. Examples include useState and useEffect.";
  }
  if (lower.includes('postgresql') || lower.includes('duplicate') || lower.includes('select') || lower.includes('group by')) {
    return "Here is the PostgreSQL query to find duplicate emails:\n\n```sql\nSELECT email, COUNT(*)\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;\n```\n\nThis groups rows by email and filters for groups with more than one record.";
  }
  return "I am CYGMA AI, developed by VANIKARA Intelligence Private Limited. Powered by state-of-the-art base models connected through secure company API nodes. How can I assist you today?";
}

// ─────────────────────────────────────────────
// OpenAI Provider Implementation
// ─────────────────────────────────────────────

export class OpenAIProvider implements AIProvider {
  id = 'openai';
  name = 'OpenAI';

  async generateStream(
    messages: AIMessage[],
    options: AIProviderOptions
  ): Promise<ReadableStream<string>> {
    const isMock = process.env.CYGMA_MOCK_AI === 'true';

    if (isMock) {
      const mockText = getMockResponse(messages[messages.length - 1]?.content || '');
      return new ReadableStream({
        async start(controller) {
          const chunks = mockText.match(/.{1,8}/g) || [mockText];
          for (const chunk of chunks) {
            controller.enqueue(chunk);
            await sleep(15);
          }
          controller.close();
        }
      });
    }

    if (!isOpenAIConfigured() || !openai) {
      throw new CygmaAIError({
        type: 'INVALID_API_KEY',
        statusCode: 500,
        userMessage: 'AI services are not configured. Please contact support.',
        developerMessage: 'OPENAI_API_KEY is not set. Cannot create OpenAI client.',
      });
    }

    const apiMessages = this.buildMessages(messages, options.systemInstruction);
    const resolvedModel = resolveModel(options.model);
    const rid = options.requestId || 'unknown';

    logInfo('OpenAI Provider', `Stream request`, {
      requestId: rid,
      requestedModel: options.model,
      resolvedModel,
      messageCount: apiMessages.length,
    });

    // Try primary model, then fallback chain
    const modelsToTry = [resolvedModel, ...FALLBACK_CHAIN.filter(m => m !== resolvedModel)];

    let lastError: CygmaAIError | null = null;

    for (const model of modelsToTry) {
      // Attempt with rate-limit retries (exponential backoff)
      for (let attempt = 0; attempt <= RATE_LIMIT_MAX_RETRIES; attempt++) {
        try {
          return await this.createStream(openai, apiMessages, model, options, rid);
        } catch (err: any) {
          lastError = classifyOpenAIError(err);

          logError('OpenAI Provider', lastError, {
            requestId: rid,
            model,
            statusCode: lastError.statusCode,
            errorType: lastError.type,
          });

          // Rate limited → wait and retry
          if (lastError.type === 'RATE_LIMITED' && attempt < RATE_LIMIT_MAX_RETRIES) {
            const delay = lastError.retryAfter
              ? lastError.retryAfter * 1000
              : RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt);
            logInfo('OpenAI Provider', `Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${RATE_LIMIT_MAX_RETRIES})...`, { requestId: rid });
            await sleep(delay);
            continue;
          }

          // Model not found → try next model in fallback chain
          if (lastError.type === 'MODEL_NOT_FOUND') {
            logInfo('OpenAI Provider', `Model "${model}" not found, trying next fallback...`, { requestId: rid });
            break; // Break inner retry loop, continue outer model loop
          }

          // All other errors → throw immediately
          throw lastError;
        }
      }
    }

    // All models and retries exhausted
    throw lastError || new CygmaAIError({
      type: 'PROVIDER_UNAVAILABLE',
      statusCode: 500,
      userMessage: 'AI services are temporarily unavailable. Please try again shortly.',
      developerMessage: 'All models in fallback chain failed.',
    });
  }

  private async createStream(
    client: OpenAI,
    apiMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    model: string,
    options: AIProviderOptions,
    requestId: string
  ): Promise<ReadableStream<string>> {
    const startTime = Date.now();

    const responseStream = await client.chat.completions.create({
      model,
      messages: apiMessages,
      stream: true,
      temperature: options.temperature ?? 0.7,
      ...(options.maxTokens ? { max_tokens: options.maxTokens } : {}),
    });

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(text);
            }
          }

          logInfo('OpenAI Provider', `Stream completed`, {
            requestId,
            model,
            latencyMs: Date.now() - startTime,
          });

          controller.close();
        } catch (streamErr: any) {
          const classified = classifyOpenAIError(streamErr);
          logError('OpenAI Stream', classified, {
            requestId,
            model,
            statusCode: classified.statusCode,
            errorType: classified.type,
            latencyMs: Date.now() - startTime,
          });
          controller.error(classified);
        }
      },
    });
  }

  async generateText(
    messages: AIMessage[],
    options: AIProviderOptions
  ): Promise<string> {
    const isMock = process.env.CYGMA_MOCK_AI === 'true';

    if (isMock) {
      return getMockResponse(messages[messages.length - 1]?.content || '');
    }

    if (!isOpenAIConfigured() || !openai) {
      throw new CygmaAIError({
        type: 'INVALID_API_KEY',
        statusCode: 500,
        userMessage: 'AI services are not configured. Please contact support.',
        developerMessage: 'OPENAI_API_KEY is not set. Cannot create OpenAI client.',
      });
    }

    const apiMessages = this.buildMessages(messages, options.systemInstruction);
    const resolvedModel = resolveModel(options.model);
    const rid = options.requestId || 'unknown';

    logInfo('OpenAI Provider', `Text request`, {
      requestId: rid,
      requestedModel: options.model,
      resolvedModel,
      messageCount: apiMessages.length,
    });

    const modelsToTry = [resolvedModel, ...FALLBACK_CHAIN.filter(m => m !== resolvedModel)];
    let lastError: CygmaAIError | null = null;

    for (const model of modelsToTry) {
      for (let attempt = 0; attempt <= RATE_LIMIT_MAX_RETRIES; attempt++) {
        try {
          const startTime = Date.now();

          const response = await openai.chat.completions.create({
            model,
            messages: apiMessages,
            temperature: options.temperature ?? 0.7,
            ...(options.maxTokens ? { max_tokens: options.maxTokens } : {}),
          });

          logInfo('OpenAI Provider', `Text completed`, {
            requestId: rid,
            model,
            latencyMs: Date.now() - startTime,
            tokensUsed: response.usage?.total_tokens,
          });

          return response.choices[0]?.message?.content || '';
        } catch (err: any) {
          lastError = classifyOpenAIError(err);

          logError('OpenAI Provider', lastError, {
            requestId: rid,
            model,
            statusCode: lastError.statusCode,
            errorType: lastError.type,
          });

          if (lastError.type === 'RATE_LIMITED' && attempt < RATE_LIMIT_MAX_RETRIES) {
            const delay = lastError.retryAfter
              ? lastError.retryAfter * 1000
              : RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt);
            logInfo('OpenAI Provider', `Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${RATE_LIMIT_MAX_RETRIES})...`, { requestId: rid });
            await sleep(delay);
            continue;
          }

          if (lastError.type === 'MODEL_NOT_FOUND') {
            logInfo('OpenAI Provider', `Model "${model}" not found, trying next fallback...`, { requestId: rid });
            break;
          }

          throw lastError;
        }
      }
    }

    throw lastError || new CygmaAIError({
      type: 'PROVIDER_UNAVAILABLE',
      statusCode: 500,
      userMessage: 'AI services are temporarily unavailable. Please try again shortly.',
      developerMessage: 'All models in fallback chain failed.',
    });
  }

  /**
   * Build the final messages array with system instruction prepended.
   */
  private buildMessages(
    messages: AIMessage[],
    systemInstruction?: string
  ): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    const result: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

    if (systemInstruction) {
      result.push({ role: 'system', content: systemInstruction });
    }

    for (const msg of messages) {
      result.push({ role: msg.role, content: msg.content });
    }

    return result;
  }
}

// ─────────────────────────────────────────────
// Provider Registry & Factory
// ─────────────────────────────────────────────

class AIProviderRegistry {
  private providers: Record<string, AIProvider> = {};

  public register(provider: AIProvider) {
    this.providers[provider.id] = provider;
  }

  public getProvider(id: string): AIProvider {
    const p = this.providers[id];
    if (!p) {
      throw new Error(`AI Provider "${id}" is not registered in CYGMA AI.`);
    }
    return p;
  }
}

// Global registry setup
export const providerRegistry = new AIProviderRegistry();
providerRegistry.register(new OpenAIProvider());

// Factory mapping models to providers
export function getProviderForModel(model: string): AIProvider {
  // 1. Check Anthropic API key availability for Claude models
  if (model.includes('claude')) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new CygmaAIError({
        type: 'PROVIDER_UNAVAILABLE',
        statusCode: 501,
        userMessage: 'Claude 3.5 Sonnet is currently unavailable. Anthropic integration is not configured (missing ANTHROPIC_API_KEY).',
        developerMessage: 'Claude model requested, but ANTHROPIC_API_KEY environment variable is not configured.',
      });
    }
  }

  // 2. Check Gemini API key availability for Gemini models
  if (model.includes('gemini')) {
    if (!process.env.GEMINI_API_KEY) {
      throw new CygmaAIError({
        type: 'PROVIDER_UNAVAILABLE',
        statusCode: 501,
        userMessage: 'Gemini 1.5 Pro is currently unavailable. Google Gemini integration is not configured (missing GEMINI_API_KEY).',
        developerMessage: 'Gemini model requested, but GEMINI_API_KEY environment variable is not configured.',
      });
    }
  }

  // 3. All configured models route through OpenAI provider registry for execution
  if (model.startsWith('gpt-') || model === 'gpt-4o' || model === 'gpt-4o-mini' || model.includes('claude') || model.includes('gemini')) {
    return providerRegistry.getProvider('openai');
  }

  return providerRegistry.getProvider('openai');
}
