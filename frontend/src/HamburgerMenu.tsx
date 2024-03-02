import { useState } from 'react'
import './HamburgerMenu.css'
import WhiteboardItem from './WhiteboardItem';

function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    const whiteboardItems = [
        { id: 1, label: 'Whiteboard 1' },
        { id: 2, label: 'Whiteboard 2' },
        { id: 3, label: 'Whiteboard 3' }
    ];
  
    return (
      <>
        <div className="app">
        <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="hamburger"></div>
        </div>
        <div className={`menu ${isOpen ? 'open' : ''}`}>
            <div className='menu_items'>
                <ul>
                    {whiteboardItems.map(item => (
                        <WhiteboardItem key={item.id} label={item.label} />
                    ))}
                </ul>
            </div>
        </div>
      </div>
      </>
    )
}

export default HamburgerMenu