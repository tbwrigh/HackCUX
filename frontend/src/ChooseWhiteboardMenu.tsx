import React, { useEffect, useLayoutEffect } from 'react';
import { useState } from 'react'

import { WhiteboardMetadataGET } from './api/ApiTypes.ts'

interface ChooseWhiteboardMenuProps {
    setWhiteboardID: React.Dispatch<React.SetStateAction<number | null>>;
    setNeedToCreate: React.Dispatch<React.SetStateAction<boolean>>;
    needToReload: boolean;
    setNeedToReload: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChooseWhiteboardMenu(props: ChooseWhiteboardMenuProps) {
    const [loadedWhiteboards, setLoadedWhiteboards] = useState<WhiteboardMetadataGET[]>([])

    useEffect(() => {
        if (props.needToReload) {
            // Get whiteboards created by user
            fetch(
                `${import.meta.env.VITE_BASE_URL}/whiteboards`,
                {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                    }),
                    credentials: 'include',
                }
            ).then((res) =>
                res.json(),
            ).then((res: WhiteboardMetadataGET[]) => {
                if (res.length == 0) {
                    props.setNeedToCreate(true);
                } else {
                    props.setWhiteboardID(res[0].id);
                }

                setLoadedWhiteboards(res);
                props.setNeedToReload(false);
            });
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
