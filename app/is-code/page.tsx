"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function IsCodePage() {
  const [isCode, setIsCode] = useState("IS:456")
  const [topic, setTopic] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    codeSection: string
    explanation: string
    relatedCodes?: string[]
  } | null>(null)

  const handleSearch = async () => {
    if (!isCode && !searchQuery) {
      alert("Please select an IS code or enter a search query")
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, this would call your FastAPI backend
      // const response = await fetch("/api/is-code", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ isCode, topic, searchQuery }),
      // });
      // const data = await response.json();

      // Simulating API response for demo
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Example responses based on input
      let result = {
        codeSection: "",
        explanation: "",
        relatedCodes: [],
      }

      if (isCode === "IS:456" && (topic === "slab" || searchQuery.toLowerCase().includes("slab"))) {
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
      } else if (isCode === "IS:456" && (topic === "beam" || searchQuery.toLowerCase().includes("beam"))) {
        result = {
          codeSection: `IS:456-2000, Section 26.5.1 - Minimum Reinforcement for Beams

The minimum tensile reinforcement in beams shall be:
- 0.85 bd/fy, where b = breadth of beam, d = effective depth, fy = yield strength of steel

Maximum reinforcement shall not exceed:
- 4% of the gross cross-sectional area`,
          explanation: `This section specifies the minimum and maximum reinforcement limits for RCC beams.

For students:
1. Minimum reinforcement ensures ductile behavior and prevents sudden failure.
2. For a beam with b = 300mm, d = 450mm, using Fe 500 steel:
   - Minimum steel area = 0.85 × 300 × 450 / 500 = 229.5mm²
   - This could be provided by 2 bars of 12mm diameter (226mm²)

3. Maximum reinforcement (4%) prevents congestion and ensures proper concrete placement.
4. These are limits - actual design will be based on bending moment calculations.`,
          relatedCodes: [
            "IS:456-2000 Section 26.5.1.1 - Requirements for Seismic Zones",
            "IS:456-2000 Section 40 - Special Design Requirements for Earthquake Resistance",
          ],
        }
      } else if (isCode === "IS:800" && (topic === "steel" || searchQuery.toLowerCase().includes("steel"))) {
        result = {
          codeSection: `IS:800-2007, Section 7 - Design of Tension Members

The design strength of a tension member shall be the lowest of:
- Yielding of gross section: Tdg = fy × Ag / γm0
- Rupture of critical section: Tdn = fu × An × γm1
- Block shear failure: Tdb = Avg × fy / (√3 × γm0) + 0.9 × Atn × fu / γm1

Where:
- fy = yield stress of steel
- fu = ultimate tensile stress
- Ag = gross area of cross-section
- An = net effective area
- γm0, γm1 = partial safety factors`,
          explanation: `This section covers the design of steel tension members like ties, hangers, and truss members.

For students:
1. Three failure modes are considered: yielding of gross section, rupture at connections, and block shear.
2. The lowest strength from these calculations governs the design.
3. For a simple example with an ISMC 100 channel with two bolt holes:
   - Gross area = 1120mm²
   - Net area after holes = 1120 - (2 × 18 × 5.7) = 915mm²
   - For Fe 410 steel (fy = 250 MPa, fu = 410 MPa):
   - Tdg = 250 × 1120 / 1.1 = 254.5 kN
   - Tdn = 410 × 915 × 0.9 / 1.25 = 269.7 kN
   - Design strength = 254.5 kN (governed by yielding)`,
          relatedCodes: [
            "IS:800-2007 Section 8 - Design of Compression Members",
            "IS:800-2007 Section 10 - Design of Flexural Members",
          ],
        }
      } else if (isCode === "IS:1893" && (topic === "earthquake" || searchQuery.toLowerCase().includes("earthquake"))) {
        result = {
          codeSection: `IS:1893-2016, Section 6.4 - Design Seismic Base Shear

The total design lateral force or design seismic base shear (VB) along any principal direction shall be determined by:
VB = Ah × W

Where:
- Ah = Design horizontal acceleration spectrum value
- W = Seismic weight of the building

Ah = (Z/2) × (I/R) × (Sa/g)

Where:
- Z = Zone factor
- I = Importance factor
- R = Response reduction factor
- Sa/g = Spectral acceleration coefficient`,
          explanation: `This section explains how to calculate the seismic base shear, which is the total lateral force at the base of a structure during an earthquake.

For students:
1. The seismic base shear depends on:
   - Location (zone factor Z)
   - Building importance (I)
   - Structural system (R)
   - Natural period of the building (Sa/g)

2. For example, for a residential building in Zone IV:
   - Z = 0.24 (Zone IV)
   - I = 1.0 (residential building)
   - R = 5.0 (special moment resisting frame)
   - Sa/g = 2.5 (assuming natural period in plateau region)
   - Ah = (0.24/2) × (1.0/5.0) × 2.5 = 0.06
   - If W = 10,000 kN, then VB = 0.06 × 10,000 = 600 kN

3. This base shear is then distributed along the height of the building.`,
          relatedCodes: [
            "IS:1893-2016 Section 7 - Buildings",
            "IS:13920 - Ductile Detailing of Reinforced Concrete Structures",
          ],
        }
      } else {
        result = {
          codeSection: "No specific code section found for your query.",
          explanation:
            "Please try a different search term or select a specific IS code and topic. Some examples include 'slab reinforcement', 'beam design', 'steel tension members', or 'seismic design'.",
          relatedCodes: [
            "IS:456-2000 - Plain and Reinforced Concrete",
            "IS:800-2007 - General Construction in Steel",
            "IS:1893-2016 - Criteria for Earthquake Resistant Design",
          ],
        }
      }

      setResults(result)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to search. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">IS Code Reference Tool</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search IS Codes</CardTitle>
              <CardDescription>
                Find relevant sections from Indian Standard codes with AI-powered explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="isCode">Select IS Code</Label>
                    <Select value={isCode} onValueChange={setIsCode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select IS code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IS:456">IS:456 - Plain and Reinforced Concrete</SelectItem>
                        <SelectItem value="IS:800">IS:800 - General Construction in Steel</SelectItem>
                        <SelectItem value="IS:875">IS:875 - Design Loads</SelectItem>
                        <SelectItem value="IS:1893">IS:1893 - Earthquake Resistant Design</SelectItem>
                        <SelectItem value="IS:2950">IS:2950 - Design of Foundations</SelectItem>
                        <SelectItem value="IS:13920">IS:13920 - Ductile Detailing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic (Optional)</Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., slab, beam, column"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="searchQuery">Search Query (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="searchQuery"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., minimum reinforcement for slab"
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Code Reference</CardTitle>
                <CardDescription>Relevant code section and explanation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Code Section</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      {results.codeSection.split("\n").map((line, i) => {
                        if (line.startsWith("- ")) {
                          return (
                            <li key={i} className="ml-4">
                              {line.substring(2)}
                            </li>
                          )
                        } else if (line === "") {
                          return <br key={i} />
                        } else {
                          return (
                            <p key={i} className="mb-1">
                              {line}
                            </p>
                          )
                        }
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Explanation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      {results.explanation.split("\n").map((line, i) => {
                        if (line.startsWith("- ")) {
                          return (
                            <li key={i} className="ml-4">
                              {line.substring(2)}
                            </li>
                          )
                        } else if (line === "") {
                          return <br key={i} />
                        } else if (line.match(/^\d+\./)) {
                          return (
                            <p key={i} className="mb-1 ml-4">
                              {line}
                            </p>
                          )
                        } else {
                          return (
                            <p key={i} className="mb-1">
                              {line}
                            </p>
                          )
                        }
                      })}
                    </div>
                  </div>

                  {results.relatedCodes && results.relatedCodes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Related Codes</h3>
                      <ul className="space-y-1">
                        {results.relatedCodes.map((code, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 mt-1 text-primary" />
                            <span>{code}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
