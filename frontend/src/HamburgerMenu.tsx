import { useState } from 'react'
import WhiteboardItem from './WhiteboardItem';
import { WhiteboardMetadataGET } from './api/ApiTypes';
import './HamburgerMenu.css';
import { WobjectProps } from './wobjects/Wobject';

interface HamburgerMenuProps {
  WhiteboardMetadataGETs: WhiteboardMetadataGET[];
  setIsPopupOpen: (arg0: boolean) => void;
  setSelectedWhiteboardID: (arg0: number) => void;
}

function HamburgerMenu({ WhiteboardMetadataGETs, setIsPopupOpen, setSelectedWhiteboardID }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const onAddWhiteboardButtonPressed = () => {
    setIsPopupOpen(true);
  };

  return (
    <div className="app">
      <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
      <div className={`menu ${isOpen ? 'open' : ''} flex flex-col place-content-between bg-gray-100 p-2 pt-16`}>
        <ul className="flex flex-col gap-2">
          {WhiteboardMetadataGETs.map(item => (
            <WhiteboardItem key={item.id} id={item.id} label={item.name} setSelectedWhiteboardID={setSelectedWhiteboardID} />
          ))}
        </ul>
        <button className='w-full px-4 py-2 bg-gray-300 rounded-xl' onClick={(onAddWhiteboardButtonPressed)}>Add Whiteboard</button>
      </div>
    </div>
  );
}

export default HamburgerMenu;
