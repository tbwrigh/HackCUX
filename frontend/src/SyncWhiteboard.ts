import {QueryClient, QueryClientProvider, QueryKey, useQuery} from '@tanstack/react-query';

import {Wobject} from './wobjects/Wobject.tsx'

class SyncWhiteboard {
  whiteboardId: number;

  constructor(whiteboardId: number, wobjects: Wobject[]) {
    this.whiteboardId = whiteboardId;

    /*
    setTimeout(() => {
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
                body: JSON.stringify({
                  data: {
                    text: wobject.wobject.customData,
                    x: wobject.wobject.x,
                    y: wobject.wobject.y,
                  },
                }),
              })
              .then((res) => res.json())
              .then((data: {id: number}) => {
                wobject.networkId = data.id;
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
                body: JSON.stringify({
                  data: {
                    text: wobject.wobject.customData,
                    x: wobject.wobject.x,
                    y: wobject.wobject.y,
                  },
                }),
              })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
              });
        }
      });
    }, 5000);
    */
  }
}

export default SyncWhiteboard;