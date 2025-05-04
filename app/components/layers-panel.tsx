"use client"

import { motion } from "framer-motion"
import type { Layer } from "@/app/components/drawing-canvas"

interface LayersPanelProps {
  layers: Layer[]
  activeLayerId: string
  onAddLayer: () => void
  onDeleteLayer: (id: string) => void
  onToggleVisibility: (id: string) => void
  onSelectLayer: (id: string) => void
}

export default function LayersPanel({
  layers,
  activeLayerId,
  onAddLayer,
  onDeleteLayer,
  onToggleVisibility,
  onSelectLayer,
}: LayersPanelProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <button
          className="text-sm px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          onClick={onAddLayer}
        >
          Add Layer
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-2 rounded-md flex items-center justify-between ${
              activeLayerId === layer.id ? "bg-purple-100" : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <button
                className="mr-2 text-gray-600 hover:text-gray-900"
                onClick={() => onToggleVisibility(layer.id)}
                title={layer.visible ? "Hide Layer" : "Show Layer"}
              >
                {layer.visible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
              <span className="cursor-pointer truncate max-w-[120px]" onClick={() => onSelectLayer(layer.id)}>
                {layer.name}
              </span>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onDeleteLayer(layer.id)}
              disabled={layers.length <= 1}
              title="Delete Layer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
