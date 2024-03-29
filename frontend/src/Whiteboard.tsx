import { useState, useEffect, useLayoutEffect, useRef, createRef, useCallback } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './CreateWobjectMenu.tsx'
import { useQuery, QueryKey, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import WhiteboardMenu from './CreateWobjectMenu.tsx'

import CodeWobject from './wobjects/Code.tsx'

import LoadingElement from './Loading.tsx'

import { CreatedWobject, WobjectTypes, Wobject } from './wobjects/Wobject.ts'

import { WhiteboardMetadataGET, WhiteboardObjectsGET } from './api/ApiTypes.ts'

import ChatWindow from './ChatWindow.tsx'

import { Api } from './api/Api.ts'

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

const EnsureMaximumSizeWobject = (w: number, h: number) => {
    const maximumW = 900;
    const maximumH = 600;

    if (w > maximumW) {
        const aspectRatio = h / w;
        w = maximumW;
        h = maximumW * aspectRatio;
    }

    if (h > maximumH) {
        const aspectRatio = w / h;
        h = maximumH;
        w = maximumH * aspectRatio;
    }

    return [w, h];
};

interface WhiteboardProps {
    id: number;
    api: Api;
}

function Whiteboard(props: WhiteboardProps) {
    const [wobjects, setWobjects] = useState<Wobject[]>([]);
    const [rightClickMenu, setRightClickMenu] = useState<RightClickMenu | null>(null);

    const [clickTimeout, setClickTimeout] = useState<number | null>(null);

    const [createdWobject, setCreatedWobject] = useState<CreatedWobject | null>(null);

    const backPanel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        props.api.getWhiteboardObjects(props.id, (data: WhiteboardObjectsGET[]) => {
            const startingID = Date.now();

            setWobjects(data.map((data, i) => {
                const wobject = data.data;

                const chosenWobject = WobjectTypes.find(w => w.type == wobject.type)!;

                return {
                    type: wobject.type,
                    x: wobject.x,
                    y: wobject.y,
                    xMouseStart: 0,
                    yMouseStart: 0,
                    xStart: 0,
                    yStart: 0,
                    currentlyDragging: false,
                    xMouseStartExtending: 0,
                    yMouseStartExtending: 0,
                    xStartExtending: 0,
                    yStartExtending: 0,
                    currentlyExtending: false,
                    selected: false,
                    id: startingID + i,
                    currentWidth: 0,
                    currentHeight: 0,
                    ref: React.createRef(),
                    extendingRef: React.createRef(),
                    wobjectElement: React.createElement(chosenWobject.class, { wobject }),
                    z: wobjects.length == 0 ? 0 : wobjects.reduce((maxObj, obj) => {
                        return obj.z > maxObj.z ? obj : maxObj;
                    }, wobjects[0]).z + 1,
                    wobject: wobject,
                }
            }));
        });
    }, [props.id]);

    function createNewWobject(wobject: CreatedWobject) {
        const chosenWobject = WobjectTypes.find(w => w.type == wobject.type)!;

        setWobjects([...wobjects, {
            type: wobject.type,
            x: wobject.x,
            y: wobject.y,
            xMouseStart: 0,
            yMouseStart: 0,
            xStart: 0,
            yStart: 0,
            currentlyDragging: false,
            xMouseStartExtending: 0,
            yMouseStartExtending: 0,
            xStartExtending: 0,
            yStartExtending: 0,
            currentlyExtending: false,
            selected: false,
            id: Date.now(), // Use timestamp for unique id
            currentWidth: 0,
            currentHeight: 0,
            ref: React.createRef(),
            extendingRef: React.createRef(),
            wobjectElement: React.createElement(chosenWobject.class, { wobject }),
            z: wobjects.length == 0 ? 0 : wobjects.reduce((maxObj, obj) => {
                return obj.z > maxObj.z ? obj : maxObj;
            }, wobjects[0]).z + 1,
            wobject: wobject,
        }]);
    }

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

    useEffect(() => {
        if (createdWobject) {
            createNewWobject(createdWobject);

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
            if (e.target == wobject.extendingRef.current!) {
                return { ...wobject, xStartExtending: wobject.currentWidth, yStartExtending: wobject.currentHeight, xMouseStartExtending: e.clientX, yMouseStartExtending: e.clientY, currentlyExtending: true };
            } else if (wobject.id == id) {
                const newZ = wobjects.reduce((maxObj, obj) => {
                    return obj.z > maxObj.z ? obj : maxObj;
                }, wobjects[0]).z + 1;
                return { ...wobject, xStart: wobject.x, yStart: wobject.y, xMouseStart: e.clientX, yMouseStart: e.clientY, currentlyDragging: true, selected: true, z: newZ };
            } else {
                return { ...wobject, selected: false };
            }
            return wobject;
        }));
    };

    const handleDrag = (e: React.MouseEvent) => {
        if (wobjects.some(wobject => wobject.currentlyExtending || wobject.currentlyDragging)) {
            setWobjects(wobjects.map((wobject) => {
                if (wobject.currentlyExtending) {
                    const preprocessedWidth = wobject.xStartExtending + (e.clientX - wobject.xMouseStartExtending) * 2;

                    // If the type is a aspect ratio preserving one fix the aspect ratio
                    let preprocessedHeight = 0;
                    if (WobjectTypes.find(w => w.type == wobject.type)!.preserveAspectRatio) {
                        preprocessedHeight = wobject.currentHeight / wobject.currentWidth * preprocessedWidth;
                    } else {
                        preprocessedHeight = wobject.yStartExtending + (e.clientY - wobject.yMouseStartExtending) * 2;
                    }

                    const [newWidth, newHeight] = EnsureMaximumSizeWobject(preprocessedWidth, preprocessedHeight);

                    wobject.ref.current!.style.width = `${newWidth}px`;
                    wobject.ref.current!.style.height = `${newHeight}px`;
                    return { ...wobject, currentWidth: newWidth, currentHeight: newHeight };
                } else if (wobject.currentlyDragging) {
                    return { ...wobject, x: wobject.xStart + e.clientX - wobject.xMouseStart, y: wobject.yStart + e.clientY - wobject.yMouseStart };
                }

                return wobject;
            }));
        }

        return false;
    };

    const onMouseUpElement = (e: React.MouseEvent, id: number) => {
        setWobjects(wobjects.map((wobject) => {
            if (wobject.currentlyExtending) {
                const preprocessedWidth = wobject.xStartExtending + (e.clientX - wobject.xMouseStartExtending) * 2;

                // If the type is a aspect ratio preserving one fix the aspect ratio
                let preprocessedHeight = 0;
                if (WobjectTypes.find(w => w.type == wobject.type)!.preserveAspectRatio) {
                    preprocessedHeight = wobject.currentHeight / wobject.currentWidth * preprocessedWidth;
                } else {
                    preprocessedHeight = wobject.yStartExtending + (e.clientY - wobject.yMouseStartExtending) * 2;
                }

                const [newWidth, newHeight] = EnsureMaximumSizeWobject(preprocessedWidth, preprocessedHeight);

                return { ...wobject, currentWidth: newWidth, currentHeight: newHeight, currentlyExtending: false };
            } else if (wobject.currentlyDragging && wobject.id == id) {
                return { ...wobject, x: wobject.xStart + e.clientX - wobject.xMouseStart, y: wobject.yStart + e.clientY - wobject.yMouseStart, currentlyDragging: false };
            }
            return wobject;
        }));
    };

    const onMouseLeaveElement = (e: React.MouseEvent, id: number) => {
        setWobjects(wobjects.map((wobject) => {
            if (wobject.id == id) {
                if (wobject.currentlyDragging) {
                    return { ...wobject, currentlyDragging: false };
                }
                else if (wobject.currentlyExtending) {
                    return { ...wobject, currentlyExtending: false };
                }
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
                    if (e.target == backPanel.current) {
                        setRightClickMenu(null);

                        props.api.syncWobjects(wobjects, props.id);
                    }
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

    const copyToClipboard = (wobject: Wobject) => {

        const textarea = document.createElement('textarea');
        textarea.value = wobject.wobject.customData;

        // Make the textarea out of viewport
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';

        document.body.appendChild(textarea);

        // Select and copy the text
        textarea.select();
        document.execCommand('copy');

        document.body.removeChild(textarea);
    }

    return (
        <>
            <div ref={backPanel} onMouseMove={handleDrag} onClickCapture={handleClick} onContextMenu={handleContextMenu} className="w-full h-full border-none">
                {wobjects.map((wobject) => (
                    <div
                        ref={wobject.ref}
                        key={wobject.id}
                        onMouseDown={(e) => onMouseDownElement(e, wobject.id)}
                        onMouseUp={(e) => onMouseUpElement(e, wobject.id)}
                        onMouseLeave={(e) => onMouseLeaveElement(e, wobject.id)}
                        className={`${wobject.currentWidth == 0 ? 'display-none' : ''} bg-white border border-1 border-gray-300 rounded-lg overflow-hidden`}
                        style={{
                            position: 'absolute',
                            cursor: 'grab',
                            overflow: 'hidden',
                            left: wobject.x - wobject.currentWidth / 2,
                            top: wobject.y - wobject.currentHeight / 2,
                            zIndex: wobject.z,
                        }}
                    >

                        <div className="border-none w-full h-full">
                            <div className="w-full flex justify-between"
                                style={{
                                    userSelect: 'none'
                                }}
                            >
                                <span className="flex-1"></span>
                                <i className="block material-icons align-middle text-[1.5rem] m-0.5" onClick={() => copyToClipboard(wobject)}>content_copy</i>
                                <i className="block material-icons align-middle text-[1.5rem] m-0.5" onClick={() => {
                                    setWobjects(wobjects.filter((w) => w.id != wobject.id));
                                    if (wobject.wobject.networkId) {
                                        props.api.removeWhiteBoardObject(props.id, wobject.wobject.networkId);
                                    }
                                }}>close</i>
                            </div>
                            {wobject.wobjectElement}
                        </div>

                        <div
                            ref={wobject.extendingRef}
                            className='hover:bg-gray-100'
                            style={{
                                position: "absolute",
                                width: "20px",
                                height: "20px",
                                right: 0,
                                bottom: 0,
                            }} />
                    </div>
                ))
                }
                {rightClickMenu ? <WhiteboardMenu x={rightClickMenu.x} y={rightClickMenu.y} setCreatedWobject={setCreatedWobject} /> : <div></div>}
            </div>
            <ChatWindow WhiteboardIndex={props.id} />
        </>
    );
};


export default Whiteboard;
