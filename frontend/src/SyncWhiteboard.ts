import {QueryClient, QueryClientProvider, QueryKey, useQuery} from '@tanstack/react-query';

import {Wobject} from './wobjects/Wobject.tsx'

class SyncWhiteboard {
  whiteboardId: number;

  constructor(whiteboardId: number|null, wobjects: Wobject[]) {
    if (!whiteboardId) {
      // TODO
      this.whiteboardId = Date.now();
    } else {
      this.whiteboardId = whiteboardId;
    }

    setInterval(
        () => {
            /*
          wobjects.forEach((wobject) => {
            if (!wobject.networkId) {
              fetch(
                  `${import.meta.env.VITE_BASE_URL}/new_whiteboard_object/${
                      this.whiteboardId}/`,
                  {
                    method: 'POST',
                    headers: new Headers({
                      'Content-Type': 'application/json',
                    }),
                    credentials: 'include',
                    body: wobject.wobject.customData,
                  })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                  });
            } else {
              fetch(
                  `${import.meta.env.VITE_BASE_URL}/update_whiteboard_object/${
                      this.whiteboardId}/${wobject.networkId}/`,
                  {
                    method: 'PUT',
                    headers: new Headers({
                      'Content-Type': 'application/json',
                    }),
                    credentials: 'include',
                    body: wobject.wobject.customData,
                  })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                  });
            }
          });
          */
        },
        5000);
  }
}

export default SyncWhiteboard;