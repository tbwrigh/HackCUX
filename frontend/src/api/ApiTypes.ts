export class WhiteboardMetadataGET {
  id: number = 0;
  name: string = '';
  owner_id: number = 0;
}

export class CreateWobjectPOST {
  data: {
    type: string|null,
    data: string|null,
  } = {type: null, data: null}
}