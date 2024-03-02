import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HamburgerMenu from './HamburgerMenu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HamburgerMenu />
    </>
  )
}

export default App
