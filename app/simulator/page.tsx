"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AssetAllocationChart } from "@/components/asset-allocation-chart"
import { Calculator, RefreshCw, TrendingDown, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"

export default function SimulatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(85000)
  const [wantsPercentage, setWantsPercentage] = useState([2])
  const [riskProfile, setRiskProfile] = useState("moderate")
  const [emergencyMonths, setEmergencyMonths] = useState("6")
  const [cryptoEnabled, setCryptoEnabled] = useState(false)

  const calculatePlan = () => {
    const wants = (monthlyIncome * wantsPercentage[0]) / 100
    const needs = monthlyIncome * 0.5
    const debt = monthlyIncome * 0.15
    const emergency = monthlyIncome * 0.1
    const goals = monthlyIncome * 0.15
    const longTerm = monthlyIncome * 0.08

    return [
      { category: "Needs (50%)", amount: `₹${needs.toLocaleString()}`, description: "Rent, groceries, utilities" },
      {
        category: "Debt Repayment (15%)",
        amount: `₹${debt.toLocaleString()}`,
        description: "Credit card, loan EMIs",
      },
      {
        category: "Emergency Fund (10%)",
        amount: `₹${emergency.toLocaleString()}`,
        description: `Building ${emergencyMonths}-month safety net`,
      },
      {
        category: "Goal-based SIPs (15%)",
        amount: `₹${goals.toLocaleString()}`,
        description: "Personal goals with deadlines",
      },
      {
        category: "Long-term Investment (8%)",
        amount: `₹${longTerm.toLocaleString()}`,
        description: "Retirement, wealth building",
      },
      {
        category: `Wants (${wantsPercentage[0]}%)`,
        amount: `₹${wants.toLocaleString()}`,
        description: "Entertainment, dining out",
      },
    ]
  }

  const getAssetAllocation = () => {
    if (riskProfile === "conservative") {
      return cryptoEnabled
        ? { equity: 40, debt: 45, gold: 10, crypto: 5 }
        : { equity: 45, debt: 45, gold: 10, crypto: 0 }
    } else if (riskProfile === "aggressive") {
      return cryptoEnabled ? { equity: 75, debt: 15, gold: 5, crypto: 5 } : { equity: 80, debt: 15, gold: 5, crypto: 0 }
    } else {
      return cryptoEnabled
        ? { equity: 60, debt: 25, gold: 10, crypto: 5 }
        : { equity: 65, debt: 25, gold: 10, crypto: 0 }
    }
  }

  const planData = calculatePlan()
  const assetAllocation = getAssetAllocation()

  const stressTestScenarios = [
    {
      scenario: "Market Crash",
      equity: -20,
      debt: +5,
      gold: +10,
      impact: "High",
      color: "text-red-400 bg-red-500/10 border-red-500/20",
    },
    {
      scenario: "Inflation Spike",
      equity: -5,
      debt: -10,
      gold: +15,
      impact: "Medium",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      scenario: "Interest Rate Rise",
      equity: +5,
      debt: -8,
      gold: +2,
      impact: "Low",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Financial Simulator</h1>
          <p className="text-muted-foreground">Test different scenarios and optimize your financial plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Panel */}
          <div>
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-400" />
                  Simulation Inputs
                </CardTitle>
                <CardDescription>Adjust parameters to see how your plan changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income</Label>
                  <Input
                    id="income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">Current: ₹{monthlyIncome.toLocaleString()}</p>
                </div>

                <div className="space-y-3">
                  <Label>Wants Percentage: {wantsPercentage[0]}%</Label>
                  <Slider
                    value={wantsPercentage}
                    onValueChange={setWantsPercentage}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Risk Profile</Label>
                  <Select value={riskProfile} onValueChange={setRiskProfile}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Emergency Fund Months</Label>
                  <Select value={emergencyMonths} onValueChange={setEmergencyMonths}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="crypto">Include Crypto</Label>
                  <Switch id="crypto" checked={cryptoEnabled} onCheckedChange={setCryptoEnabled} />
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recompute Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Updated Plan Table */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Updated Allocation Plan
                </CardTitle>
                <CardDescription>Your simulated ₹{monthlyIncome.toLocaleString()} monthly breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-emerald-400 font-semibold">{item.amount}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Asset Allocation and Stress Test */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">New Asset Split</CardTitle>
                  <CardDescription>Updated allocation based on risk profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <AssetAllocationChart />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span>Equity</span>
                      </div>
                      <span className="font-medium text-emerald-400">{assetAllocation.equity}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                        <span>Debt</span>
                      </div>
                      <span className="font-medium text-cyan-400">{assetAllocation.debt}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span>Gold</span>
                      </div>
                      <span className="font-medium text-amber-400">{assetAllocation.gold}%</span>
                    </div>
                    {cryptoEnabled && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span>Crypto</span>
                        </div>
                        <span className="font-medium text-orange-400">{assetAllocation.crypto}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Stress Test Scenarios</CardTitle>
                  <CardDescription>How your portfolio might react to market events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stressTestScenarios.map((test, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${test.color}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{test.scenario}</span>
                          <Badge className={test.color}>{test.impact}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            {test.equity > 0 ? (
                              <TrendingUp className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-400" />
                            )}
                            <span>
                              Equity {test.equity > 0 ? "+" : ""}
                              {test.equity}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {test.debt > 0 ? (
                              <TrendingUp className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-400" />
                            )}
                            <span>
                              Debt {test.debt > 0 ? "+" : ""}
                              {test.debt}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-emerald-400" />
                            <span>Gold +{test.gold}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tip Box */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-400 mb-2">Smart Optimization Tips</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {wantsPercentage[0] > 10 && (
                        <p className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                          Consider reducing wants to below 10% to accelerate your financial goals.
                        </p>
                      )}
                      {monthlyIncome < 50000 && (
                        <p className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                          Focus on increasing income through skills development or side hustles.
                        </p>
                      )}
                      {riskProfile === "conservative" && (
                        <p className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-cyan-400" />
                          Conservative approach is good for stability, but consider moderate risk for better long-term
                          returns.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
