"use client"

interface ColorPaletteProps {
  currentColor: string
  onColorChange: (color: string) => void
}

export default function ColorPalette({ currentColor, onColorChange }: ColorPaletteProps) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="color-picker" className="text-sm text-gray-600">Color:</label>
      <input
        id="color-picker"
        type="color"
        value={currentColor}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-8 h-8 p-0 border-0 cursor-pointer"
      />
    </div>
  )
}
