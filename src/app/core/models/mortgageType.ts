import { BaseModel } from './base.model';
import { Document } from './document';

export class MortgageType {

    id: number;
    mortgageTypeId: number;
    mortgageType: string;
    selected: boolean;
    mortgageTypeCode: string;
    mortgageTypeDescription: string;
    mortgageTypeTooltip: string;
    value: string;

}
