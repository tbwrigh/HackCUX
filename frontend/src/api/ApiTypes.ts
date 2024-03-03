export interface WhiteboardMetadataGET {
  id: number = 0;
  name: string = '';
  owner_id: number = 0;
}

export interface CreateWobjectPOST {
  data: {
    type: string|null,
    data: string|null,
  }
}

export interface WhiteboardObjectsGET {
  creator_id: number, data: {
    text: string,
    x: number,
    y: number,
  },
      id: number, whiteboard_id: number,
}