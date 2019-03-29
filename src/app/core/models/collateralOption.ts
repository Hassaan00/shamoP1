import { BaseModel } from './base.model';
import { Document } from './document';

export class CollateralOption {

    id: number;
    collateralOptionId: number;
    collateralOption: string;
    selected: boolean;
    collateralOptionCode: string;
    collateralOptionDescription: string;
    collateralOptionTooltip: string;
    value: string;

}
