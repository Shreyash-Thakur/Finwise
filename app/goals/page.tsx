import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddGoalForm } from "@/components/add-goal-form"
import { Target, Plus, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function GoalsPage() {
  const activeGoals = [
    {
      name: "New Laptop",
      target: "₹80,000",
      deadline: "Jun 2025",
      assetClass: "Debt Fund",
      monthlySip: "₹5,000",
      progress: 45,
      status: "on-track",
    },
    {
      name: "Vacation to Europe",
      target: "₹2,50,000",
      deadline: "Dec 2025",
      assetClass: "Hybrid Fund",
      monthlySip: "₹18,000",
      progress: 28,
      status: "on-track",
    },
    {
      name: "Wedding Fund",
      target: "₹5,00,000",
      deadline: "Mar 2026",
      assetClass: "Equity Fund",
      monthlySip: "₹15,000",
      progress: 12,
      status: "behind",
    },
    {
      name: "Emergency Car Repair",
      target: "₹50,000",
      deadline: "Mar 2025",
      assetClass: "Liquid Fund",
      monthlySip: "₹8,000",
      progress: 85,
      status: "ahead",
    },
    {
      name: "Home Down Payment",
      target: "₹10,00,000",
      deadline: "Dec 2026",
      assetClass: "Equity Fund",
      monthlySip: "₹25,000",
      progress: 8,
      status: "on-track",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ahead":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      case "on-track":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
      case "behind":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20"
      default:
        return "text-muted-foreground bg-muted/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ahead":
        return <CheckCircle className="h-4 w-4" />
      case "on-track":
        return <Clock className="h-4 w-4" />
      case "behind":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Financial Goals</h1>
          <p className="text-muted-foreground">Track and manage your personal financial objectives</p>
        </div>

        {/* Milestone Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-emerald-400">Car Repair Fund</p>
                  <p className="text-sm text-muted-foreground">85% funded - Almost there!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cyan-500/10 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="font-medium text-cyan-400">Laptop Goal</p>
                  <p className="text-sm text-muted-foreground">45% funded - On track</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="font-medium text-amber-400">Wedding Fund</p>
                  <p className="text-sm text-muted-foreground">Consider increasing SIP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Goals Table */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Active Goals
                </CardTitle>
                <CardDescription>Your current financial objectives and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Goal</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Asset Class</TableHead>
                      <TableHead>Monthly SIP</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeGoals.map((goal, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{goal.name}</TableCell>
                        <TableCell className="text-emerald-400 font-semibold">{goal.target}</TableCell>
                        <TableCell className="text-muted-foreground">{goal.deadline}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {goal.assetClass}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-cyan-400 font-medium">{goal.monthlySip}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(goal.status)}>
                            {getStatusIcon(goal.status)}
                            <span className="ml-1 capitalize">{goal.status.replace("-", " ")}</span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Add New Goal Form */}
          <div>
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-cyan-400" />
                  Add New Goal
                </CardTitle>
                <CardDescription>Create a new financial objective</CardDescription>
              </CardHeader>
              <CardContent>
                <AddGoalForm />
              </CardContent>
            </Card>

            {/* Helper Tip */}
            <Card className="bg-card/50 border-border/50 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  Smart Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Goal horizon determines asset class:</strong>
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>
                        <strong className="text-emerald-400">&lt; 1 year:</strong> Liquid/Debt funds
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span>
                        <strong className="text-cyan-400">1-3 years:</strong> Hybrid funds
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>
                        <strong className="text-amber-400">&gt; 3 years:</strong> Equity funds
                      </span>
                    </li>
                  </ul>
                  <p className="mt-3 text-xs">Longer horizons allow for higher risk and potentially better returns.</p>
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
