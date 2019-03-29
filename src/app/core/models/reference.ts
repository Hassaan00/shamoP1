import { BaseModel } from './base.model';
import { Document } from './document';

export class Reference {

    id: number;
    name: string;
    email: string;
    address: string;
    documents: Document[] = [];

}
