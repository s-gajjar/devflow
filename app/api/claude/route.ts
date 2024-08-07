import { NextResponse } from "next/server";
import Anthropic from '@anthropic-ai/sdk';

export const POST = async (request: Request) => {
    try {
        const { question } = await request.json();
        console.log('Received question:', question);

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        console.log('Sending request to Claude API...');
        const response = await anthropic.completions.create({
            model: "claude-2",
            prompt: `Human: ${question}\n\nAssistant:`,
            max_tokens_to_sample: 300,
            temperature: 0.5,
        });

        console.log('Received response from Claude API:', response);

        const reply = response.completion;

        return NextResponse.json({
            success: true,
            reply
        });
    } catch (e: any) {
        console.error('Error in Claude API route:', e);
        return NextResponse.json({
            success: false,
            error: e.message || 'An error occurred while processing your request.'
        });
    }
}