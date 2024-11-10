// n8nconnect.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Types for better type safety
interface ChatRequest {
  type: 'chat';
  data: {
    message: string;
    metadata?: {
      userCar?: {
        brand: string;
        model: string;
        year: string;
      };
      timestamp?: string;
      source?: string;
      sessionId?: string;
      userLanguage?: string;
      clientInfo?: {
        userAgent: string;
        platform: string;
      };
    };
  };
}

interface N8NResponse {
  message?: string;
  data?: any;
  error?: string;
}

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  'https://api.worldapptechnologies.com/webhook/partes';
const N8N_API_KEY = process.env.N8N_API_KEY;

// Helper function to validate request
const validateRequest = (
  req: NextApiRequest
): req is NextApiRequest & { body: ChatRequest } => {
  const body = req.body;
  return (
    body &&
    typeof body === 'object' &&
    body.type === 'chat' &&
    body.data &&
    typeof body.data.message === 'string'
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<N8NResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method not allowed',
      error: 'Only POST requests are allowed',
    });
  }

  // Validate request format
  if (!validateRequest(req)) {
    return res.status(400).json({
      message: 'Invalid request format',
      error: 'Request must include type: "chat" and data.message',
    });
  }

  try {
    // Send request to N8N webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_API_KEY && { Authorization: `Bearer ${N8N_API_KEY}` }),
      },
      body: JSON.stringify({
        message: req.body.data.message,
        metadata: {
          ...req.body.data.metadata,
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`N8N request failed with status: ${response.status}`);
    }

    const result = await response.json();

    // Extract the message from the response
    let messageContent = '';
    if (result.response?.generations?.[0]?.[0]?.text) {
      messageContent = result.response.generations[0][0].text;
    } else if (result.message) {
      messageContent = result.message;
    } else {
      messageContent = 'Lo siento, no pude procesar tu mensaje correctamente.';
    }

    // Return the message
    return res.status(200).json({
      message: messageContent,
      data: result,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      message: 'Lo siento, ha ocurrido un error al procesar tu mensaje.',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : 'Internal server error',
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
