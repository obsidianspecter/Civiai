from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import json
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.units import inch
import io
import markdown
from xhtml2pdf import pisa
from bs4 import BeautifulSoup
import tempfile
import datetime

app = FastAPI()

# Configure CORS with proper origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://civiai-project.vercel.app",  # Replace with your Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama API endpoint (assuming Ollama is running locally)
OLLAMA_API = "http://localhost:11434/api/generate"

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ReportRequest(BaseModel):
    projectTitle: str
    projectType: str
    clientName: Optional[str] = None
    location: Optional[str] = None
    objective: str
    materials: str
    methodology: str
    results: str

class ISCodeRequest(BaseModel):
    isCode: str
    topic: Optional[str] = None
    searchQuery: Optional[str] = None

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Format messages for Ollama
        prompt = "You are a civil engineering expert assistant. "
        
        for msg in request.messages:
            if msg.role == "user":
                prompt += f"User: {msg.content}\n"
            elif msg.role == "assistant":
                prompt += f"Assistant: {msg.content}\n"
        
        prompt += "Assistant: "
        
        # Call Ollama API
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                OLLAMA_API,
                json={
                    "model": "llama3.2",  # Use the appropriate model name
                    "prompt": prompt,
                    "stream": False
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Error from Ollama API: {response.text}")
            
            result = response.json()
            return {"text": result["response"], "role": "assistant"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def markdown_to_html(markdown_text):
    """Convert markdown to HTML for PDF generation"""
    return markdown.markdown(markdown_text, extensions=['tables', 'fenced_code'])

def create_pdf_from_html(html_content, output_file):
    """Convert HTML to PDF"""
    with open(output_file, "wb") as result_file:
        pisa_status = pisa.CreatePDF(html_content, dest=result_file)
    return not pisa_status.err

@app.post("/api/generate-report")
async def generate_report(request: ReportRequest):
    try:
        # Create a temporary HTML file
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 30px; }}
                h1 {{ color: #333366; text-align: center; }}
                h2 {{ color: #333366; margin-top: 20px; }}
                .section {{ margin-top: 15px; }}
                .footer {{ text-align: center; font-size: 10px; margin-top: 30px; }}
                table {{ width: 100%; border-collapse: collapse; }}
                table, th, td {{ border: 1px solid #ddd; }}
                th, td {{ padding: 8px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
            </style>
        </head>
        <body>
            <h1>{request.projectTitle}</h1>
            
            <div class="section">
                <p><strong>Project Type:</strong> {request.projectType}</p>
                {"<p><strong>Client:</strong> " + request.clientName + "</p>" if request.clientName else ""}
                {"<p><strong>Location:</strong> " + request.location + "</p>" if request.location else ""}
            </div>
            
            <h2>Objective</h2>
            <div class="section">
                {markdown_to_html(request.objective)}
            </div>
            
            <h2>Materials Used</h2>
            <div class="section">
                {markdown_to_html(request.materials)}
            </div>
            
            <h2>Methodology</h2>
            <div class="section">
                {markdown_to_html(request.methodology)}
            </div>
            
            <h2>Results & Findings</h2>
            <div class="section">
                {markdown_to_html(request.results)}
            </div>
            
            <div class="footer">
                <p>Generated by CiviAI - Civil Engineering Assistant</p>
                <p>Date: {datetime.datetime.now().strftime("%Y-%m-%d")}</p>
            </div>
        </body>
        </html>
        """
        
        # Create a temporary file for the PDF
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_file:
            pdf_path = tmp_file.name
        
        # Generate PDF from HTML
        create_pdf_from_html(html_content, pdf_path)
        
        # Read the PDF file
        with open(pdf_path, "rb") as pdf_file:
            pdf_content = pdf_file.read()
        
        # Clean up the temporary file
        os.unlink(pdf_path)
        
        # Return the PDF as a response
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{request.projectTitle.replace(" ", "-")}-Report.pdf"'
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/is-code")
async def search_is_code(request: ISCodeRequest):
    try:
        # Format prompt for Ollama
        prompt = f"""You are a civil engineering expert assistant. 
        Provide detailed information about {request.isCode}"""
        
        if request.topic:
            prompt += f" regarding {request.topic}"
        
        if request.searchQuery:
            prompt += f". The user is asking about: {request.searchQuery}"
        
        prompt += """
        Format your response in the following structure:
        1. Code Section: Provide the exact section number and title
        2. Content: The actual content of the code section
        3. Explanation: A detailed explanation in simple terms
        4. Related Codes: List at least 2 related code sections
        """
        
        # Call Ollama API
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                OLLAMA_API,
                json={
                    "model": "llama3.2",  # Use the appropriate model name
                    "prompt": prompt,
                    "stream": False
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Error from Ollama API: {response.text}")
            
            result = response.json()
            response_text = result["response"]
            
            # Parse the response to extract sections
            # This is a simple parsing logic - in a real implementation, you might want to use more robust parsing
            sections = response_text.split("\n\n")
            code_section = ""
            explanation = ""
            related_codes = []
            
            for section in sections:
                if section.lower().startswith("code section") or section.lower().startswith("1. code section"):
                    code_section = section
                elif section.lower().startswith("explanation") or section.lower().startswith("3. explanation"):
                    explanation = section
                elif section.lower().startswith("related codes") or section.lower().startswith("4. related codes"):
                    related_codes = [code.strip() for code in section.split("\n")[1:] if code.strip()]
            
            return {
                "codeSection": code_section,
                "explanation": explanation,
                "relatedCodes": related_codes
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
