declare global {
  interface Window {
    drawingApp: {
      undo: () => void
      redo: () => void
      clear: () => void
      save: () => void
    } | undefined
  }
}

export {}
