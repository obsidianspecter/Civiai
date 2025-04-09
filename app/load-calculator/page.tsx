"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function LoadCalculatorPage() {
  const [beamType, setBeamType] = useState("simply-supported")
  const [loadType, setLoadType] = useState("udl")
  const [span, setSpan] = useState("")
  const [load, setLoad] = useState("")
  const [width, setWidth] = useState("")
  const [depth, setDepth] = useState("")
  const [results, setResults] = useState<{
    maxBendingMoment: number
    maxShearForce: number
    maxDeflection: number
    chartData: any[]
  } | null>(null)

  const handleCalculate = () => {
    const spanValue = Number.parseFloat(span)
    const loadValue = Number.parseFloat(load)

    if (isNaN(spanValue) || isNaN(loadValue)) {
      alert("Please enter valid numbers for span and load")
      return
    }

    let maxBendingMoment = 0
    let maxShearForce = 0
    let maxDeflection = 0
    const chartData = []

    // Generate points for the chart
    const points = 20
    const step = spanValue / points

    if (beamType === "simply-supported") {
      if (loadType === "udl") {
        // UDL on simply supported beam
        maxBendingMoment = (loadValue * Math.pow(spanValue, 2)) / 8
        maxShearForce = (loadValue * spanValue) / 2
        maxDeflection = (5 * loadValue * Math.pow(spanValue, 4)) / (384 * 200000 * 10000) // Approximate EI

        for (let i = 0; i <= points; i++) {
          const x = i * step
          const bendingMoment = (loadValue * x * (spanValue - x)) / 2
          const shearForce = loadValue * (spanValue / 2 - x)
          chartData.push({
            position: x,
            bendingMoment: x <= spanValue / 2 ? bendingMoment : bendingMoment,
            shearForce:
              x <= spanValue / 2 ? maxShearForce - loadValue * x : -maxShearForce + loadValue * (spanValue - x),
          })
        }
      } else if (loadType === "point") {
        // Point load at center of simply supported beam
        maxBendingMoment = (loadValue * spanValue) / 4
        maxShearForce = loadValue / 2
        maxDeflection = (loadValue * Math.pow(spanValue, 3)) / (48 * 200000 * 10000) // Approximate EI

        for (let i = 0; i <= points; i++) {
          const x = i * step
          const bendingMoment = x <= spanValue / 2 ? (loadValue * x) / 2 : (loadValue * (spanValue - x)) / 2
          chartData.push({
            position: x,
            bendingMoment: bendingMoment,
            shearForce: x <= spanValue / 2 ? loadValue / 2 : -loadValue / 2,
          })
        }
      }
    } else if (beamType === "cantilever") {
      if (loadType === "udl") {
        // UDL on cantilever beam
        maxBendingMoment = (loadValue * Math.pow(spanValue, 2)) / 2
        maxShearForce = loadValue * spanValue
        maxDeflection = (loadValue * Math.pow(spanValue, 4)) / (8 * 200000 * 10000) // Approximate EI

        for (let i = 0; i <= points; i++) {
          const x = i * step
          const bendingMoment = (loadValue * Math.pow(spanValue - x, 2)) / 2
          const shearForce = loadValue * (spanValue - x)
          chartData.push({
            position: x,
            bendingMoment: bendingMoment,
            shearForce: shearForce,
          })
        }
      } else if (loadType === "point") {
        // Point load at end of cantilever beam
        maxBendingMoment = loadValue * spanValue
        maxShearForce = loadValue
        maxDeflection = (loadValue * Math.pow(spanValue, 3)) / (3 * 200000 * 10000) // Approximate EI

        for (let i = 0; i <= points; i++) {
          const x = i * step
          const bendingMoment = loadValue * (spanValue - x)
          chartData.push({
            position: x,
            bendingMoment: bendingMoment,
            shearForce: loadValue,
          })
        }
      }
    }

    setResults({
      maxBendingMoment,
      maxShearForce,
      maxDeflection,
      chartData,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Structural Load Calculator</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
                <CardDescription>Enter beam and load details to calculate structural loads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="beamType">Beam Type</Label>
                    <Select value={beamType} onValueChange={setBeamType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select beam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simply-supported">Simply Supported</SelectItem>
                        <SelectItem value="cantilever">Cantilever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loadType">Load Type</Label>
                    <Select value={loadType} onValueChange={setLoadType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select load type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="udl">Uniformly Distributed Load (UDL)</SelectItem>
                        <SelectItem value="point">Point Load</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="span">Span Length (m)</Label>
                    <Input
                      id="span"
                      type="number"
                      value={span}
                      onChange={(e) => setSpan(e.target.value)}
                      placeholder="e.g., 6"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="load">{loadType === "udl" ? "Load Intensity (kN/m)" : "Point Load (kN)"}</Label>
                    <Input
                      id="load"
                      type="number"
                      value={load}
                      onChange={(e) => setLoad(e.target.value)}
                      placeholder={loadType === "udl" ? "e.g., 20" : "e.g., 50"}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Beam Width (mm)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="e.g., 300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depth">Beam Depth (mm)</Label>
                      <Input
                        id="depth"
                        type="number"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        placeholder="e.g., 450"
                      />
                    </div>
                  </div>

                  <Button onClick={handleCalculate} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>Calculated structural loads and forces</CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium">Maximum Bending Moment</p>
                        <p className="text-2xl font-bold">{results.maxBendingMoment.toFixed(2)} kN·m</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium">Maximum Shear Force</p>
                        <p className="text-2xl font-bold">{results.maxShearForce.toFixed(2)} kN</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium">Maximum Deflection (Approximate)</p>
                        <p className="text-2xl font-bold">{results.maxDeflection.toFixed(4)} m</p>
                      </div>
                    </div>

                    <Tabs defaultValue="bending">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="bending">Bending Moment</TabsTrigger>
                        <TabsTrigger value="shear">Shear Force</TabsTrigger>
                      </TabsList>
                      <TabsContent value="bending" className="pt-4">
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={results.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="position"
                              label={{ value: "Position (m)", position: "insideBottom", offset: -5 }}
                            />
                            <YAxis label={{ value: "Bending Moment (kN·m)", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="bendingMoment" stroke="#8884d8" name="Bending Moment" />
                          </LineChart>
                        </ResponsiveContainer>
                      </TabsContent>
                      <TabsContent value="shear" className="pt-4">
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={results.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="position"
                              label={{ value: "Position (m)", position: "insideBottom", offset: -5 }}
                            />
                            <YAxis label={{ value: "Shear Force (kN)", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="shearForce" stroke="#82ca9d" name="Shear Force" />
                          </LineChart>
                        </ResponsiveContainer>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Enter the parameters and click Calculate to see the results</p>
                    <ArrowRight className="h-8 w-8 text-muted-foreground mt-4 animate-pulse" />
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
