"use client"

import { motion } from "framer-motion"

interface ToolbarProps {
  currentTool: string
  onToolChange: (tool: string) => void
  brushSize: number
  onBrushSizeChange: (size: number) => void

}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,

}) => {
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
          className="w-4 h-4"
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
          className="w-4 h-4"
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
          className="w-4 h-4"
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
          className="w-4 h-4"
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
          className="w-4 h-4"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      ),
    },
  ]

  return (
    <div className="p-4 py-1">
      <h2 className="font-medium text-gray-700 mb-3">Tools</h2>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-md transition-colors flex flex-col items-center ${
              currentTool === tool.id
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => onToolChange(tool.id)}
            title={tool.name}
          >
            <div className="w-4 h-4">
              {tool.icon}
            </div>
            <span className="text-xs mt-1">{tool.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-4">

        <h2 className="font-medium text-gray-700 mb-2 text-sm">Brush Size</h2>
        <div className="flex space-y-4 p-4">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number.parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-xs text-gray-500 px-6">{brushSize}px</div>
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
