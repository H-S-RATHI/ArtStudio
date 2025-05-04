"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

type Tool = "brush" | "eraser" | "rectangle" | "circle" | "line"
type Layer = {
  id: string
  name: string
  visible: boolean
  canvas: HTMLCanvasElement | null
}

export default function DrawingApp() {
  const [currentTool, setCurrentTool] = useState<Tool>("brush")
  const [brushSize, setBrushSize] = useState(5)
  const [color, setColor] = useState("#000000")
  const [isDrawing, setIsDrawing] = useState(false)
  const [layers, setLayers] = useState<Layer[]>([{ id: "1", name: "Layer 1", visible: true, canvas: null }])
  const [activeLayerId, setActiveLayerId] = useState("1")
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  // Initialize canvas and layers
  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return

    const container = canvasContainerRef.current
    const canvas = canvasRef.current

    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight

      // Initialize all layer canvases with the same dimensions
      setLayers((prevLayers) =>
        prevLayers.map((layer) => {
          if (!layer.canvas) {
            const newCanvas = document.createElement("canvas")
            newCanvas.width = canvas.width
            newCanvas.height = canvas.height
            return { ...layer, canvas: newCanvas }
          }

          if (layer.canvas.width !== canvas.width || layer.canvas.height !== canvas.height) {
            const newCanvas = document.createElement("canvas")
            newCanvas.width = canvas.width
            newCanvas.height = canvas.height
            const ctx = newCanvas.getContext("2d")
            if (ctx) {
              ctx.drawImage(layer.canvas, 0, 0)
            }
            return { ...layer, canvas: newCanvas }
          }

          return layer
        }),
      )

      // Redraw the composite canvas
      redrawCanvas()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Save initial state to history
    saveToHistory()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Redraw the main canvas whenever layers change
  useEffect(() => {
    redrawCanvas()
  }, [layers])

  // Redraw the composite canvas from all visible layers
  const redrawCanvas = () => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw each visible layer
    layers.forEach((layer) => {
      if (layer.visible && layer.canvas) {
        ctx.drawImage(layer.canvas, 0, 0)
      }
    })
  }

  // Get the active layer's canvas context
  const getActiveLayerContext = () => {
    const activeLayer = layers.find((layer) => layer.id === activeLayerId)
    if (!activeLayer || !activeLayer.canvas) return null

    return activeLayer.canvas.getContext("2d")
  }

  // Save current state to history
  const saveToHistory = () => {
    if (!canvasRef.current) return

    // Create a new history entry
    const newHistoryEntry = canvasRef.current.toDataURL()

    // If we're not at the end of the history, truncate it
    if (historyIndex < history.length - 1) {
      setHistory((prev) => prev.slice(0, historyIndex + 1))
    }

    setHistory((prev) => [...prev, newHistoryEntry])
    setHistoryIndex((prev) => prev + 1)
  }

  // Undo action
  const handleUndo = () => {
    if (historyIndex <= 0) return

    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)

    // Load the previous state
    const img = new Image()
    img.onload = () => {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.drawImage(img, 0, 0)

      // Update the active layer with this state
      const activeLayer = layers.find((layer) => layer.id === activeLayerId)
      if (!activeLayer || !activeLayer.canvas) return

      const layerCtx = activeLayer.canvas.getContext("2d")
      if (!layerCtx) return

      layerCtx.clearRect(0, 0, activeLayer.canvas.width, activeLayer.canvas.height)
      layerCtx.drawImage(img, 0, 0)
    }
    img.src = history[newIndex]
  }

  // Redo action
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)

    // Load the next state
    const img = new Image()
    img.onload = () => {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.drawImage(img, 0, 0)

      // Update the active layer with this state
      const activeLayer = layers.find((layer) => layer.id === activeLayerId)
      if (!activeLayer || !activeLayer.canvas) return

      const layerCtx = activeLayer.canvas.getContext("2d")
      if (!layerCtx) return

      layerCtx.clearRect(0, 0, activeLayer.canvas.width, activeLayer.canvas.height)
      layerCtx.drawImage(img, 0, 0)
    }
    img.src = history[newIndex]
  }

  // Clear the canvas
  const handleClearCanvas = () => {
    if (!canvasRef.current) return

    // Clear all layers
    setLayers((prevLayers) =>
      prevLayers.map((layer) => {
        if (layer.canvas) {
          const ctx = layer.canvas.getContext("2d")
          if (ctx) {
            ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height)
          }
        }
        return layer
      }),
    )

    // Clear the main canvas
    const ctx = canvasRef.current.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    // Save to history
    saveToHistory()
  }

  // Add a new layer
  const handleAddLayer = () => {
    if (!canvasRef.current) return

    const newLayerId = `layer-${Date.now()}`
    const newLayerName = `Layer ${layers.length + 1}`

    const newCanvas = document.createElement("canvas")
    newCanvas.width = canvasRef.current.width
    newCanvas.height = canvasRef.current.height

    setLayers((prev) => [...prev, { id: newLayerId, name: newLayerName, visible: true, canvas: newCanvas }])

    setActiveLayerId(newLayerId)
  }

  // Toggle layer visibility
  const toggleLayerVisibility = (layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer)),
    )
  }

  // Delete a layer
  const deleteLayer = (layerId: string) => {
    if (layers.length <= 1) return // Don't delete the last layer

    setLayers((prevLayers) => prevLayers.filter((layer) => layer.id !== layerId))

    // If we deleted the active layer, set a new active layer
    if (activeLayerId === layerId) {
      const remainingLayers = layers.filter((layer) => layer.id !== layerId)
      if (remainingLayers.length > 0) {
        setActiveLayerId(remainingLayers[0].id)
      }
    }
  }

  // Save the drawing as an image
  const saveAsImage = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "drawing.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    setIsDrawing(true)

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Store start position for shapes
    setStartPosition({ x, y })

    const ctx = getActiveLayerContext()
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)

    // For brush and eraser, we start drawing immediately
    if (currentTool === "brush" || currentTool === "eraser") {
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = brushSize

      if (currentTool === "brush") {
        ctx.strokeStyle = color
        ctx.globalCompositeOperation = "source-over"
      } else {
        ctx.strokeStyle = "#ffffff"
        ctx.globalCompositeOperation = "destination-out"
      }

      ctx.lineTo(x, y)
      ctx.stroke()
    }

    // Redraw the composite canvas
    redrawCanvas()
  }

  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !startPosition) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = getActiveLayerContext()
    if (!ctx) return

    if (currentTool === "brush" || currentTool === "eraser") {
      ctx.lineTo(x, y)
      ctx.stroke()
    } else {
      // For shapes, we'll preview them on the main canvas during mouse move
      const mainCtx = canvasRef.current.getContext("2d")
      if (!mainCtx) return

      // Redraw the composite canvas to clear previous preview
      redrawCanvas()

      // Draw shape preview
      mainCtx.beginPath()
      mainCtx.lineWidth = brushSize
      mainCtx.strokeStyle = color

      if (currentTool === "rectangle") {
        mainCtx.rect(startPosition.x, startPosition.y, x - startPosition.x, y - startPosition.y)
      } else if (currentTool === "circle") {
        const radius = Math.sqrt(Math.pow(x - startPosition.x, 2) + Math.pow(y - startPosition.y, 2))
        mainCtx.arc(startPosition.x, startPosition.y, radius, 0, 2 * Math.PI)
      } else if (currentTool === "line") {
        mainCtx.moveTo(startPosition.x, startPosition.y)
        mainCtx.lineTo(x, y)
      }

      mainCtx.stroke()
    }
  }

  // Handle mouse up event
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !startPosition) return

    setIsDrawing(false)

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = getActiveLayerContext()
    if (!ctx) return

    // For shapes, draw the final shape on the active layer
    if (currentTool !== "brush" && currentTool !== "eraser") {
      ctx.beginPath()
      ctx.lineWidth = brushSize
      ctx.strokeStyle = color

      if (currentTool === "rectangle") {
        ctx.rect(startPosition.x, startPosition.y, x - startPosition.x, y - startPosition.y)
      } else if (currentTool === "circle") {
        const radius = Math.sqrt(Math.pow(x - startPosition.x, 2) + Math.pow(y - startPosition.y, 2))
        ctx.arc(startPosition.x, startPosition.y, radius, 0, 2 * Math.PI)
      } else if (currentTool === "line") {
        ctx.moveTo(startPosition.x, startPosition.y)
        ctx.lineTo(x, y)
      }

      ctx.stroke()
    }

    // Redraw the composite canvas
    redrawCanvas()

    // Save to history
    saveToHistory()

    // Reset start position
    setStartPosition(null)
  }

  // Handle mouse leave event
  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false)

      // If we were drawing shapes, commit them
      if (currentTool !== "brush" && currentTool !== "eraser" && startPosition) {
        redrawCanvas()
        saveToHistory()
      }

      setStartPosition(null)
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-2">
          {[
            { tool: "brush", icon: "✏️", label: "Brush" },
            { tool: "eraser", icon: "🧽", label: "Eraser" },
            { tool: "rectangle", icon: "⬜", label: "Rectangle" },
            { tool: "circle", icon: "⭕", label: "Circle" },
            { tool: "line", icon: "📏", label: "Line" },
          ].map(({ tool, icon, label }) => (
            <button
              key={tool}
              className={`p-2 rounded-md ${currentTool === tool ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"}`}
              onClick={() => setCurrentTool(tool as Tool)}
              title={label}
            >
              <span className="text-lg">{icon}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="brush-size" className="text-sm text-gray-600">
              Size:
            </label>
            <input
              id="brush-size"
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number.parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-600">{brushSize}px</span>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="color-picker" className="text-sm text-gray-600">
              Color:
            </label>
            <input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            ↩️
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            ↪️
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100" onClick={handleClearCanvas} title="Clear Canvas">
            🗑️
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100" onClick={saveAsImage} title="Save as Image">
            💾
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="flex-1 relative" ref={canvasContainerRef}>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          />
        </div>

        <div className="w-64 border-l p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Layers</h3>
            <button
              className="text-sm px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={handleAddLayer}
            >
              Add Layer
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {layers.map((layer) => (
              <motion.div
                key={layer.id}
                className={`p-2 rounded flex items-center justify-between ${
                  activeLayerId === layer.id ? "bg-purple-100" : "bg-white"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <button
                    className="mr-2 text-gray-600"
                    onClick={() => toggleLayerVisibility(layer.id)}
                    title={layer.visible ? "Hide Layer" : "Show Layer"}
                  >
                    {layer.visible ? "👁️" : "👁️‍🗨️"}
                  </button>
                  <span className="cursor-pointer" onClick={() => setActiveLayerId(layer.id)}>
                    {layer.name}
                  </span>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteLayer(layer.id)}
                  disabled={layers.length <= 1}
                  title="Delete Layer"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
