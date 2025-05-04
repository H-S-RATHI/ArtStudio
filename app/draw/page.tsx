"use client"

import { useState } from "react"
import DrawingCanvas from "@/components/drawing-canvas"
import Toolbar from "@/components/toolbar"
import ColorPalette from "@/components/color-palette"
import LayersPanel from "../components/layers-panel"
import { motion } from "framer-motion"
import Link from "next/link"

export default function DrawingApp() {
  const [currentTool, setCurrentTool] = useState<string>("brush")
  const [brushSize, setBrushSize] = useState<number>(5)
  const [currentColor, setCurrentColor] = useState<string>("#000000")
  const [layers, setLayers] = useState<any[]>([{ id: "1", name: "Layer 1", visible: true, canvas: null }])
  const [activeLayerId, setActiveLayerId] = useState<string>("1")
  const [canUndo, setCanUndo] = useState<boolean>(false)
  const [canRedo, setCanRedo] = useState<boolean>(false)

  const handleToolChange = (tool: string) => {
    setCurrentTool(tool)
  }

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size)
  }

  const handleColorChange = (color: string) => {
    setCurrentColor(color)
  }

  const handleAddLayer = () => {
    const newLayerId = `layer-${Date.now()}`
    const newLayerName = `Layer ${layers.length + 1}`
    setLayers([...layers, { id: newLayerId, name: newLayerName, visible: true, canvas: null }])
    setActiveLayerId(newLayerId)
  }

  const handleDeleteLayer = (layerId: string) => {
    if (layers.length <= 1) return
    const newLayers = layers.filter((layer) => layer.id !== layerId)
    setLayers(newLayers)
    if (activeLayerId === layerId) {
      setActiveLayerId(newLayers[0].id)
    }
  }

  const handleToggleLayerVisibility = (layerId: string) => {
    setLayers(layers.map((layer) => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer)))
  }

  const handleLayerSelect = (layerId: string) => {
    setActiveLayerId(layerId)
  }

  const handleUndoStatusChange = (canUndo: boolean, canRedo: boolean) => {
    setCanUndo(canUndo)
    setCanRedo(canRedo)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-purple-600 mr-2"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
            <h1 className="text-xl font-bold text-gray-800">ArtStudio Pro</h1>
          </Link>
        </div>
        <div>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            onClick={() => document.getElementById("canvas-download")?.click()}
          >
            Save as Image
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-16 md:w-64 border-r border-gray-200 bg-white flex flex-col"
        >
          <Toolbar
            currentTool={currentTool}
            onToolChange={handleToolChange}
            brushSize={brushSize}
            onBrushSizeChange={handleBrushSizeChange}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          <div className="border-t border-gray-200 p-4">
            <h2 className="font-medium text-gray-700 mb-3">Color</h2>
            <ColorPalette currentColor={currentColor} onColorChange={handleColorChange} />
          </div>

          <div className="border-t border-gray-200 p-4 flex-1 overflow-y-auto">
            <h2 className="font-medium text-gray-700 mb-3">Layers</h2>
            <LayersPanel
              layers={layers}
              activeLayerId={activeLayerId}
              onAddLayer={handleAddLayer}
              onDeleteLayer={handleDeleteLayer}
              onToggleVisibility={handleToggleLayerVisibility}
              onSelectLayer={handleLayerSelect}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-4"
        >
          <DrawingCanvas
            tool={currentTool}
            brushSize={brushSize}
            color={currentColor}
            layers={layers}
            setLayers={setLayers}
            activeLayerId={activeLayerId}
            onUndoStatusChange={handleUndoStatusChange}
          />
        </motion.div>
      </div>
    </div>
  )
}
