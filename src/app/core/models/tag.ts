import { BaseModel } from './base.model';

export class Tag {

    id: number;
    tagId: number;
    tagName: string;
    tagCode: string;
    tagDescription: string;
    tagToolTip: string;
    selected: boolean = false;
    sortOrder: number;
    value: string;

}
