import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HamburgerMenu from './HamburgerMenu.tsx'
import Whiteboard from "./Whiteboard.tsx"
import { useQuery, QueryKey, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WhiteboardMetadata } from './WhiteboardMetadata.ts';
import ToolsSidebar from './ToolsSidebar.tsx'
import { useCookies } from 'react-cookie'
import AddWhiteboardPopup from './AddWhiteboardPopup.tsx'

function QueryApp() {

  const [cookies, setCookie] = useCookies(['session_id']);
  const session_id = cookies.session_id;

  const [selectedWhiteboardID, setSelectedWhiteboardID] = useState(0)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [selectedWobject, setSelectedWobject] = useState(null);

  /* why does this block of code exist?!?!?!?! */
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Cookie', 'session_id=' + session_id);

  const { isLoading, isError, data } = useQuery<boolean, boolean, WhiteboardMetadata[]>({
    queryKey: ['GET', 'whiteboards'],
  });

  if (isLoading) return <div>Loading...</div>;
  if (data == undefined || isError) return <div>Error fetching whiteboards!</div>;

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const makeWhiteboardOfName = (e: React.FormEvent) => {
    e.preventDefault();
    const whiteboardName = Object.fromEntries((new FormData(e.target as HTMLFormElement)).entries()).whiteboardName;
    console.log(whiteboardName);
    fetch(
      `${import.meta.env.VITE_BASE_URL}/new_whiteboard/${whiteboardName}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        credentials: 'include',
      }
    ).then((res) =>
      res.json(),
    );
    closePopup();
  };

  return (
    <div>
      {isPopupOpen && (
        <dialog open>
          <h2>Enter the whiteboard name:</h2>
          <form onSubmit={makeWhiteboardOfName}>
            <input type="text" name="whiteboardName" />
            <button type="submit">Save</button>
            <button onClick={closePopup}>Cancel</button>
          </form>
        </dialog>
      )}
      {data.length == 0
        ?
        <div>
          <p>Welcome! To begin, make your first whiteboard by clicking </p>
          <button onClick={() => setIsPopupOpen(true)}>here!</button>
        </div>
        :
        <div className="w-full h-full h-screen">
          <div className="">
            <ToolsSidebar whiteboardID={selectedWhiteboardID} selectedWobject={selectedWobject} />
            <HamburgerMenu whiteboardMetadatas={data} setIsPopupOpen={setIsPopupOpen} setSelectedWhiteboardID={setSelectedWhiteboardID} />
          </div>
          <div className="w-full flex-1">
            <Whiteboard />
          </div>
        </div>}
    </div>
  )
}

export default QueryApp
