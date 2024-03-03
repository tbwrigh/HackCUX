import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HamburgerMenu from './HamburgerMenu.tsx'
import Whiteboard from "./Whiteboard.tsx"
import { useQuery, QueryKey, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WhiteboardMetadata } from './WhiteboardMetadata.ts';
import ToolsSidebar from './ToolsSidebar.tsx'
import { useCookies } from 'react-cookie';
import AddWhiteboardPopup from './AddWhiteboardPopup.tsx'

function QueryApp() {

  const [cookies, setCookie] = useCookies(['session_id']);
  const session_id = cookies.session_id;
  
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Cookie', 'session_id='+session_id);

  const [count, setCount] = useState(0)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isLoading, isError, data: whiteboardMetadatas } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_BASE_URL}/whiteboards`,
        {
          credentials: 'include',
        }
      ).then((res) =>
        res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching whiteboards!</div>;

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const makeWhiteboardOfName = (enteredName: string) => {
    // TODO
  };

  const [selectedWobject, setSelectedWobject] = useState(null)

  return (
    <div>
      {isPopupOpen && (
        <dialog open>
          <h2>Enter the whiteboard name:</h2>
          <input type="text" />
          <button onClick={closePopup}>Save</button>
          <button onClick={closePopup}>Cancel</button>
        </dialog>
      )}
      {whiteboardMetadatas.length == 0 
        ? 
          <div> 
            <p>Welcome! To begin, make your first whiteboard by clicking </p> 
            <button onClick={() => setIsPopupOpen(true)}>here!</button> 
          </div>
        :
          <div className="w-full h-full h-screen">
            <div className="">
              <ToolsSidebar selectedWobject={selectedWobject}/>
              <HamburgerMenu whiteboardMetadatas={[]} setIsPopupOpen={setIsPopupOpen} />
            </div>
            <div className="w-full flex-1">
              <Whiteboard />
            </div>
          </div>}
    </div>
  )
}

export default QueryApp
