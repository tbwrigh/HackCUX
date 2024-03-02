import { useState } from 'react'
import './HamburgerMenu.css'
import WhiteboardItem from './WhiteboardItem';
import { WhiteboardMetadata } from './WhiteboardMetadata';

interface HamburgerMenuProps {
  whiteboardMetadatas: WhiteboardMetadata[]; // Array of MenuItem objects
}

function HamburgerMenu({whiteboardMetadatas}: HamburgerMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <>
        <div className="app">
        <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="hamburger"></div>
        </div>
        <div className={`menu ${isOpen ? 'open' : ''}`}>
            <div className='menu_items'>
                <ul>
                    {whiteboardMetadatas.map(item => (
                        <WhiteboardItem key={item.id} label={item.name} />
                    ))}
                </ul>
            </div>
        </div>
      </div>
      </>
    )
}

export default HamburgerMenu