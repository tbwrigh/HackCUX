import React from 'react';
import { useState } from 'react'

interface CreateWhiteboardMenuProps {
    setWhiteboardID: React.Dispatch<React.SetStateAction<number | null>>;
    setNeedToCreate: React.Dispatch<React.SetStateAction<boolean>>;
    setNeedToReload: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateWhiteboardMenu(props: CreateWhiteboardMenuProps) {
    const entries = [{
        label: "New Whiteboard",
        hint: "Enter a name",
        type: "name",
        value: "",
    }];

    return (
        <div className="fixed w-full h-full bg-black/35 z-40">
        <dialog className="fixed rounded-lg z-50 inset-0 w-96 h-min bg-white shadow-lg bg-gray-100 py-4 px-6" open>
            {entries.map((field, i) => (
                <div key={i}>
                    <label className="block font-extrabold text-2xl py-3 text-center">{field.label}</label>
                    <input
                        type="text"
                        className="outline outline-1 outline-gray-300 rounded-full w-full my-3 py-3 px-4 text-gray-700 focus:outline-none focus:ring focus:ring-blue-700"
                        placeholder={field.hint}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newValue = (event.target || event.currentTarget) as HTMLInputElement;
                            field.value = newValue.value;
                        }}
                        autoFocus
                    />
                </div>
            ))}
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150"
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
        </dialog>
        </div>
    );
}

export default CreateWhiteboardMenu;
