import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    system: `You are an expert Agentic AI Health Consultant specializing in Obesity Risk Assessment. 
    Your objective is to interview the user or analyze their input to map them to an obesity level risk category based on classic epidemiological dataset features.
    
    Dataset classification references from Kaggle:
    - Insufficient Weight
    - Normal Weight
    - Overweight Level I & II
    - Obesity Type I, II & III
    
    You must dynamically evaluate features like: age, family history, dietary habits (FAVC - high caloric food, FCVC - vegetable consumption), and physical activity levels (FAF). Always use the calculateBmi tool if weight and height are provided to ground your classification accurately. Be professional, clear, and state that this is for educational purposes based on dataset analysis.`,
    tools: {
      calculateBmi: tool({
        description: 'Calculates Body Mass Index given weight in kilograms and height in meters.',
        parameters: z.object({
          weightKg: z.number().describe('Weight in kilograms'),
          heightMeters: z.number().describe('Height in meters'),
        }),
        execute: async ({ weightKg, heightMeters }) => {
          const bmi = weightKg / (heightMeters * heightMeters);
          return { bmi: parseFloat(bmi.toFixed(2)) };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}