import { useState } from "react"

export function useThemeToggle(initialDark = true) {
  const [isDark, setIsDark] = useState(initialDark)

  const toggleTheme = () => setIsDark(prev => !prev)

  return {
    isDark,
    toggleTheme
  }
}

export function useKpiToggle(initialShow = true) {
  const [showKpis, setShowKpis] = useState(initialShow)

  const toggleKpis = () => setShowKpis(prev => !prev)

  return {
    showKpis,
    toggleKpis
  }
}