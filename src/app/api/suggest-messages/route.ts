import { NextResponse } from 'next/server';

// Ensure the API key is present
const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!COHERE_API_KEY) {
  throw new Error('COHERE_API_KEY is not defined in the environment variables');
}

export const runtime = 'edge'; // Edge runtime for Next.js

export async function POST() {
  try {
    // Define the prompt
    const prompt = "Generate exactly three sarcastic and humorous questions suitable for an anonymous social messaging platform. each questions should be separated by || with no additional explanation, introductions, or formatting. Only return the three questions. Don't repeat any part of the prompt just give the three questions.directly start the response wit the first question, don't give the answers just some random question. example: Who needs friends when you have Instagram followers? || Isn't it fun when you accidentally forget your password to an account that's connected to literally everything? || Got any more fake IDs you want me to hold onto for you?  don't add :Sure, here are three sarcastic and humorous questions suitable for an anonymous social messaging platform: at the start of the response,directly give the questions";

    // Prepare the configuration object for the generation
    const config = {
      prompt: prompt,
      max_tokens: 100, // Adjust max tokens as needed
      temperature: 0.7, // Added temperature field (value between 0 and 1)
    };

    // Call Cohere API using fetch with the correct model
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-xlarge', // Use the correct model ID here
        ...config, // Spread the config for prompt, max_tokens, and temperature
      }),
    });

    // Check if response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to fetch response from Cohere API');
    }

    // Parse the response body and extract the generated text
    const data = await response.json();
    const generatedText = data.generations[0].text; // Get the generated text

    return NextResponse.json({generatedText });
  } catch (error) {
    // Log any errors and return a generic error response
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
