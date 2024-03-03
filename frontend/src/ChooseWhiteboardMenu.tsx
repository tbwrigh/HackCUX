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

interface GlobalSearchResult {
    [key: number]: number;
}

function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
    let timeout: ReturnType<typeof setTimeout> | null;
    return function executedFunction(...args: any[]): void {
      const later = () => {
        clearTimeout(timeout!);
        func(...args);
      };
      clearTimeout(timeout!);
      timeout = setTimeout(later, wait);
    };
  }

function ChooseWhiteboardMenu(props: ChooseWhiteboardMenuProps) {
    const [loadedWhiteboards, setLoadedWhiteboards] = useState<WhiteboardMetadataGET[]>([])
    const [searchTerm, setSearchTerm] = useState('');

    const filterAndSortWhiteboards = async (searchTerm: string) => {
        if (searchTerm === '') {
          return;
        }
    
        const results = await fetch(`${import.meta.env.VITE_BASE_URL}/global_search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            query: searchTerm
          })
        });
    
        const res: GlobalSearchResult[] = await results.json();

        const temp: WhiteboardMetadataGET[] = [];
    
        for (let i = 0; i < res.length; i++) {
          const id = parseInt(Object.keys(res[i])[0]);
          console.log(id)
          temp.push(loadedWhiteboards.find((whiteboard) => whiteboard.id === id)!);
        }
    
        setLoadedWhiteboards(temp);
      };

    const debouncedFilterAndSort = debounce(filterAndSortWhiteboards, 1000); // 300ms delay

    useEffect(() => {
        debouncedFilterAndSort(searchTerm);
      }, [searchTerm]);    

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

    return (
        <>
            <ul className="flex flex-col gap-2">
                <li className="px-4 py-2 cursor-pointer transition rounded-lg">
                    <input
                        name="search"
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-full p-3"
                    />
                </li>
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
