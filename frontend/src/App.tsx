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
    <div className="w-full h-full h-screen">
      <div className="flex">
        <div className="flex-none">
          <HamburgerMenu />
        </div>
        <div className="flex-initial">
          <Whiteboard />
        </div>
      </div>
    </div>
  )
}

export default App
