import React from 'react';
import { useState } from 'react'

interface CreateWhiteboardMenuProps {
    setWhiteboardID: React.Dispatch<React.SetStateAction<number | null>>;
    setNeedToCreate: React.Dispatch<React.SetStateAction<boolean>>;
    setNeedToReload: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateWhiteboardMenu(props: CreateWhiteboardMenuProps) {
    const entries = [{
        label: "Name",
        hint: "awesomecoolwhiteboard",
        type: "name",
        value: "",
    }];

    return (
        <div
            className="fixed z-9999 w-32 bg-white shadow-lg bg-gray-100 text-lg p-6"
            style={{
                width: 500,
                marginTop: -250,
                marginLeft: -250,
                top: "50%",
                left: "50%"
            }}
        >
            {entries.map((field, i) => (
                <div key={i} className="mb-6">
                    <label className="block text-gray-700 text-lg font-bold mb-2">{field.label}</label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder={field.hint}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newValue = (event.target || event.currentTarget) as HTMLInputElement;
                            field.value = newValue.value;
                        }}
                    />
                </div>
            ))}
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg focus:outline-none focus:shadow-outline transform transition-colors duration-150"
                    onClick={(event: React.MouseEvent) => {
                        const chosenName = entries.find(entry => entry.type == "name")!.value;

                        // Create whiteboard in backend and return
                        fetch(
                            `${import.meta.env.VITE_BASE_URL}/new_whiteboard/${chosenName}`,
                            {
                                method: 'POST',
                                headers: new Headers({
                                    'Content-Type': 'application/json',
                                }),
                                credentials: 'include',
                            }
                        ).then((res) =>
                            res.json(),
                        ).then((res) => {
                            console.log(res);
                            props.setWhiteboardID(res.id);
                            props.setNeedToCreate(false);
                            props.setNeedToReload(true);
                        });
                    }}>
                    Create
                </button>
            </div>
        </div>
    );
}

export default CreateWhiteboardMenu;
