"use client"

import React from "react"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"

interface Layer {
  id: string
  canvas: HTMLCanvasElement | null
  visible: boolean
}

interface DrawingCanvasProps {
  tool: string
  brushSize: number
  color: string
  layers: Layer[]
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
  activeLayerId: string
  onUndoStatusChange: (canUndo: boolean, canRedo: boolean) => void
}

export default function DrawingCanvas({
  tool,
  brushSize,
  color,
  layers,
  setLayers,
  activeLayerId,
  onUndoStatusChange,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Memoize the layers array to prevent unnecessary re-renders
  const memoizedLayers = useMemo(() => layers, [layers])

  // Redraw the composite canvas from all visible layers
  const redrawCanvas = useCallback(() => {
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
  }, [canvasRef, layers])

  // Initialize canvas and layers
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current

    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight

      // Initialize all layer canvases with the same dimensions
      const updatedLayers = memoizedLayers.map((layer) => {
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
      })

      // Only update state if layers actually changed
      const layersChanged = JSON.stringify(updatedLayers) !== JSON.stringify(memoizedLayers)
      if (layersChanged) {
        setLayers(updatedLayers)
      }

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
  }, [setLayers, canvasRef, layers])

  // Update undo/redo status
  useEffect(() => {
    onUndoStatusChange(historyIndex > 0, historyIndex < history.length - 1)
  }, [historyIndex, history, onUndoStatusChange])

  // Redraw the main canvas whenever layers change
  useEffect(() => {
    redrawCanvas()
  }, [layers])

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
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return

    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)

    // Load the previous state
    const img = new Image()
    img.crossOrigin = "anonymous"
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
  }, [historyIndex, history, canvasRef, activeLayerId, layers])

  // Redo action
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)

    // Load the next state
    const img = new Image()
    img.crossOrigin = "anonymous"
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
  }, [historyIndex, history, canvasRef, activeLayerId, layers])

  // Clear the canvas
  const handleClearCanvas = useCallback(() => {
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
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Save to history
    saveToHistory()
  }, [canvasRef, setLayers, saveToHistory])

  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    setIsDrawing(true)

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Store start position for shapes
    setStartPoint({ x, y })

    const ctx = getActiveLayerContext()
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)

    // For brush and eraser, we start drawing immediately
    if (tool === "brush" || tool === "eraser") {
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = brushSize

      if (tool === "brush") {
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
    if (!isDrawing || !canvasRef.current || !startPoint) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = getActiveLayerContext()
    if (!ctx) return

    if (tool === "brush" || tool === "eraser") {
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

      if (tool === "rectangle") {
        mainCtx.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y)
      } else if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))
        mainCtx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
      } else if (tool === "line") {
        mainCtx.moveTo(startPoint.x, startPoint.y)
        mainCtx.lineTo(x, y)
      }

      mainCtx.stroke()
    }
  }

  // Handle mouse up event
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !startPoint) return

    setIsDrawing(false)

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = getActiveLayerContext()
    if (!ctx) return

    // For shapes, draw the final shape on the active layer
    if (tool !== "brush" && tool !== "eraser") {
      ctx.beginPath()
      ctx.lineWidth = brushSize
      ctx.strokeStyle = color

      if (tool === "rectangle") {
        ctx.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y)
      } else if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
      } else if (tool === "line") {
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(x, y)
      }

      ctx.stroke()
    }

    // Redraw the composite canvas
    redrawCanvas()

    // Save to history
    saveToHistory()

    // Reset start position
    setStartPoint(null)
  }

  // Handle mouse leave event
  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false)

      // If we were drawing shapes, commit them
      if (tool !== "brush" && tool !== "eraser" && startPoint) {
        redrawCanvas()
        saveToHistory()
      }

      setStartPoint(null)
    }
  }

  // Handle touch events for mobile support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!canvasRef.current) return

    setIsDrawing(true)

    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    // Store start position for shapes
    setStartPoint({ x, y })

    const ctx = getActiveLayerContext()
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)

    // For brush and eraser, we start drawing immediately
    if (tool === "brush" || tool === "eraser") {
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = brushSize

      if (tool === "brush") {
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

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !canvasRef.current || !startPoint) return

    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const ctx = getActiveLayerContext()
    if (!ctx) return

    if (tool === "brush" || tool === "eraser") {
      ctx.lineTo(x, y)
      ctx.stroke()
    } else {
      // For shapes, we'll preview them on the main canvas during touch move
      const mainCtx = canvasRef.current.getContext("2d")
      if (!mainCtx) return

      // Redraw the composite canvas to clear previous preview
      redrawCanvas()

      // Draw shape preview
      mainCtx.beginPath()
      mainCtx.lineWidth = brushSize
      mainCtx.strokeStyle = color

      if (tool === "rectangle") {
        mainCtx.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y)
      } else if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))
        mainCtx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
      } else if (tool === "line") {
        mainCtx.moveTo(startPoint.x, startPoint.y)
        mainCtx.lineTo(x, y)
      }

      mainCtx.stroke()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !canvasRef.current || !startPoint) return

    setIsDrawing(false)

    // For shapes, draw the final shape on the active layer
    if (tool !== "brush" && tool !== "eraser") {
      const rect = canvasRef.current.getBoundingClientRect()
      const touch = e.changedTouches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      const ctx = getActiveLayerContext()
      if (!ctx) return

      ctx.beginPath()
      ctx.lineWidth = brushSize
      ctx.strokeStyle = color

      if (tool === "rectangle") {
        ctx.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y)
      } else if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
      } else if (tool === "line") {
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(x, y)
      }

      ctx.stroke()
    }

    // Redraw the composite canvas
    redrawCanvas()

    // Save to history
    saveToHistory()

    // Reset start position
    setStartPoint(null)
  }

  // Save the drawing as an image
  const saveAsImage = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.id = "canvas-download"
    link.download = "drawing.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  // Expose methods to parent component
  useEffect(() => {
    // Add event listeners to window for keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault()
        handleUndo()
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z")) {
        e.preventDefault()
        handleRedo()
      }
      // Clear: Ctrl+Delete
      if (e.ctrlKey && e.key === "Delete") {
        e.preventDefault()
        handleClearCanvas()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Expose methods to parent through window object
    const drawingApp = {
      undo: handleUndo,
      redo: handleRedo,
      clear: handleClearCanvas,
      save: saveAsImage,
    }

    // @ts-expect-error -- Type 'Window & typeof globalThis' has no property 'drawingApp'
    window.drawingApp = drawingApp

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      // @ts-expect-error -- Type 'Window & typeof globalThis' has no property 'drawingApp'
      delete window.drawingApp
    }
  }, [historyIndex, history, handleUndo, handleRedo, handleClearCanvas, saveAsImage])

  return (
    <div
      ref={containerRef}
      className="w-full h-full max-w-5xl max-h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  )
}
