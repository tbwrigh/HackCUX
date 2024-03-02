import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Whiteboard from "./whiteboard.tsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-full h-full">
      <Whiteboard />
    </div>
  )
}

export default App
