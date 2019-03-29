import { BaseModel } from './base.model';
import { Document } from './document';
import { MortgageOption } from './mortgageOption';

export class MortgageOptionDetail {

    id: number;
    mortgageOptionDetailId: number;
    mortgageOptionDetail: string;
    selected: boolean;
    mortgageOptionDetailCode: string;
    mortgageOptionDetailDescription: string;
    mortgageOptionDetailTooltip: string;

    mortgageOption: MortgageOption = new MortgageOption();
    
    value: string;

}
