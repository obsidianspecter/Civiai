import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Call the FastAPI backend
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in chat API:", error)

    // Fallback to simulated responses if the backend is not available
    // Assuming messages is available in the catch block due to the try block
    const messages = (await req.json()).messages
    const lastMessage = messages[messages.length - 1]
    let aiResponse =
      "I'd be happy to help with your civil engineering question. Could you provide more specific details about what you'd like to know?"

    const lowerInput = lastMessage.content.toLowerCase()
    if (lowerInput.includes("m25") && lowerInput.includes("m30")) {
      aiResponse = `# Differences between M25 and M30 Grade Concrete

### Strength
- **M25**: Characteristic compressive strength of 25 MPa (N/mm²) at 28 days
- **M30**: Characteristic compressive strength of 30 MPa (N/mm²) at 28 days

### Mix Ratio
- **M25**: 1:1:2 (cement:sand:aggregate) with water-cement ratio of 0.44-0.48
- **M30**: 1:0.75:1.5 with water-cement ratio of 0.42-0.45

### Use Cases
- **M25**: Commonly used in RCC columns, beams, slabs for residential buildings
- **M30**: Used in more demanding structures like bridges, high-rise buildings, industrial structures

### Testing Procedures
Both grades follow the same testing procedures as per IS 456:
1. Cube test (150mm × 150mm × 150mm specimens)
2. Slump test for workability
3. Compaction factor test

The main difference is the expected strength results at 28 days.`
    } else if (lowerInput.includes("beam") && lowerInput.includes("moment")) {
      aiResponse = `For a simply supported beam of span 6m carrying a UDL of 20 kN/m:

### Maximum Bending Moment Calculation
1. For a simply supported beam with UDL, the maximum bending moment occurs at the center
2. Formula: M_max = (w * L²) / 8
   - w = 20 kN/m (UDL)
   - L = 6m (span)
   3. M_max = (20 * 6²) / 8 = (20 * 36) / 8 = 720 / 8 = 90 kN·m

Therefore, the maximum bending moment is 90 kN·m.

This assumes:
- The beam has constant cross-section
- The load is perfectly uniform
- No additional point loads are present`
    }

    return NextResponse.json({ text: aiResponse, role: "assistant" })
  }
}
