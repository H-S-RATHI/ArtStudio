"use client"

import { useState } from "react"
import DrawingCanvas from "@/app/components/drawing-canvas"
import Toolbar from "@/app/components/toolbar"
import LayersPanel from "@/app/components/layers-panel"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Layer } from "@/app/components/drawing-canvas"


export default function DrawingApp() {
  const [currentTool, setCurrentTool] = useState<string>("brush")
  const [brushSize, setBrushSize] = useState<number>(5)
  const [currentColor, setCurrentColor] = useState<string>("#000000")
  const [layers, setLayers] = useState<Layer[]>([{ id: "1", name: "Layer 1", visible: true, canvas: null }])
  const [activeLayerId, setActiveLayerId] = useState<string>("1")

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
    
    // Create a new canvas for the new layer
    const newCanvas = document.createElement('canvas')
    newCanvas.width = 800 // Set appropriate width
    newCanvas.height = 600 // Set appropriate height
    
    // Add the new layer at the top of the stack
    setLayers(prevLayers => [
      ...prevLayers.map(layer => ({
        ...layer,
        // Create a copy of the canvas for each existing layer to prevent reference issues
        canvas: layer.canvas ? (() => {
          const copy = document.createElement('canvas')
          copy.width = layer.canvas?.width || 800
          copy.height = layer.canvas?.height || 600
          const ctx = copy.getContext('2d')
          if (ctx && layer.canvas) {
            ctx.drawImage(layer.canvas, 0, 0)
          }
          return copy
        })() : null
      })),
      { id: newLayerId, name: newLayerName, visible: true, canvas: newCanvas }
    ])
    
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
    console.log('Selecting layer:', layerId)
    setActiveLayerId(layerId)
    
    // Force a re-render of the layers to ensure the active state updates
    setLayers(prevLayers => {
      const newLayers = [...prevLayers]
      console.log('Updated active layer ID to:', layerId)
      return newLayers
    })
  }

  const handleUndoStatusChange = () => {
    // No-op since we're not using undo/redo status in the UI for now
  }

  const handleSaveImage = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    // Create a temporary canvas to combine all visible layers
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    // Set the temporary canvas size to match the main canvas
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height

    // Clear the temporary canvas
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)


    // Draw all visible layers onto the temporary canvas
    layers.forEach(layer => {
      if (layer.visible && layer.canvas) {
        tempCtx.drawImage(layer.canvas, 0, 0)
      }
    })

    // Create a download link
    const link = document.createElement('a')
    link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`
    link.href = tempCanvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        <div className="flex items-center space-x-4">

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            onClick={handleSaveImage}
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
          className="w-16 md:w-64 border-r border-gray-200 bg-white flex flex-col overflow-y-auto"
        >
          <Toolbar
            currentTool={currentTool}
            onToolChange={handleToolChange}
            brushSize={brushSize}
            onBrushSizeChange={handleBrushSizeChange}
          />

          <div className="border-t border-gray-200 p-4 flex-1 overflow-y-auto">
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
            setBrushSize={setBrushSize}
            setColor={handleColorChange}
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
