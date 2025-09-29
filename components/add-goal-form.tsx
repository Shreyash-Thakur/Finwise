"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Target, DollarSign } from "lucide-react"

export function AddGoalForm() {
  const [goalName, setGoalName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [deadline, setDeadline] = useState("")
  const [priority, setPriority] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Goal submitted:", { goalName, targetAmount, deadline, priority, notes })
  }

  const getSuggestedAssetClass = () => {
    if (!deadline) return null

    const deadlineDate = new Date(deadline)
    const now = new Date()
    const monthsUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)

    if (monthsUntilDeadline < 12) {
      return { class: "Liquid/Debt Fund", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
    } else if (monthsUntilDeadline < 36) {
      return { class: "Hybrid Fund", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" }
    } else {
      return { class: "Equity Fund", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
    }
  }

  const suggestedAssetClass = getSuggestedAssetClass()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goalName" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Goal Name
        </Label>
        <Input
          id="goalName"
          placeholder="e.g., New Laptop, Vacation"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          className="bg-background/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAmount" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Target Amount
        </Label>
        <Input
          id="targetAmount"
          placeholder="₹50,000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="bg-background/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Deadline
        </Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="bg-background/50"
        />
      </div>

      {suggestedAssetClass && (
        <Card className="bg-muted/20 border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Suggested Asset Class:</span>
              <Badge className={suggestedAssetClass.color}>{suggestedAssetClass.class}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Additional details about this goal..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-background/50 min-h-[80px]"
        />
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
        Add Goal
      </Button>
    </form>
  )
}
