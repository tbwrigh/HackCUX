import { useState, useEffect, useLayoutEffect, useRef, createRef } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface Wobject {
    x: number;
    y: number;
    xMouseStart: number;
    yMouseStart: number;
    xStart: number;
    yStart: number;
    currentlyDragging: boolean;
    id: number;
    currentWidth: number;
    currentHeight: number;
    ref: React.RefObject<HTMLDivElement>;
}

type HandlerFunction = (...args: any[]) => void;
function useMultiClickHandler(handler: Record<number, HandlerFunction>, delay: number = 400) {
    const [state, setState] = useState<{ clicks: number; args: any[] }>({ clicks: 0, args: [] });

    useEffect(() => {
        const timer = setTimeout(() => {
            setState({ clicks: 0, args: [] });

            if (state.clicks > 0 && typeof handler[state.clicks] === 'function') {
                handler[state.clicks](...state.args);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [handler, delay, state.clicks, state.args]);

    return (...args: any[]) => {
        setState({ clicks: state.clicks + 1, args });

        if (typeof handler[0] === 'function') {
            handler[0](...args);
        }
    };
}


const Whiteboard: React.FC = () => {
    const [wobjects, setWobjects] = useState<Wobject[]>([]);

    useLayoutEffect(() => {
        if (wobjects.some(wobject => wobject.currentWidth == 0)) {
            setWobjects(wobjects.map((wobject) => {
                const { offsetWidth: width, offsetHeight: height } = wobject.ref.current!;
                wobject.currentWidth = width;
                wobject.currentHeight = height;
                return wobject;
            }));
        }
    }, [wobjects]);

    function createNewWobject(x: number, y: number) {
        setWobjects([...wobjects, {
            x: x,
            y: y,
            xMouseStart: 0,
            yMouseStart: 0,
            xStart: 0,
            yStart: 0,
            currentlyDragging: false,
            id: Date.now(), // Use timestamp for unique id
            currentWidth: 0,
            currentHeight: 0,
            ref: React.createRef(),
        }]);
    }

    const handleDoubleClick = (e: React.MouseEvent) => {
        createNewWobject(e.clientX, e.clientY);
    };

    const handleDragStart = (e: React.MouseEvent, id: number) => {
        setWobjects(wobjects.map((wobject) => {
            if (wobject.id == id) {
                return { ...wobject, xStart: wobject.x, yStart: wobject.y, xMouseStart: e.clientX, yMouseStart: e.clientY, currentlyDragging: true };
            }
            return wobject;
        }));
    };

    const handleDrag = (e: React.MouseEvent) => {
        setWobjects(wobjects.map((wobject) => {
            if (wobject.currentlyDragging) {
                return { ...wobject, x: wobject.xStart + e.clientX - wobject.xMouseStart, y: wobject.yStart + e.clientY - wobject.yMouseStart };
            }
            return wobject;
        }));
        return false;
    };

    const handleDragEnd = (e: React.MouseEvent, id: number) => {
        setWobjects(wobjects.map((wobject) => {
            if (wobject.id == id) {
                return { ...wobject, x: wobject.xStart + e.clientX - wobject.xMouseStart, y: wobject.yStart + e.clientY - wobject.yMouseStart, currentlyDragging: false };
            }
            return wobject;
        }));

    };

    return (
        <div onDoubleClick={handleDoubleClick} onMouseMove={handleDrag} className="w-full h-full">
            {wobjects.map((wobject) => (
                <div
                    ref={wobject.ref}
                    key={wobject.id}
                    draggable={false}
                    onMouseDown={(e) => handleDragStart(e, wobject.id)}
                    onMouseUp={(e) => handleDragEnd(e, wobject.id)}
                    className={`w-full h-screen relative ${wobject.currentWidth == 0 ? 'display-none' : ''}`}
                    style={{
                        width: 100,
                        height: 100,
                        backgroundColor: 'skyblue',
                        position: 'absolute',
                        cursor: 'grab',
                        left: wobject.x - wobject.currentWidth / 2,
                        top: wobject.y - wobject.currentHeight / 2,
                    }}
                >
                </div>
            ))
            }
        </div >
    );
};

export default Whiteboard;