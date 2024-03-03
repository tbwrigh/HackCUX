import React from 'react';

import { CreatedWobject, WobjectTypes, CreateWobjectProps } from "./wobjects/Wobject.ts"

import './App.css'

function WhiteboardMenu(props: CreateWobjectProps) {
    const handleClick = (e: React.MouseEvent, type: string) => {
        props.setCreatedWobject({
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
                {WobjectTypes.map((option) => (
                    <li className="px-4 py-2 bg-gray-100 cursor-pointer" onClick={(e) => handleClick(e, option.type)}>{option.label}</li>
                ))}
            </ul>
        </div>
    );
}

export default WhiteboardMenu;