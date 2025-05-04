"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface ColorPaletteProps {
  currentColor: string
  onColorChange: (color: string) => void
}

export default function ColorPalette({ currentColor, onColorChange }: ColorPaletteProps) {
  const [showCustom, setShowCustom] = useState(false)

  const presetColors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Dark Green
    "#A52A2A", // Brown
    "#808080", // Gray
    "#FFB6C1", // Light Pink
    "#ADD8E6", // Light Blue
    "#90EE90", // Light Green
  ]

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presetColors.map((color) => (
          <motion.button
            key={color}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-8 h-8 rounded-full ${
              color === "#FFFFFF" ? "border border-gray-300" : ""
            } ${currentColor === color ? "ring-2 ring-offset-2 ring-purple-600" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title={color}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          className="text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center"
          onClick={() => setShowCustom(!showCustom)}
        >
          {showCustom ? "Hide" : "Show"} custom color picker
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 ml-1 transition-transform ${showCustom ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}
