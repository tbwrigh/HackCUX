import React from 'react';
import { useState } from 'react'

import { CreatedWobject, WobjectTypes, CreateWobjectProps } from "./wobjects/Wobject.ts"

import './App.css'

function WhiteboardMenu(props: CreateWobjectProps) {
    const [createdWobject, setCreatedWobject] = useState<CreatedWobject | null>(null);

    const handleClickContextMenu = (e: React.MouseEvent, type: string) => {
        if (WobjectTypes.find(wobject => wobject.type == type)!.fields.length == 0) {
            // Directly set
            props.setCreatedWobject({
                type: type,
                x: e.clientX,
                y: e.clientY,
                fields: [],
                customData: "",
            });
        } else {
            // Open menu
            setCreatedWobject({
                type: type,
                x: e.clientX,
                y: e.clientY,
                fields: [],
                customData: "",
            });
        }
    };

    return (
        <>
            {
                !createdWobject ?
                    <div
                        className="fixed z-9999 w-32 bg-white shadow-lg"
                        style={{ left: props.x, top: props.y }}
                    >
                        <ul className="text-sm text-gray-700">
                            {WobjectTypes.map((option, i) => (
                                <li key={i} className="px-4 py-2 bg-gray-100 cursor-pointer text-lg flex justify-between w-full" onClick={(e) => handleClickContextMenu(e, option.type)}>
                                    <span>{option.label}</span>
                                    <i className="material-icons align-middle w-4 h-4">{option.icon}</i>
                                </li>
                            ))}
                        </ul>
                    </div>
                    :
                    <div
                        className="fixed z-10 w-32 bg-white shadow-lg bg-gray-100 text-lg p-6"
                        style={{
                            width: 500,
                            marginTop: -250,
                            marginLeft: -250,
                            top: "50%",
                            left: "50%"
                        }}
                    >
                        {WobjectTypes.find(wobject => wobject.type == createdWobject.type)!.fields.map((field, i) => (
                            <div key={i} className="mb-6">
                                <label className="block text-gray-700 text-lg font-bold mb-2">{field.label}</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder={field.hint}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        const newValue = (event.target || event.currentTarget) as HTMLInputElement;

                                        let addedField = createdWobject.fields.find(f => f.type == field.type);
                                        if (addedField) {
                                            addedField.value = newValue.value;
                                        } else {
                                            createdWobject.fields.push({
                                                type: field.type,
                                                value: newValue.value,
                                            });
                                        }
                                    }}
                                />
                            </div>
                        ))}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg focus:outline-none focus:shadow-outline transform transition-colors duration-150"
                                onClick={(event: React.MouseEvent) => {
                                    props.setCreatedWobject(createdWobject);
                                }}>
                                Create
                            </button>
                        </div>
                    </div>
            }
        </>
    );
}

export default WhiteboardMenu;
