export class WhiteboardMetadata {
    id: number;
    name: string;
    owner_id: number;
  
    constructor(id: number, name: string, owner_id: number) {
      this.id = id;
      this.name = name;
      this.owner_id = owner_id;
    }
}