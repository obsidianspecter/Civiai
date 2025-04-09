import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20
const requestCounts = new Map<string, { count: number; timestamp: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const userRequests = requestCounts.get(ip)

  if (!userRequests || (now - userRequests.timestamp) > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now })
    return false
  }

  if (userRequests.count >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  userRequests.count++
  return false
}

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { message: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { message: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }

    // Get the OpenRouter API key from environment variables
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { message: 'Please configure your OpenRouter API key in the environment variables.' },
        { status: 500 }
      )
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'CiviAI - Civil Engineering Assistant'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v3-base:free',
        messages: [
          {
            role: 'system',
            content: `You are a highly knowledgeable Civil Engineering AI Assistant. Your expertise covers:
- Structural engineering and analysis
- Construction materials and methods
- Project planning and management
- Building codes and standards
- Environmental considerations
- Cost estimation and quantity surveying
- Quality control and safety protocols
- Geotechnical engineering
- Transportation engineering
- Water resources engineering

Provide detailed, technical, and accurate responses while maintaining clarity and professionalism. Use relevant engineering terms, standards, and calculations when appropriate.`
          },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('OpenRouter API error:', error)
      
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Invalid API key. Please check your OpenRouter API key configuration.' },
          { status: 401 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { message: 'OpenRouter API rate limit reached. Please try again later.' },
          { status: 429 }
        )
      }
      
      throw new Error('Failed to get response from OpenRouter')
    }

    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenRouter')
    }
    
    return NextResponse.json({ message: data.choices[0].message.content })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { 
        message: 'An error occurred while processing your request. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
