import React, { useEffect, useLayoutEffect } from 'react';
import { useState } from 'react'

import { useQuery, QueryKey, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WhiteboardMetadataGET } from './api/ApiTypes.ts'

import { Api } from './api/Api.ts'

interface ChooseWhiteboardMenuProps {
    setWhiteboardID: React.Dispatch<React.SetStateAction<number | null>>;
    setNeedToCreate: React.Dispatch<React.SetStateAction<boolean>>;
    needToReload: boolean;
    setNeedToReload: React.Dispatch<React.SetStateAction<boolean>>;
    api: Api;
}

function ChooseWhiteboardMenu(props: ChooseWhiteboardMenuProps) {
    const [loadedWhiteboards, setLoadedWhiteboards] = useState<WhiteboardMetadataGET[]>([])

    useEffect(() => {
        if (props.needToReload) {
            // Get whiteboards created by user
            props.setNeedToReload(false);

            props.api.getWhiteboards((res) => {
                console.log(res);
                if (res.length == 0) {
                    props.setNeedToCreate(true);
                } else {
                    props.setWhiteboardID(res[0].id);
                }

                setLoadedWhiteboards(res);
            })
        }
    }, [props.needToReload]);

    return (
        <>
            <ul className="flex flex-col gap-2">
                {loadedWhiteboards.map((whiteboard, i) => (
                    <li
                        key={i}
                        className="px-4 py-2 hover:bg-[#fcfdfe] cursor-pointer transition rounded-lg"
                        onClick={(e) => {
                            props.setWhiteboardID(whiteboard.id);
                        }}
                    >
                        {whiteboard.name}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ChooseWhiteboardMenu;
