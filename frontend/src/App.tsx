import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HamburgerMenu from './HamburgerMenu'
import TextPreview from './TextPreview.tsx'

import Whiteboard from "./whiteboard.tsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-full h-full">
      <HamburgerMenu />
      <Whiteboard />
    </div>
  )
}

export default App
