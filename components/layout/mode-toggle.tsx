"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ModeToggle() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return null
}
