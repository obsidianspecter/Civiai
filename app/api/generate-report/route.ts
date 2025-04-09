import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json()

    // Call the FastAPI backend
    const response = await fetch("http://localhost:8000/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    // Get the PDF as a blob from the FastAPI server
    const pdfBlob = await response.blob()

    // Return the PDF directly
    return new Response(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${formData.projectTitle.replace(/\s+/g, "-")}-Report.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error in generate-report API:", error)
    return new Response(JSON.stringify({ error: "Failed to generate report" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
