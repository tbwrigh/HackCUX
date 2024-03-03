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
                if (res.length == 0) {
                    props.setNeedToCreate(true);
                } else {
                    props.setWhiteboardID(res[0].id);
                }

                setLoadedWhiteboards(res);
            })
        }
    }, [props.needToReload]);

    return loadedWhiteboards.map((whiteboard, i) => (
        <div key={i} className="mb-6">
            <span
                className="block text-black text-lg font-bold mb-2"
                onClick={(e) => {
                    props.setWhiteboardID(whiteboard.id);
                }}>{whiteboard.name}</span>
        </div>
    )
    );
}

export default ChooseWhiteboardMenu;
