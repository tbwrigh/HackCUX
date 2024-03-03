import {Wobject} from '../wobjects/Wobject.ts'

import {WhiteboardMetadataGET, WhiteboardObjectsGET} from './ApiTypes.ts'

export class Api {
  constructor() {}

  syncWobjects(wobjects: Wobject[], whiteboardID: number) {
    console.log('Syncing');
    wobjects.forEach((w) => {
      if (!w.wobject.networkId) {
        w.wobject.networkId = 1;
        fetch(
            `${import.meta.env.VITE_BASE_URL}/new_whiteboard_object/${
                whiteboardID}/`,
            {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              credentials: 'include',
              body: JSON.stringify({
                data: {...w.wobject, x: w.x, y: w.y},
              }),
            })
            .then((res) => res.json())
            .then((data: {id: number}) => {
              w.wobject.networkId = data.id;
            });
      } else if (w.wobject.networkId != 1) {
        fetch(
            `${import.meta.env.VITE_BASE_URL}/update_whiteboard_object/${
                whiteboardID}/${w.wobject.networkId}/`,
            {
              method: 'PUT',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              credentials: 'include',
              body: JSON.stringify({
                data: {...w.wobject, x: w.x, y: w.y},
              }),
            })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
            });
      }
    });
  }

  getWhiteboardObjects(
      whiteboardID: number, callback: (data: WhiteboardObjectsGET[]) => void) {
    fetch(
        `${import.meta.env.VITE_BASE_URL}/whiteboard_objects/${whiteboardID}/`,
        {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          credentials: 'include',
        })
        .then((res) => res.json())
        .then((data: WhiteboardObjectsGET[]) => {
          callback(data);
        });
  }

  removeWhiteBoardObject(whiteboardID: number, wobjectID: number) {
    fetch(
        `${import.meta.env.VITE_BASE_URL}/delete_whiteboard_object/${
            whiteboardID}/${wobjectID}`,
        {
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          credentials: 'include',
        })
        .then((res) => res.json())
        .then((data) => {console.log(data)});
  }

  getWhiteboards(callback: (data: WhiteboardMetadataGET[]) => void) {
    fetch(`${import.meta.env.VITE_BASE_URL}/whiteboards`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
    })
        .then((res) => {
          return res.json();
        })
        .then((res: WhiteboardMetadataGET[]) => {
          callback(res);
        })
        .catch((e) => {
          console.log(e);
        });
  }
}