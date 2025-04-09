"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Calculator } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function MaterialEstimatorPage() {
  const [structureType, setStructureType] = useState("wall")
  const [concreteGrade, setConcreteGrade] = useState("M20")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [thickness, setThickness] = useState("")
  const [steelPercentage, setSteelPercentage] = useState("")
  const [cementCost, setCementCost] = useState("6")
  const [sandCost, setSandCost] = useState("0.6")
  const [aggregateCost, setAggregateCost] = useState("0.5")
  const [steelCost, setSteelCost] = useState("80")
  const [results, setResults] = useState<{
    volume: number
    cement: number
    sand: number
    aggregate: number
    steel: number
    totalCost: number
  } | null>(null)

  const handleCalculate = () => {
    const lengthValue = Number.parseFloat(length)
    const widthValue = Number.parseFloat(width)
    const heightValue = Number.parseFloat(height)
    const thicknessValue = Number.parseFloat(thickness)
    const steelPercentageValue = Number.parseFloat(steelPercentage) || 0

    if (
      isNaN(lengthValue) ||
      isNaN(heightValue) ||
      (structureType !== "slab" && isNaN(thicknessValue)) ||
      (structureType === "slab" && isNaN(thicknessValue))
    ) {
      alert("Please enter valid dimensions")
      return
    }

    let volume = 0

    // Calculate volume based on structure type
    if (structureType === "wall") {
      volume = (lengthValue * heightValue * thicknessValue) / 1000 // Convert thickness from mm to m
    } else if (structureType === "column") {
      volume = (lengthValue * widthValue * heightValue) / Math.pow(1000, 3) // Convert mm to m³
    } else if (structureType === "slab") {
      volume = (lengthValue * widthValue * thicknessValue) / 1000 // Convert thickness from mm to m
    } else if (structureType === "beam") {
      volume = (lengthValue * widthValue * heightValue) / Math.pow(1000, 3) // Convert mm to m³
    }

    // Material ratios based on concrete grade
    let cementRatio = 1
    let sandRatio = 1.5
    let aggregateRatio = 3

    if (concreteGrade === "M20") {
      cementRatio = 1
      sandRatio = 1.5
      aggregateRatio = 3
    } else if (concreteGrade === "M25") {
      cementRatio = 1
      sandRatio = 1
      aggregateRatio = 2
    } else if (concreteGrade === "M30") {
      cementRatio = 1
      sandRatio = 0.75
      aggregateRatio = 1.5
    }

    const totalRatio = cementRatio + sandRatio + aggregateRatio

    // Calculate material quantities
    const cementVolume = (cementRatio / totalRatio) * volume
    const sandVolume = (sandRatio / totalRatio) * volume
    const aggregateVolume = (aggregateRatio / totalRatio) * volume

    // Convert to weight
    const cementWeight = cementVolume * 1440 // kg/m³
    const sandWeight = sandVolume * 1600 // kg/m³
    const aggregateWeight = aggregateVolume * 1450 // kg/m³

    // Calculate steel weight if applicable
    const steelWeight = (steelPercentageValue / 100) * volume * 7850 // kg/m³

    // Calculate costs
    const cementCostValue = Number.parseFloat(cementCost)
    const sandCostValue = Number.parseFloat(sandCost)
    const aggregateCostValue = Number.parseFloat(aggregateCost)
    const steelCostValue = Number.parseFloat(steelCost)

    const totalCost =
      cementWeight * cementCostValue +
      sandWeight * sandCostValue +
      aggregateWeight * aggregateCostValue +
      steelWeight * steelCostValue

    setResults({
      volume,
      cement: cementWeight,
      sand: sandWeight,
      aggregate: aggregateWeight,
      steel: steelWeight,
      totalCost,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Material Estimator</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Structure Details</CardTitle>
                <CardDescription>Enter the dimensions and specifications of your structure</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="dimensions" className="mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                    <TabsTrigger value="costs">Material Costs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="dimensions" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="structureType">Structure Type</Label>
                      <Select value={structureType} onValueChange={setStructureType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select structure type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wall">Wall</SelectItem>
                          <SelectItem value="column">Column</SelectItem>
                          <SelectItem value="beam">Beam</SelectItem>
                          <SelectItem value="slab">Slab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="concreteGrade">Concrete Grade</Label>
                      <Select value={concreteGrade} onValueChange={setConcreteGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select concrete grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M20">M20</SelectItem>
                          <SelectItem value="M25">M25</SelectItem>
                          <SelectItem value="M30">M30</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="length">Length (m)</Label>
                        <Input
                          id="length"
                          type="number"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          placeholder="e.g., 10"
                          required
                        />
                      </div>

                      {(structureType === "beam" || structureType === "column" || structureType === "slab") && (
                        <div className="space-y-2">
                          <Label htmlFor="width">Width (m)</Label>
                          <Input
                            id="width"
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="e.g., 0.3"
                            required
                          />
                        </div>
                      )}

                      {(structureType === "wall" || structureType === "column" || structureType === "beam") && (
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (m)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="e.g., 3"
                            required
                          />
                        </div>
                      )}

                      {(structureType === "wall" || structureType === "slab") && (
                        <div className="space-y-2">
                          <Label htmlFor="thickness">Thickness (mm)</Label>
                          <Input
                            id="thickness"
                            type="number"
                            value={thickness}
                            onChange={(e) => setThickness(e.target.value)}
                            placeholder="e.g., 150"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="steelPercentage">Steel Percentage (%)</Label>
                      <Input
                        id="steelPercentage"
                        type="number"
                        value={steelPercentage}
                        onChange={(e) => setSteelPercentage(e.target.value)}
                        placeholder="e.g., 1"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cementCost">Cement Cost (₹/kg)</Label>
                      <Input
                        id="cementCost"
                        type="number"
                        value={cementCost}
                        onChange={(e) => setCementCost(e.target.value)}
                        placeholder="e.g., 6"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sandCost">Sand Cost (₹/kg)</Label>
                      <Input
                        id="sandCost"
                        type="number"
                        value={sandCost}
                        onChange={(e) => setSandCost(e.target.value)}
                        placeholder="e.g., 0.6"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aggregateCost">Aggregate Cost (₹/kg)</Label>
                      <Input
                        id="aggregateCost"
                        type="number"
                        value={aggregateCost}
                        onChange={(e) => setAggregateCost(e.target.value)}
                        placeholder="e.g., 0.5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="steelCost">Steel Cost (₹/kg)</Label>
                      <Input
                        id="steelCost"
                        type="number"
                        value={steelCost}
                        onChange={(e) => setSteelCost(e.target.value)}
                        placeholder="e.g., 80"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button onClick={handleCalculate} className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Materials
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estimation Results</CardTitle>
                <CardDescription>Calculated material quantities and costs</CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium">Total Volume</p>
                      <p className="text-2xl font-bold">{results.volume.toFixed(2)} m³</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Material Quantities</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium">Cement</p>
                          <p className="text-xl font-bold">{results.cement.toFixed(2)} kg</p>
                          <p className="text-xs text-muted-foreground">{(results.cement / 50).toFixed(2)} bags</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium">Sand</p>
                          <p className="text-xl font-bold">{results.sand.toFixed(2)} kg</p>
                          <p className="text-xs text-muted-foreground">{(results.sand / 1600).toFixed(2)} m³</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium">Aggregate</p>
                          <p className="text-xl font-bold">{results.aggregate.toFixed(2)} kg</p>
                          <p className="text-xs text-muted-foreground">{(results.aggregate / 1450).toFixed(2)} m³</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium">Steel</p>
                          <p className="text-xl font-bold">{results.steel.toFixed(2)} kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Cost Breakdown</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Cement:</span>
                          <span>₹{(results.cement * Number.parseFloat(cementCost)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sand:</span>
                          <span>₹{(results.sand * Number.parseFloat(sandCost)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aggregate:</span>
                          <span>₹{(results.aggregate * Number.parseFloat(aggregateCost)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Steel:</span>
                          <span>₹{(results.steel * Number.parseFloat(steelCost)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t">
                          <span>Total Cost:</span>
                          <span>₹{results.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Building className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Enter the structure details and click Calculate to see the material estimation
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
