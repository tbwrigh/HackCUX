export interface WhiteboardMetadataGET {
  id: number;
  name: string;
  owner_id: number;
}

export interface CreateWobjectPOST {
  data: {
    type: string|null,
    data: string|null,
  }
}

export interface WhiteboardObjectsGET {
  creator_id: number, data: {
    type: string,
    text: string,
    x: number,
    y: number,
  }[],
      id: number, whiteboard_id: number,
}