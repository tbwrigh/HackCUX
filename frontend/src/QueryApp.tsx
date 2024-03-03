import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HamburgerMenu from './HamburgerMenu.tsx'
import Whiteboard from "./Whiteboard.tsx"
import { useQuery, QueryKey, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WhiteboardMetadataGET } from './api/ApiTypes.ts'
import ToolsSidebar from './ToolsSidebar.tsx'
import { useCookies } from 'react-cookie'
import AddWhiteboardPopup from './AddWhiteboardPopup.tsx'

import ChooseWhiteboardMenu from './ChooseWhiteboardMenu'
import CreateWhiteboardMenu from './CreateWhiteboardMenu'

import { Api } from './api/Api.ts'

function QueryApp() {
  const api = new Api();

  const [cookies, setCookie] = useCookies(['session_id']);
  const session_id = cookies.session_id;

  const [whiteboardID, setWhiteboardID] = useState<number | null>(null);
  const [needToCreate, setNeedToCreate] = useState<boolean>(false);
  const [needToReload, setNeedToReload] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen">

      <div onClick={() => menuOpen ? setMenuOpen(false) : setMenuOpen(true)}
        className='text-black'
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          cursor: "pointer",
          zIndex: "1000",
        }}
      ><i className="material-icons text-4xl">menu</i></div>

      <div
        className='fixed top-0 left-0 w-64 h-full z-50 flex flex-col place-content-between bg-gray-100 p-2 pt-20 transition duration-250'
        style={{
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >

          <ChooseWhiteboardMenu setWhiteboardID={setWhiteboardID} setNeedToCreate={setNeedToCreate} needToReload={needToReload} setNeedToReload={setNeedToReload} api={api} />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg focus:outline-none focus:shadow-outline transform transition-colors duration-150"
          onClick={(event: React.MouseEvent) => {
            setNeedToCreate(true);
          }}>
          Create
        </button>
      </div>

      {
        needToCreate ? (
          <CreateWhiteboardMenu setWhiteboardID={setWhiteboardID} setNeedToCreate={setNeedToCreate} setNeedToReload={setNeedToReload} />
        ) : (
          <div></div>
        )
      }

      <div className="flex-1 p-8">
        {whiteboardID ? <Whiteboard id={whiteboardID} api={api} /> : <div></div>}
      </div>
    </div >
  )
}

export default QueryApp
