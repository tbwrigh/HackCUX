import { useState, useEffect } from 'react'
import WhiteboardItem from './WhiteboardItem';
import { WhiteboardMetadataGET } from './api/ApiTypes';
import './HamburgerMenu.css';
import { WobjectProps } from './wobjects/Wobject';

interface HamburgerMenuProps {
  WhiteboardMetadataGETs: WhiteboardMetadataGET[];
  setIsPopupOpen: (arg0: boolean) => void;
  setSelectedWhiteboardID: (arg0: number) => void;
}

interface GlobalSearchResult {
  [key: string]: string;
}

function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function executedFunction(...args: any[]): void {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
  };
}

function HamburgerMenu({ WhiteboardMetadataGETs, setIsPopupOpen, setSelectedWhiteboardID }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const onAddWhiteboardButtonPressed = () => {
    setIsPopupOpen(true);
  };

  const filterAndSortWhiteboards = async (searchTerm: string) => {
    if (searchTerm === '') {
      WhiteboardMetadataGETs = WhiteboardMetadataGETs.sort((a, b) => a.name.localeCompare(b.name));
      return;
    }

    const results = await fetch(`${import.meta.env.VITE_BASE_URL}/global_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        query: searchTerm
      })
    });

    const res: GlobalSearchResult[] = await results.json();

    const temp: WhiteboardMetadataGET[] = [];

    for (let i = 0; i < res.length; i++) {
      const id = parseInt(res[i][Object.keys(res[i])[0]]);
      temp.push(WhiteboardMetadataGETs.find((whiteboard) => whiteboard.id === id)!);
    }

    WhiteboardMetadataGETs = temp;
  };

  const debouncedFilterAndSort = debounce(filterAndSortWhiteboards, 1000); // 300ms delay

  useEffect(() => {
    debouncedFilterAndSort(searchTerm);
  }, [searchTerm]);

  return (
    <div className="app">
      <div className={`menu-toggle ${isOpen ? 'open' : ''} z-[100]`} onClick={toggleMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
      
      <div className={`menu ${isOpen ? 'open' : ''} z-[9999] flex flex-col place-content-between bg-gray-100 p-2 pt-16`}>
        <ul className="flex flex-col gap-2">
          {WhiteboardMetadataGETs.map(item => (
            <WhiteboardItem key={item.id} id={item.id} label={item.name} setSelectedWhiteboardID={setSelectedWhiteboardID} />
          ))}
        </ul>
        <button className='w-full px-4 py-2 bg-gray-300 rounded-lg' onClick={(onAddWhiteboardButtonPressed)}>Add Whiteboard</button>
      </div>
    </div>
  );
}

export default HamburgerMenu;
