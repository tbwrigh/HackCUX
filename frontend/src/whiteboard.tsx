import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface Board {
    x: number;
    y: number;
    xStart: number;
    yStart: number;
    currentlyDragging: boolean;
    id: number;
}

const Whiteboard: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        console.log(e);
        setBoards([...boards, {
            x: e.clientX,
            y: e.clientY,
            xStart: e.clientX,
            yStart: e.clientY,
            currentlyDragging: false,
            id: Date.now(), // Use timestamp for unique id
        }]);
    };

    const handleDragStart = (e: React.DragEvent, id: number) => {
        setBoards(boards.map((board) => {
            if (board.id == id) {
                return { ...board, x: e.clientX, y: e.clientY, currentlyDragging: true };
            }
            return board;
        }));
    };

    const handleDrag = (e: React.MouseEvent) => {
        // ???
    };

    const handleDragEnd = (e: React.DragEvent, id: number) => {
        setBoards(boards.map((board) => {
            if (board.id == id) {
                return { ...board, x: e.clientX, y: e.clientY, currentlyDragging: false };
            }
            return board;
        }));

    };

    return (
        <div onDoubleClick={handleDoubleClick} onMouseMove={handleDrag} className="w-full h-full relative">
            {boards.map(board => (
                <div
                    key={board.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, board.id)}
                    onDragEnd={(e) => handleDragEnd(e, board.id)}
                    className="w-full h-screen relative"
                    style={{
                        width: 100,
                        height: 100,
                        backgroundColor: 'skyblue',
                        position: 'absolute',
                        left: board.x,
                        top: board.y,
                        cursor: 'grab',
                    }}
                >
                </div>
            ))}
        </div>
    );
};

export default Whiteboard;