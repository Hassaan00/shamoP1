import { BaseModel } from './base.model';
import { Document } from './document';

export class MortgageOption {

    id: number;
    mortgageOptionId: number;
    mortgageOption: string;
    selected: boolean;
    mortgageOptionCode: string;
    mortgageOptionDescription: string;
    mortgageOptionTooltip: string;
    value: string;

}
