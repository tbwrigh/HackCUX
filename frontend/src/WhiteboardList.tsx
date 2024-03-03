import React from 'react';

import { useQuery, QueryKey, QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface WhiteboardListProps {
}

function WhiteboardList(props: WhiteboardListProps) {
    //const { isLoading, isError, data } = useQuery<boolean, boolean, WhiteboardMetadataGET[]>({
    //    queryKey: ['GET', 'whiteboards'],
    //});

    return (
        <>
            <div className="flex h-screen">
                <div className="w-64 bg-gray-800 text-white">
                    <ul>
                        <li className="p-4 hover:bg-gray-700">Menu Item 1</li>
                        <li className="p-4 hover:bg-gray-700">Menu Item 2</li>
                        <li className="p-4 hover:bg-gray-700">Menu Item 3</li>
                    </ul>
                </div>

                <div className="flex-1 bg-gray-100 p-8">
                    Main content goes here.
                </div>
            </div>

        </>
    );
}

export default WhiteboardList;
