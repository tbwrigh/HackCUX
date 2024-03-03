import { useState } from 'react'
import DeleteTool from './SidebarTools/DeleteTool';
import './App.css'

function ToolsSidebar() {
  const [isRevealed, setIsRevealed] = useState(true);

  return (
    <>
      <div id="menu-panel" className="fixed top-1/2 right-0 transform -translate-y-1/2 w-1/8 h-3/6 bg-gray-200 text-gray-800 py-6 transition-transform duration-300">
        <ul>
          <DeleteTool />
        </ul>
      </div>
    </>
  )
}

export default ToolsSidebar