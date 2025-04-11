"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ThemeToggleProps {
  theme: "dark" | "light"
  setTheme: (theme: "dark" | "light") => void
}

export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`rounded-full ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
          : "bg-white border-gray-200 text-gray-900 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative w-5 h-5"
      >
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-opacity ${theme === "dark" ? "opacity-0" : "opacity-100"}`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-opacity ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
        />
      </motion.div>
    </Button>
  )
}
