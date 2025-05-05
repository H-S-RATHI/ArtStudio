# ArtStudio Pro

A modern, feature-rich drawing application built with Next.js, React, and TypeScript. ArtStudio Pro provides a powerful yet intuitive interface for digital artists and designers to create beautiful artwork with multiple layers and various drawing tools.

![ArtStudio Pro Logo](public/next.svg)

## 🌟 Features

- 🎨 Multiple drawing tools (Brush, Eraser, Shapes, Text)
- 🖌️ Adjustable brush size and color
- 🏗️ Layer-based drawing system
- 👁️ Toggle layer visibility
- 🔄 Undo/Redo functionality
- 🎨 Color palette with custom color picker
- 📱 Responsive design that works on all devices
- ⚡ Built with Next.js for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/artstudio-pro.git
   cd artstudio-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React Hooks
- **Bundler**: Webpack (via Next.js)

## 📁 Project Structure

```
artstudio-pro/
├── app/                    # Next.js 13+ app directory
│   ├── components/         # Reusable components
│   │   ├── color-palette.tsx
│   │   ├── drawing-canvas.tsx
│   │   ├── layers-panel.tsx
│   │   └── toolbar.tsx
│   ├── draw/               # Drawing application page
│   │   └── page.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── window.d.ts
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── public/                 # Static assets
└── package.json            # Project dependencies and scripts
```

## 🎨 Usage

1. **Start Drawing**: Click on the "Start Drawing" button to open the drawing canvas.
2. **Select Tools**: Use the toolbar on the left to select different drawing tools.
3. **Adjust Settings**: Modify brush size and color using the controls at the top.
4. **Manage Layers**: Add, remove, or toggle visibility of layers from the right panel.
5. **Save Your Work**: Use the save button to download your artwork.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React community for the component-based architecture
- All contributors who helped in any way

---

Made with ❤️ by H.S Rathi
