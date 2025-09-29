"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Target, PieChart, Calculator, Home } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Investments", href: "/investments", icon: PieChart },
  { name: "Simulator", href: "/simulator", icon: Calculator },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-1">
      <Link href="/">
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </Link>
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "text-foreground/80 hover:text-foreground",
                pathname === item.href && "bg-primary/10 text-primary",
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.name}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
