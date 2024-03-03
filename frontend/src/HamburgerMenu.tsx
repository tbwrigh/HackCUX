import { useState } from 'react'
import './HamburgerMenu.css'
import WhiteboardItem from './WhiteboardItem';
import { WhiteboardMetadata } from './WhiteboardMetadata';

interface HamburgerMenuProps {
  whiteboardMetadatas: WhiteboardMetadata[];
}

function HamburgerMenu({ whiteboardMetadatas }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div>
        <div className={`${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <i className="large material-icons">menu</i>
        </div>
        <div className={`${isOpen ? 'open' : ''}`}>
          <div>
            <ul>
              {whiteboardMetadatas.map(item => (
                <WhiteboardItem key={item.id} label={item.name} />
              ))}
            </ul>
          </div>
          <button>+</button>
        </div>
        
      </div>
    </>
  )
}

export default HamburgerMenu