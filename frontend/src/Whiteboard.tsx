import { useState, useEffect, useLayoutEffect, useRef, createRef, useCallback } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './CreateWobjectMenu.tsx'

import Wobject from './Wobject.tsx'
import WhiteboardMenu from './CreateWobjectMenu.tsx'

import CodeWobject from './wobjects/Code.tsx'

import { CreatedWobject, WobjectTypes } from './wobjects/Wobject.ts'

interface Wobject {
    x: number;
    y: number;
    xMouseStart: number;
    yMouseStart: number;
    xStart: number;
    yStart: number;
    currentlyDragging: boolean;
    selected: boolean;
    id: number;
    currentWidth: number;
    currentHeight: number;
    ref: React.RefObject<HTMLDivElement>;
    wobject: React.ReactNode;
}

interface RightClickMenu {
    x: number;
    y: number;
}

type HandlerFunction = (...args: any[]) => void;
function useMultiClickHandler(handler: Record<number, HandlerFunction>, delay: number = 400) {
    const [state, setState] = useState<{ clicks: number; args: any[] }>({ clicks: 0, args: [] });

    useEffect(() => {
        const timer = setTimeout(() => {
            setState({ clicks: 0, args: [] });

            if (state.clicks > 0 && typeof handler[state.clicks] === 'function') {
                console.log("sjsdhjkdhdhkkdhsj")
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
    const [rightClickMenu, setRightClickMenu] = useState<RightClickMenu | null>(null);

    const [clickTimeout, setClickTimeout] = useState<number | null>(null);

    const [createdWobject, setCreatedWobject] = useState<CreatedWobject | null>(null);

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

    function createNewWobject(x: number, y: number, type: string) {
        const chosenWobject = WobjectTypes.find(wobject => wobject.type == type)!;

        setWobjects([...wobjects, {
            x: x,
            y: y,
            xMouseStart: 0,
            yMouseStart: 0,
            xStart: 0,
            yStart: 0,
            currentlyDragging: false,
            selected: false,
            id: Date.now(), // Use timestamp for unique id
            currentWidth: 0,
            currentHeight: 0,
            ref: React.createRef(),
            wobject: React.createElement(chosenWobject.class),
        }]);
    }

    useEffect(() => {
        if (createdWobject) {
            createNewWobject(createdWobject.x, createdWobject.y, createdWobject.type);

            setRightClickMenu(null);
            setCreatedWobject(null);
        }
    }, [createdWobject]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        // Not now
        //createNewWobject(e.clientX, e.clientY, "text");
    };

    const onMouseDownElement = (e: React.MouseEvent, id: number) => {
        setWobjects(wobjects.map((wobject) => {
            if (wobject.id == id) {
                return { ...wobject, xStart: wobject.x, yStart: wobject.y, xMouseStart: e.clientX, yMouseStart: e.clientY, currentlyDragging: true, selected: true };
            } else {
                return { ...wobject, selected: false };
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

    const onMouseUpElement = (e: React.MouseEvent, id: number) => {
        setWobjects(wobjects.map((wobject) => {
            if (wobject.id == id) {
                return { ...wobject, x: wobject.xStart + e.clientX - wobject.xMouseStart, y: wobject.yStart + e.clientY - wobject.yMouseStart, currentlyDragging: false };
            }
            return wobject;
        }));
    };

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);

            handleDoubleClick(e);
        } else {
            const timeout = setTimeout(() => {
                if (e.button === 0) {
                    // Left
                    setRightClickMenu(null);
                }

                setClickTimeout(null);
            }, 150);
            setClickTimeout(timeout);
        }
    }, [clickTimeout]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setRightClickMenu({
            x: e.clientX,
            y: e.clientY,
        });
    };

    return (
        <div onMouseMove={handleDrag} onClickCapture={handleClick} onContextMenu={handleContextMenu} className="w-full h-full">
            {wobjects.map((wobject) => (
                <div
                    ref={wobject.ref}
                    key={wobject.id}
                    onMouseDown={(e) => onMouseDownElement(e, wobject.id)}
                    onMouseUp={(e) => onMouseUpElement(e, wobject.id)}
                    className={`${wobject.currentWidth == 0 ? 'display-none' : ''}`}
                    style={{
                        width: 300,
                        height: 300,
                        backgroundColor: 'skyblue',
                        position: 'absolute',
                        cursor: 'grab',
                        overflow: 'hidden',
                        left: wobject.x - wobject.currentWidth / 2,
                        top: wobject.y - wobject.currentHeight / 2,
                    }}
                >
                    <Wobject>{wobject.wobject}</Wobject>
                </div>
            ))
            }
            {rightClickMenu ? <WhiteboardMenu x={rightClickMenu.x} y={rightClickMenu.y} setCreatedWobject={setCreatedWobject} /> : <div></div>}
        </div>
    );
};

export default Whiteboard;