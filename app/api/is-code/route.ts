import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const params = await req.json()

    // Call the FastAPI backend
    const response = await fetch("http://localhost:8000/api/is-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in is-code API:", error)

    // Fallback to simulated responses if the backend is not available
    let result = {
      codeSection: "",
      explanation: "",
      relatedCodes: [],
    }

    // Check if params is defined before accessing its properties
    // Also, handle cases where params might be null or undefined
    let params = {}
    try {
      params = await req.json()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
    }

    if (
      params &&
      params.isCode === "IS:456" &&
      (params.topic === "slab" || (params.searchQuery && params.searchQuery.toLowerCase().includes("slab")))
    ) {
      result = {
        codeSection: `IS:456-2000, Section 26.5.2.1 - Minimum Reinforcement for Slabs

The minimum reinforcement in either direction in slabs should be:
- 0.15% of the total cross-sectional area for Fe 250 steel
- 0.12% of the total cross-sectional area for Fe 415 or Fe 500 steel

Maximum spacing of reinforcement should not exceed:
- 3 times the effective depth of solid slab
- 450 mm, whichever is smaller`,
        explanation: `This section specifies the minimum amount of reinforcement required in RCC slabs to prevent sudden failure and control cracking due to temperature and shrinkage effects.

For students, this means:
1. For a 100mm thick slab with 1m width using Fe 500 steel:
   - Cross-sectional area = 100mm × 1000mm = 100,000mm²
   - Minimum steel required = 0.12% of 100,000mm² = 120mm²
   - This could be provided by 8mm bars @ 400mm c/c (126mm²)

2. The maximum spacing rule ensures that reinforcement is distributed properly across the slab.

3. This is the absolute minimum - actual design will typically require more reinforcement based on loads and spans.`,
        relatedCodes: [
          "IS:456-2000 Section 26.5.2.2 - Maximum Reinforcement",
          "IS:456-2000 Section 24 - Serviceability Requirements",
        ],
      }
    }

    return NextResponse.json(result)
  }
}
