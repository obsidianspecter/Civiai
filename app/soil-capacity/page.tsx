"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ruler, Calculator } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function SoilCapacityPage() {
  const [soilType, setSoilType] = useState("sandy")
  const [plateLoadValue, setPlateLoadValue] = useState("")
  const [footingWidth, setFootingWidth] = useState("")
  const [waterTablePresent, setWaterTablePresent] = useState("no")
  const [results, setResults] = useState<{
    safeBearingCapacity: number
    allowableLoad: number
    recommendations: string[]
  } | null>(null)

  const handleCalculate = () => {
    const plateLoadValueNum = Number.parseFloat(plateLoadValue)
    const footingWidthNum = Number.parseFloat(footingWidth)

    if (isNaN(plateLoadValueNum) || isNaN(footingWidthNum)) {
      alert("Please enter valid numbers for plate load test value and footing width")
      return
    }

    // Standard plate size is typically 0.3m x 0.3m
    const plateSize = 0.3

    // Calculate SBC based on IS 6403 (simplified)
    // SBC = q_plate * [(B + 0.3) / (2 * B_plate)]²
    let sbc = plateLoadValueNum * Math.pow((footingWidthNum + 0.3) / (2 * plateSize), 2)

    // Apply water table correction if needed
    if (waterTablePresent === "yes") {
      sbc *= 0.5 // 50% reduction due to water table
    }

    // Apply factor of safety
    const factorOfSafety = 2.5
    const safeBearingCapacity = sbc / factorOfSafety

    // Calculate allowable load
    const allowableLoad = safeBearingCapacity * footingWidthNum * footingWidthNum // Assuming square footing

    // Generate recommendations based on soil type and SBC
    const recommendations = []

    if (soilType === "sandy") {
      if (safeBearingCapacity < 100) {
        recommendations.push("Consider soil improvement techniques like compaction")
        recommendations.push("Use wider footings to distribute the load")
      } else if (safeBearingCapacity < 200) {
        recommendations.push("Suitable for low to medium rise buildings")
        recommendations.push("Ensure proper drainage around the foundation")
      } else {
        recommendations.push("Good bearing capacity for most structures")
        recommendations.push("Isolated footings are suitable for this soil")
      }
    } else if (soilType === "clayey") {
      if (safeBearingCapacity < 80) {
        recommendations.push("Consider pile foundations or soil stabilization")
        recommendations.push("Monitor for potential settlement issues")
      } else if (safeBearingCapacity < 150) {
        recommendations.push("Use raft foundation for better load distribution")
        recommendations.push("Ensure proper drainage to prevent soil swelling")
      } else {
        recommendations.push("Suitable for most structures with proper design")
        recommendations.push("Monitor seasonal moisture variations")
      }
    } else if (soilType === "silty") {
      if (safeBearingCapacity < 90) {
        recommendations.push("Consider soil replacement or improvement")
        recommendations.push("Use wider footings with reinforcement")
      } else if (safeBearingCapacity < 180) {
        recommendations.push("Suitable for medium load structures")
        recommendations.push("Ensure proper compaction during construction")
      } else {
        recommendations.push("Good bearing capacity for most structures")
        recommendations.push("Monitor for potential erosion issues")
      }
    }

    if (waterTablePresent === "yes") {
      recommendations.push("Install proper drainage system to lower water table")
      recommendations.push("Consider waterproofing measures for the foundation")
    }

    setResults({
      safeBearingCapacity,
      allowableLoad,
      recommendations,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Soil Bearing Capacity Checker</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Soil Parameters</CardTitle>
                <CardDescription>Enter soil test values and footing details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandy">Sandy Soil</SelectItem>
                        <SelectItem value="clayey">Clayey Soil</SelectItem>
                        <SelectItem value="silty">Silty Soil</SelectItem>
                        <SelectItem value="gravel">Gravel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plateLoadValue">Plate Load Test Value (kN/m²)</Label>
                    <Input
                      id="plateLoadValue"
                      type="number"
                      value={plateLoadValue}
                      onChange={(e) => setPlateLoadValue(e.target.value)}
                      placeholder="e.g., 200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footingWidth">Footing Width (m)</Label>
                    <Input
                      id="footingWidth"
                      type="number"
                      value={footingWidth}
                      onChange={(e) => setFootingWidth(e.target.value)}
                      placeholder="e.g., 1.5"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waterTablePresent">Water Table Present</Label>
                    <Select value={waterTablePresent} onValueChange={setWaterTablePresent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCalculate} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate SBC
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>Calculated soil bearing capacity and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium">Safe Bearing Capacity (SBC)</p>
                        <p className="text-2xl font-bold">{results.safeBearingCapacity.toFixed(2)} kN/m²</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium">Allowable Load (for square footing)</p>
                        <p className="text-2xl font-bold">{results.allowableLoad.toFixed(2)} kN</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Recommendations</h3>
                      <ul className="space-y-2">
                        {results.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                              <Ruler className="h-4 w-4" />
                            </span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg text-sm">
                      <p className="font-medium mb-2">Note:</p>
                      <p>
                        This is a simplified calculation based on IS 6403. For actual construction, consult a
                        geotechnical engineer and perform detailed soil investigation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <Ruler className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Enter the soil parameters and click Calculate to see the bearing capacity
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
