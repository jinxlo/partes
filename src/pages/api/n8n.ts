import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Define the metadata schema
const metadataSchema = z.object({
  userCar: z.object({
    brand: z.string(),
    model: z.string(),
    year: z.string(),
  }).optional(),
  timestamp: z.string().optional(),
  source: z.string().optional(),
  sessionId: z.string().optional(),
  version: z.string().optional(),
});

// Define the complete request schema
const requestSchema = z.object({
  type: z.string(),
  data: z.object({
    message: z.string(),
    metadata: metadataSchema.optional(),
  }),
});

async function callN8NWebhook(payload: any) {
  const webhookUrl = "https://api.worldapptechnologies.com/webhook-test/partes";
  
  try {
    // Format the payload to match the LLM requirements
    const formattedPayload = {
      messages: [
        `Human: ${payload.data.message}`
      ],
      estimatedTokens: payload.data.message.split(' ').length,
      options: {
        api_key: {
          lc: 1,
          type: "secret",
          id: ["GROQ_API_KEY"]
        },
        model_name: "llama-3.2-3b-preview",
        temperature: 0.7
      }
    };

    console.log('Sending payload to N8N:', JSON.stringify(formattedPayload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'PartesChatbot/1.0',
      },
      body: JSON.stringify(formattedPayload),
    });

    console.log('N8N Response Status:', response.status);

    if (!response.ok) {
      console.error('N8N Error Response:', await response.text());
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('N8N Response Data:', data);

    return data;
  } catch (error) {
    console.error('Error calling N8N:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Validate the incoming request
    const validatedData = requestSchema.parse(req.body);

    // Call the N8N webhook
    try {
      const webhookResponse = await callN8NWebhook(validatedData);
      
      // Return the webhook response
      return res.status(200).json(webhookResponse);
    } catch (webhookError) {
      console.error('Webhook error details:', webhookError);
      
      return res.status(200).json({
        message: "Lo siento, estoy teniendo dificultades para procesar tu solicitud. Por favor, intenta de nuevo en unos momentos."
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    return res.status(200).json({
      message: "Lo siento, ha ocurrido un error inesperado. Por favor, intenta de nuevo."
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};