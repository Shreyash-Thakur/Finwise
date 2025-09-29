"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Target, PieChart, Calculator, ArrowRight, DollarSign, Shield, BarChart3, Coins, Zap, Moon, Sun } from "lucide-react"
import { useThemeToggle, useKpiToggle } from "@/hooks/use-theme"

export default function HomePage() {
  const { isDark, toggleTheme } = useThemeToggle()
  const { showKpis, toggleKpis } = useKpiToggle()

  return (
    <div className={isDark ? "bg-slate-900 text-white min-h-screen" : "bg-white text-slate-900 min-h-screen"}>
      <Header />
      
      {/* Theme Toggle Button - MOVED BELOW HEADER */}
      <div className="container mx-auto px-4 pt-4 flex justify-end">
        <Button 
          className={isDark ? "bg-white text-slate-900" : "bg-slate-900 text-white"}
          onClick={toggleTheme}
          size="sm"
        >
          {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className={`container mx-auto px-4 py-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className={isDark ? "mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "mb-6 bg-emerald-100 text-emerald-700 border-emerald-200"}>
              <Zap className="h-3 w-3 mr-1" />
              Multi-Asset Investment Planning
            </Badge>

            <h1 className={isDark ? 
              "text-5xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent" : 
              "text-5xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-slate-900 via-emerald-700 to-emerald-600 bg-clip-text text-transparent"
            }>
              Turn your income into a clear, actionable monthly plan
            </h1>

            <p className={`text-xl text-balance mb-8 max-w-2xl mx-auto ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Transform your financial goals with intelligent multi-asset investing across equity, debt, gold, crypto,
              and REITs. Get exact rupee allocations for every category.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
              <Link href="/simulator">
                <Button
                  size="lg"
                  variant="outline"
                  className={isDark ? 
                    "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-8 bg-transparent" :
                    "border-emerald-700/30 text-emerald-700 hover:bg-emerald-100 px-8 bg-transparent"
                  }
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Try Simulator
                </Button>
              </Link>
            </div>

            {/* Toggle Button for KPI cards */}
            <Button
              variant="outline"
              className={`mb-6 ${isDark ? "border-white/20 hover:bg-white/10" : "border-black/20 hover:bg-black/5"}`}
              onClick={toggleKpis}
            >
              {showKpis ? "Hide" : "Show"} Demo KPIs
            </Button>

            {/* Demo KPIs */}
            {showKpis && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Card className={isDark ? "bg-white/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}>
                  <CardContent className="p-6 text-center">
                    <DollarSign className={`h-8 w-8 mx-auto mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                    <div className={`text-2xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>₹85,000</div>
                    <div className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Monthly Income</div>
                  </CardContent>
                </Card>
                <Card className={isDark ? "bg-white/10 border-cyan-500/20" : "bg-cyan-50 border-cyan-200"}>
                  <CardContent className="p-6 text-center">
                    <Shield className={`h-8 w-8 mx-auto mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                    <div className={`text-2xl font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>4.2/6</div>
                    <div className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Emergency Months</div>
                    <Progress value={70} className="mt-2 h-2" />
                  </CardContent>
                </Card>
                <Card className={isDark ? "bg-white/10 border-amber-500/20" : "bg-amber-50 border-amber-200"}>
                  <CardContent className="p-6 text-center">
                    <PieChart className={`h-8 w-8 mx-auto mb-2 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
                    <div className={`text-2xl font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}>65/25/10</div>
                    <div className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Equity/Debt/Gold %</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Highlights Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-balance mb-4">Why Choose FinWise?</h2>
            <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
              Get personalized financial planning with intelligent asset allocation and goal-based investing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Exact Rupee Plans</CardTitle>
                <CardDescription>
                  Transform your income into precise monthly allocations across needs, emergency fund, debt repayments,
                  and investments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-xl">Multi-Asset Investing</CardTitle>
                <CardDescription>
                  Diversify across equity, debt, gold, crypto, and REITs with intelligent allocation based on your risk
                  profile and goals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-amber-500/20 hover:border-amber-500/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-amber-400" />
                </div>
                <CardTitle className="text-xl">Goal-Based Investing</CardTitle>
                <CardDescription>
                  Set personal financial goals with deadlines and get automated SIP recommendations tailored to each
                  goal's timeline.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-balance mb-4">How It Works</h2>
            <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
              Three simple steps to transform your financial future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/20">
                <span className="text-2xl font-bold text-emerald-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Onboard</h3>
              <p className="text-muted-foreground">
                Share your income, expenses, debts, and financial goals. Set your risk profile and investment
                preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-cyan-500/20">
                <span className="text-2xl font-bold text-cyan-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Plan</h3>
              <p className="text-muted-foreground">
                Get your personalized monthly plan with exact rupee allocations across all categories and asset classes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/20">
                <span className="text-2xl font-bold text-amber-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Simulate</h3>
              <p className="text-muted-foreground">
                Test different scenarios with our what-if simulator. Adjust income, goals, and risk to optimize your
                plan.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Get Started Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
