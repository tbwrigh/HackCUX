import { useState } from 'react'
import WhiteboardItem from './WhiteboardItem';
import { WhiteboardMetadata } from './WhiteboardMetadata';
import './HamburgerMenu.css';
import { WobjectProps } from './wobjects/Wobject';

interface HamburgerMenuProps {
  whiteboardMetadatas: WhiteboardMetadata[];
  setIsPopupOpen: (arg0: boolean) => void;
}

function HamburgerMenu({whiteboardMetadatas, setIsPopupOpen}: HamburgerMenuProps) {
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
        <div className="hamburger"></div>
      </div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <ul>
          {whiteboardMetadatas.map(item => (
                <WhiteboardItem key={item.id} label={item.name} />
              ))}
        </ul>
        <div>
          <button className='add_btn' onClick={(onAddWhiteboardButtonPressed)}>Add Whiteboard</button>
        </div>
      </div>
    </div>
  );
}

export default HamburgerMenu;