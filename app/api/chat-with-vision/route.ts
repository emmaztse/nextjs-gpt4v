import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, data } = await req.json()

  const initialMessages = messages.slice(0, -1)
  const currentMessage = messages[messages.length - 1]

  const base64Images: string[] = JSON.parse(data.base64Images)

  const images = base64Images.map((base64Image) => ({
    type: 'image_url',
    image_url: base64Image,
  }))

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    stream: true,
    max_tokens: 150,
    messages: [
      ...initialMessages,
      {role: 'system', content: 'I am a nutritional expert. I make my response to each question easy and fun for an eight-year old to understand.
                                 I only answer questions on nutrition, ingredients, or food. When asked a question, I will 
                                 answer clearly and concisely. I will make sure not to give out too much irelivent information. The only banned ingredients 
                                 I know are: tonka bean, whale oil, and insect flour.'},
      {
        ...currentMessage,        
        content: [{ type: 'text', text: currentMessage.content }, ...images],
      },
    ],
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
