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

function QueryApp() {

  const [cookies, setCookie] = useCookies(['session_id']);
  const session_id = cookies.session_id;

  const [selectedWhiteboardID, setSelectedWhiteboardID] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [selectedWobject, setSelectedWobject] = useState(null);

  /* why does this block of code exist?!?!?!?! */
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Cookie', 'session_id=' + session_id);

  const { isLoading, isError, data } = useQuery<boolean, boolean, WhiteboardMetadataGET[]>({
    queryKey: ['GET', 'whiteboards'],
  });
  // const whiteboards = data.map((w) => <Whiteboard id={w.id} />);

  if (isLoading) return <div>Loading...</div>;
  if (data == undefined || isError) return <div>Error fetching whiteboards!</div>;

  console.log(data);

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
    )
      .then((res) =>
        res.json(),
      )
      .then((res) => setSelectedWhiteboardID(res.id));
    closePopup();
  };

  return (
    <div>
      {isPopupOpen && (
        /* to darken background, need to have element covering entire screen with transparent black background */
        <div className="fixed w-full h-full bg-black/35 z-40">
          <dialog open className="fixed inset-0 p-4 rounded-xl w-96">
            <form onSubmit={makeWhiteboardOfName}>
              <h2 className="py-2 font-extrabold text-2xl text-center">New Whiteboard</h2>
              <input type="text" name="whiteboardName" className="block w-full my-3 px-4 py-2 rounded-full bg-50 outline outline-1 outline-gray-200 focus:outline-none focus:ring focus:ring-blue-600" placeholder="Type a whiteboard name" autoFocus />
              <footer className="flex flex-row gap-3 justify-items-stretch">
                <button onClick={closePopup} className="basis-full grow p-2 rounded-lg bg-gray-100">Cancel</button>
                <button type="submit" className="basis-full grow p-2 rounded-lg bg-blue-600 text-gray-50">Save</button>
              </footer>
            </form>
          </dialog>
        </div>
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
            <HamburgerMenu WhiteboardMetadataGETs={data} setIsPopupOpen={setIsPopupOpen} setSelectedWhiteboardID={setSelectedWhiteboardID} />
          </div>
          <div className="w-full h-full flex-1">
            {selectedWhiteboardID ? <Whiteboard id={selectedWhiteboardID} /> : null}
          </div>
        </div>}
    </div>
  )
}

export default QueryApp
