import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HamburgerMenu from './HamburgerMenu.tsx'
import TextPreview from './TextPreview.tsx'
import Whiteboard from "./Whiteboard.tsx"
import { useQuery, QueryKey, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WhiteboardMetadata } from './WhiteboardMetadata.ts';

function QueryApp() {

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
    <div className="w-full h-full h-screen flex flex-row">
      <div className="flex-none">
        {/*<HamburgerMenu whiteboardMetadatas={whiteboardMetadatas} />*/}
      </div>
      <div className="w-full flex-1">
        <Whiteboard />
      </div>
    </div>
  )
}

export default QueryApp
