import React from 'react';

import { CreateWobject } from "./Whiteboard"

import './QueryApp.css'

interface WhiteboardMenuProps {
    x: number;
    y: number;
    setCreateWobject: React.Dispatch<React.SetStateAction<CreateWobject | null>>;
}

function WhiteboardMenu(props: WhiteboardMenuProps) {
    const options = [{
        label: "Text",
        type: "text",
    }, {
        label: "Video",
        type: "video",
    }, {
        label: "Code",
        type: "code",
    }];

    const handleClick = (e: React.MouseEvent, type: string) => {
        props.setCreateWobject({
            type: type,
            x: e.clientX,
            y: e.clientY,
        });
    };

    return (
        <div
            className="absolute z-50 w-32 bg-white shadow-lg"
            style={{ left: props.x, top: props.y }}
        >
            <ul className="text-sm text-gray-700">
                {options.map((option) => (
                    <li className="px-4 py-2 bg-gray-100 cursor-pointer" onClick={(e) => handleClick(e, option.type)}>{option.label}</li>
                ))}
            </ul>
        </div>
    );
}

export default WhiteboardMenu;