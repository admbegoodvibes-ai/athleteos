import { GoogleGenAI } from '@google/genai';
import { ZodSchema } from 'zod';

export class AthleteOSAIClient {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  private async withRetry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
    const delays = [1000, 2000, 4000];
    let lastError: any;

    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.error(`AI operation failed (attempt ${i + 1}/${retries}):`, error);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delays[i]));
        }
      }
    }
    throw lastError;
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs = 30000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout exceeded')), timeoutMs))
    ]);
  }

  async generateMatchAnalysis<T>(prompt: string, responseSchema: ZodSchema): Promise<T> {
    const operation = async () => {
      // Provide a structured schema instruction based on zod schema.
      // In a real implementation this would use the typed generation capabilities.
      // Here we assume GoogleGenAI provides structured JSON generation.
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          // The structured output would map the zod schema here
          // schema: ... 
        }
      });
      const data = JSON.parse(response.text || '{}');
      return responseSchema.parse(data) as T;
    };
    return this.withTimeout(this.withRetry(operation));
  }

  async generateText(prompt: string): Promise<string> {
    const operation = async () => {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });
      return response.text || '';
    };
    return this.withTimeout(this.withRetry(operation));
  }
}
