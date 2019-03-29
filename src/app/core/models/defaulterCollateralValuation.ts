import { BaseModel } from './base.model';
import { Document } from './document';

export class DefaulterCollateralValuation {

    id: number;
    defaulterCollateralValuationId: number;
    valuatorName: string;
    valuationDate: string;
    marketValue: string;
    forcedSaleValue: string;
    isCurrentValuation: boolean;
    
}
