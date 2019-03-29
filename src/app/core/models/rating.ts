import { BaseModel } from './base.model';

export class Rating {

    id: number = null;
    ratingId: number = null;
    ratingName: string = null;
    ratingCode: string = null;
    ratingDescription: string = null;
    ratingTooltip: string = null;
    belongTo: string = null;
    selected: boolean;
    sortOder: number;
    isActive: boolean;
    value: string;

}
