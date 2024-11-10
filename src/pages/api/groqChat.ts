import { NextApiRequest, NextApiResponse } from 'next';
import { Groq } from 'groq-sdk';
import { z } from 'zod';

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Define the schema for the incoming request
const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'system', 'assistant']),
    content: z.string(),
  })),
});

// Define available parts database mock
// In a real application, this would come from your actual database
const partsDatabase = {
  stores: [
    { id: 1, name: "AutoParts Plus", rating: 4.8, location: "Ciudad de México", specialties: ["Frenos", "Suspensión"] },
    { id: 2, name: "MechanicsMaster", rating: 4.6, location: "Guadalajara", specialties: ["Motores", "Transmisión"] },
    { id: 3, name: "SparkPlugPro", rating: 4.9, location: "Monterrey", specialties: ["Sistema Eléctrico", "Bujías"] }
  ],
  categories: [
    "Frenos", "Motor", "Suspensión", "Sistema Eléctrico", "Transmisión", 
    "Filtración", "Refrigeración", "Escape", "Dirección", "Carrocería"
  ]
};

const systemPrompt = `Eres Partes App Bot, un asistente especializado en la búsqueda y recomendación de refacciones automotrices.

CONTEXTO:
- Tienes acceso a una amplia base de datos de refacciones automotrices en México
- Puedes buscar por marca, modelo, año y tipo de pieza
- Proporcionas información detallada sobre disponibilidad, precios y ubicación de las tiendas

TUS RESPONSABILIDADES:
1. Ayudar a los usuarios a encontrar las refacciones específicas que necesitan
2. Proporcionar información detallada sobre:
   - Especificaciones técnicas de las piezas
   - Compatibilidad con diferentes modelos
   - Precios y comparativas
   - Ubicación y rating de las tiendas
   - Tiempo estimado de entrega
   - Garantías disponibles

3. Ofrecer recomendaciones considerando:
   - Calidad de las piezas
   - Relación calidad-precio
   - Reputación del fabricante
   - Opiniones de otros usuarios
   - Disponibilidad inmediata

4. Factores importantes a mencionar en cada recomendación:
   - Origen de la pieza (original/alternativo)
   - Garantía ofrecida
   - Certificaciones de calidad
   - Compatibilidad verificada
   - Tiempo de instalación estimado

FORMATO DE RESPUESTA:
- Mantén un tono profesional pero amigable
- Organiza la información de manera clara y estructurada
- Incluye siempre precios, disponibilidad y ubicación
- Menciona las garantías y políticas de devolución
- Sugiere piezas alternativas cuando sea relevante

Si no tienes información específica sobre algún producto, indícalo claramente y sugiere alternativas o recomienda consultar directamente con las tiendas disponibles.

Base de datos actual de tiendas asociadas:
${JSON.stringify(partsDatabase.stores, null, 2)}

Categorías de productos disponibles:
${JSON.stringify(partsDatabase.categories, null, 2)}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate the request body
    const { messages } = requestSchema.parse(req.body);

    // Add system prompt if it's not already present
    const systemMessage = {
      role: 'system',
      content: systemPrompt
    };

    const fullMessages = messages[0]?.role === 'system' 
      ? messages 
      : [systemMessage, ...messages];

    // Call the Groq API
    const completion = await groq.chat.completions.create({
      messages: fullMessages,
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
      stop: null,
      stream: false,
    });

    // Send the response back to the client
    return res.status(200).json(completion.choices[0]?.message?.content || '');
  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}