"use client"

import { motion } from "framer-motion"

interface ToolbarProps {
  currentTool: string
  onToolChange: (tool: string) => void
  brushSize: number
  onBrushSizeChange: (size: number) => void
  canUndo: boolean
  canRedo: boolean
}

export default function Toolbar({
  currentTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const tools = [
    {
      id: "brush",
      name: "Brush",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
        </svg>
      ),
    },
    {
      id: "eraser",
      name: "Eraser",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M20 20H7L3 16c-1.5-1.5-1.5-3.5 0-5l7-7c1.5-1.5 3.5-1.5 5 0l5 5c1.5 1.5 1.5 3.5 0 5l-7 7"></path>
        </svg>
      ),
    },
    {
      id: "rectangle",
      name: "Rectangle",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
      ),
    },
    {
      id: "circle",
      name: "Circle",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      ),
    },
    {
      id: "line",
      name: "Line",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      ),
    },
  ]

  const actions = [
    {
      id: "undo",
      name: "Undo",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M3 7v6h6"></path>
          <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
        </svg>
      ),
      action: () => window.drawingApp?.undo(),
      disabled: !canUndo,
    },
    {
      id: "redo",
      name: "Redo",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M21 7v6h-6"></path>
          <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
        </svg>
      ),
      action: () => window.drawingApp?.redo(),
      disabled: !canRedo,
    },
    {
      id: "clear",
      name: "Clear",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
        </svg>
      ),
      action: () => window.drawingApp?.clear(),
      disabled: false,
    },
  ]

  return (
    <div className="p-4">
      <h2 className="font-medium text-gray-700 mb-3 hidden md:block">Tools</h2>
      <div className="space-y-2">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center w-full p-2 rounded-md transition-colors ${
              currentTool === tool.id ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => onToolChange(tool.id)}
            title={tool.name}
          >
            <span className="mr-3 flex-shrink-0">{tool.icon}</span>
            <span className="hidden md:inline">{tool.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 mb-4">
        <h2 className="font-medium text-gray-700 mb-3 hidden md:block">Brush Size</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number.parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600 hidden md:block">{brushSize}px</div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-medium text-gray-700 mb-3 hidden md:block">Actions</h2>
        <div className="space-y-2">
          {actions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center w-full p-2 rounded-md transition-colors ${
                action.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={action.action}
              disabled={action.disabled}
              title={action.name}
            >
              <span className="mr-3 flex-shrink-0">{action.icon}</span>
              <span className="hidden md:inline">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
