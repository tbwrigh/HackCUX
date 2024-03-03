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

type Cookie = {
  session_id: string;
};

function QueryApp() {

  const [cookies, setCookie] = useCookies(['session_id']);
  const session_id = cookies.session_id;
  
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Cookie', 'session_id='+session_id);

  const [count, setCount] = useState(0)
  const { isLoading, isError, data: whiteboardMetadatas } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('{process.env.BASE_URL}/whiteboards/').then((res) =>
        res.json(),
      ),
  })

  //if (isLoading) return <div>Loading...</div>;
  //if (isError) return <div>Error fetching whiteboards!</div>;

  return (
    <div>
      <div className="w-full h-full h-screen flex flex-row">
        <div className="flex-none">
          <ToolsSidebar />
          {/*<HamburgerMenu whiteboardMetadatas={whiteboardMetadatas} />*/}
        </div>
        <div className="w-full flex-1">
          <Whiteboard />
        </div>
      </div>
    </div>
  )
}

export default QueryApp
