import { useState } from 'react'
import DeleteTool from './SidebarTools/DeleteTool';
import './App.css'

interface ToolsSidebarProps {
  whiteboardID: number;
  selectedWobject: (null | number);
}

export interface ToolProps {
  whiteboardID: number;
  selectedWobject: (null | number);
}

function ToolsSidebar({whiteboardID, selectedWobject}: ToolsSidebarProps) {

  return (
    <>
      <div
          id="menu-panel"
          className={`fixed top-1/2 right-0 transform ${
            selectedWobject != null ? 'translate-y-0' : '-translate-y-full' // Apply translation based on isOpen
          } w-1/8 h-3/6 bg-gray-200 text-gray-800 py-6 transition-transform duration-300`}
        >
        <ul>
          <DeleteTool whiteboardID={whiteboardID} selectedWobject={selectedWobject}/>
        </ul>
      </div>
    </>
  )
}

export default ToolsSidebar