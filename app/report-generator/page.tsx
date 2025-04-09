"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

export default function ReportGeneratorPage() {
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectType: "",
    clientName: "",
    location: "",
    objective: "",
    materials: "",
    methodology: "",
    results: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generatePDF = async () => {
    try {
      setIsGenerating(true)

      // Create a temporary div for the report content
      const reportDiv = document.createElement('div')
      reportDiv.className = 'p-8 bg-white'
      reportDiv.style.cssText = `
        width: 297mm;
        min-height: 420mm;
        margin: 0;
        padding: 25mm;
        box-sizing: border-box;
        background: white;
      `
      reportDiv.innerHTML = `
        <div style="
          font-family: Arial, sans-serif;
          color: #000;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        ">
          <div style="text-align: center; margin-bottom: 50px;">
            <h1 style="
              color: #333366;
              font-size: 42px;
              font-weight: bold;
              margin-bottom: 50px;
              text-transform: uppercase;
            ">${formData.projectTitle}</h1>
          </div>
          
          <div style="margin-bottom: 50px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 20px;">
              <tr>
                <td style="padding: 15px 0; width: 200px;"><strong>Project Type:</strong></td>
                <td style="padding: 15px 0;">${formData.projectType}</td>
              </tr>
              ${formData.clientName ? `
              <tr>
                <td style="padding: 15px 0;"><strong>Client:</strong></td>
                <td style="padding: 15px 0;">${formData.clientName}</td>
              </tr>` : ''}
              ${formData.location ? `
              <tr>
                <td style="padding: 15px 0;"><strong>Location:</strong></td>
                <td style="padding: 15px 0;">${formData.location}</td>
              </tr>` : ''}
            </table>
          </div>
          
          <div style="margin-bottom: 50px;">
            <h2 style="
              color: #333366;
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 25px;
              border-bottom: 2px solid #333366;
              padding-bottom: 10px;
            ">Objective</h2>
            <p style="font-size: 20px; line-height: 1.8;">${formData.objective.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-bottom: 50px;">
            <h2 style="
              color: #333366;
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 25px;
              border-bottom: 2px solid #333366;
              padding-bottom: 10px;
            ">Materials Used</h2>
            <p style="font-size: 20px; line-height: 1.8;">${formData.materials.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-bottom: 50px;">
            <h2 style="
              color: #333366;
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 25px;
              border-bottom: 2px solid #333366;
              padding-bottom: 10px;
            ">Methodology</h2>
            <p style="font-size: 20px; line-height: 1.8;">${formData.methodology.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-bottom: 50px;">
            <h2 style="
              color: #333366;
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 25px;
              border-bottom: 2px solid #333366;
              padding-bottom: 10px;
            ">Results & Findings</h2>
            <p style="font-size: 20px; line-height: 1.8;">${formData.results.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="
            margin-top: auto;
            text-align: center;
            padding-top: 40px;
            border-top: 2px solid #ddd;
          ">
            <p style="font-size: 18px; margin-bottom: 10px; color: #666;">Generated by CiviAI - Civil Engineering Assistant</p>
            <p style="font-size: 18px; color: #666;">Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `

      // Add to document temporarily
      document.body.appendChild(reportDiv)

      // Convert to canvas with higher resolution
      const canvas = await html2canvas(reportDiv, {
        scale: 5, // Increased scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: reportDiv.offsetWidth,
        height: reportDiv.offsetHeight,
        windowWidth: reportDiv.offsetWidth,
        windowHeight: reportDiv.offsetHeight
      })

      // Remove the temporary div
      document.body.removeChild(reportDiv)

      // Create PDF in A3 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a3',
        compress: true,
        hotfixes: ['px_scaling']
      })

      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Add image with proper scaling to fit A3
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, '', 'FAST')

      // Save the PDF
      pdf.save(`${formData.projectTitle.replace(/\s+/g, "-")}-Report.pdf`)
      setReportGenerated(true)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    generatePDF()
  }

  const handleDownload = async () => {
    generatePDF()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Project Report Generator</h1>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Generate PDF Report</CardTitle>
              <CardDescription>
                Fill in the details below to generate a professional civil engineering project report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleChange}
                      placeholder="e.g., Residential Building Construction"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("projectType", value)}
                      value={formData.projectType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential Building</SelectItem>
                        <SelectItem value="commercial">Commercial Building</SelectItem>
                        <SelectItem value="bridge">Bridge Construction</SelectItem>
                        <SelectItem value="highway">Highway Project</SelectItem>
                        <SelectItem value="dam">Dam Construction</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      placeholder="e.g., ABC Construction Ltd."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Project Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Mumbai, Maharashtra"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">Project Objective</Label>
                  <Textarea
                    id="objective"
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    placeholder="Describe the main objectives of the project"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials">Materials Used</Label>
                  <Textarea
                    id="materials"
                    name="materials"
                    value={formData.materials}
                    onChange={handleChange}
                    placeholder="List the materials used in the project (e.g., M25 concrete, Fe500 steel)"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methodology">Methodology</Label>
                  <Textarea
                    id="methodology"
                    name="methodology"
                    value={formData.methodology}
                    onChange={handleChange}
                    placeholder="Describe the methods and procedures used"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="results">Results & Findings</Label>
                  <Textarea
                    id="results"
                    name="results"
                    value={formData.results}
                    onChange={handleChange}
                    placeholder="Summarize the key results and findings"
                    rows={4}
                    required
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <p>Markdown formatting is supported (e.g., **bold**, *italic*, ## headings, - lists)</p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {reportGenerated && (
            <Card>
              <CardHeader>
                <CardTitle>Report Generated</CardTitle>
                <CardDescription>Your report has been successfully generated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="bg-muted p-6 rounded-lg w-full max-w-md aspect-[3/4] flex items-center justify-center">
                    <FileText className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button onClick={handleDownload} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
