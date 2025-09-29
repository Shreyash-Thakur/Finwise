import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AssetAllocationChart } from "@/components/asset-allocation-chart"
import { AlertTriangle, TrendingUp, Shield, DollarSign, Calendar, Bell } from "lucide-react"

export default function DashboardPage() {
  const planData = [
    { category: "Needs (50%)", amount: "₹42,500", description: "Rent, groceries, utilities, transport" },
    { category: "Debt Repayment (15%)", amount: "₹12,750", description: "Credit card, personal loan EMIs" },
    { category: "Emergency Fund (10%)", amount: "₹8,500", description: "Building 6-month safety net" },
    { category: "Goal-based SIPs (15%)", amount: "₹12,750", description: "Laptop, vacation, wedding fund" },
    { category: "Long-term Investment (8%)", amount: "₹6,800", description: "Retirement, wealth building" },
    { category: "Wants (2%)", amount: "₹1,700", description: "Entertainment, dining out" },
  ]

  const upcomingSips = [
    { date: "Jan 5", asset: "Equity MF", amount: "₹8,000", status: "pending" },
    { date: "Jan 10", asset: "Debt Fund", amount: "₹3,000", status: "pending" },
    { date: "Jan 15", asset: "Gold ETF", amount: "₹2,000", status: "pending" },
    { date: "Jan 20", asset: "REIT Fund", amount: "₹1,500", status: "pending" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">Your complete financial overview and monthly plan</p>
        </div>

        {/* Income Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p className="text-2xl font-bold text-emerald-400">₹85,000</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Profile</p>
                  <p className="text-2xl font-bold text-cyan-400">Moderate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Fund</p>
                  <p className="text-2xl font-bold text-amber-400">4.2/6</p>
                  <Progress value={70} className="mt-2 h-2" />
                </div>
                <Shield className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold text-purple-400">5</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Table */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                  Monthly Allocation Plan
                </CardTitle>
                <CardDescription>Your ₹85,000 monthly income breakdown</CardDescription>
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
          </div>

          {/* Asset Allocation Chart */}
          <div>
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Asset Allocation
                </CardTitle>
                <CardDescription>Investment distribution across asset classes</CardDescription>
              </CardHeader>
              <CardContent>
                <AssetAllocationChart />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span>Equity</span>
                    </div>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span>Debt</span>
                    </div>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span>Gold</span>
                    </div>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming SIPs and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Upcoming SIPs */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                Upcoming SIPs
              </CardTitle>
              <CardDescription>Scheduled investments for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSips.map((sip, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">{sip.asset}</p>
                      <p className="text-sm text-muted-foreground">{sip.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">{sip.amount}</p>
                      <Badge variant="secondary" className="text-xs">
                        {sip.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-transparent" variant="outline">
                View All SIPs
              </Button>
            </CardContent>
          </Card>

          {/* Alerts & Suggestions */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-400" />
                Alerts & Suggestions
              </CardTitle>
              <CardDescription>Personalized recommendations for your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-400">Portfolio Rebalancing</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your equity allocation is at 68%. Consider redirecting next month's SIP to debt funds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-400">Emergency Fund Progress</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Great progress! You're 70% towards your 6-month emergency fund goal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-cyan-400">Goal Milestone</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your laptop fund is 45% complete. On track to reach goal by June 2025.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
