import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AssetAllocationChart } from "@/components/asset-allocation-chart"
import { PieChart, TrendingUp, AlertTriangle, Info, BarChart3, Shield } from "lucide-react"

export default function InvestmentsPage() {
  const monthlyAllocations = [
    { asset: "Equity Mutual Funds", allocation: "₹8,000", percentage: "65%", color: "text-emerald-400" },
    { asset: "Debt Funds", allocation: "₹3,000", percentage: "25%", color: "text-cyan-400" },
    { asset: "Gold ETF", allocation: "₹1,200", percentage: "10%", color: "text-amber-400" },
    { asset: "REIT Funds", allocation: "₹0", percentage: "0%", color: "text-purple-400" },
    { asset: "Crypto (Optional)", allocation: "₹0", percentage: "0%", color: "text-orange-400" },
  ]

  const assetNotes = [
    {
      asset: "Equity",
      description: "Large-cap, mid-cap, and small-cap mutual funds for long-term wealth creation",
      tip: "Best for goals >3 years. Higher volatility but better long-term returns.",
      color: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      asset: "Debt",
      description: "Government bonds, corporate bonds, and debt mutual funds for stability",
      tip: "Lower risk, steady returns. Good for short-term goals and portfolio balance.",
      color: "border-cyan-500/20 bg-cyan-500/5",
    },
    {
      asset: "Gold",
      description: "Gold ETFs or Sovereign Gold Bonds for inflation hedge",
      tip: "Hedge against inflation and currency devaluation. Limit to 5-10% of portfolio.",
      color: "border-amber-500/20 bg-amber-500/5",
    },
    {
      asset: "REITs",
      description: "Real Estate Investment Trusts for real estate exposure without direct ownership",
      tip: "Provides real estate exposure with liquidity. Good for diversification.",
      color: "border-purple-500/20 bg-purple-500/5",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Investment Portfolio</h1>
          <p className="text-muted-foreground">Manage your asset allocation and investment strategy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Target Asset Split */}
          <div>
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-emerald-400" />
                  Target Asset Split
                </CardTitle>
                <CardDescription>Your ideal portfolio allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <AssetAllocationChart />
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span>Equity</span>
                    </div>
                    <span className="font-medium text-emerald-400">65%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span>Debt</span>
                    </div>
                    <span className="font-medium text-cyan-400">25%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span>Gold</span>
                    </div>
                    <span className="font-medium text-amber-400">10%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>REITs</span>
                    </div>
                    <span className="font-medium text-purple-400">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Crypto</span>
                    </div>
                    <span className="font-medium text-orange-400">0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Meter */}
            <Card className="bg-card/50 border-border/50 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  Risk Meter
                </CardTitle>
                <CardDescription>Portfolio volatility vs your risk profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Current Risk Level</span>
                      <span className="font-medium text-cyan-400">Moderate</span>
                    </div>
                    <Progress value={60} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Conservative</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <p className="text-sm text-cyan-400 font-medium">Perfect Match!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your portfolio risk aligns well with your moderate risk profile.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Allocation Table */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  Monthly SIP Allocation
                </CardTitle>
                <CardDescription>Your ₹12,200 monthly investment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Class</TableHead>
                      <TableHead>Monthly SIP</TableHead>
                      <TableHead>Target %</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyAllocations.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.asset}</TableCell>
                        <TableCell className={`font-semibold ${item.color}`}>{item.allocation}</TableCell>
                        <TableCell className="text-muted-foreground">{item.percentage}</TableCell>
                        <TableCell>
                          {item.allocation === "₹0" ? (
                            <Badge variant="secondary" className="text-xs">
                              Not Active
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Rebalancing Suggestion */}
            <Card className="bg-card/50 border-border/50 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                  Rebalancing Suggestion
                </CardTitle>
                <CardDescription>Portfolio optimization recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-400 mb-2">Portfolio Drift Detected</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your equity allocation has grown to 68% due to market performance. Consider rebalancing to
                        maintain your target 65% allocation.
                      </p>
                      <div className="space-y-2 text-sm">
                        <p className="text-foreground">
                          <strong>Recommendation:</strong> Redirect next month's equity SIP (₹2,000) to debt funds
                          temporarily.
                        </p>
                        <p className="text-muted-foreground">
                          This will help bring your allocation back to the target 65/25/10 split.
                        </p>
                      </div>
                      <Button size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700">
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Asset Notes */}
        <div className="mt-8">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-purple-400" />
                Asset Class Guide
              </CardTitle>
              <CardDescription>Understanding your investment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assetNotes.map((note, index) => (
                  <Card key={index} className={`${note.color} border`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">{note.asset}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{note.description}</p>
                      <div className="p-2 bg-background/30 rounded text-xs text-muted-foreground">
                        <strong className="text-foreground">Tip:</strong> {note.tip}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
