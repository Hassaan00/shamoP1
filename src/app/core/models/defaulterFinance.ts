import { BaseModel } from './base.model';

export class DefaulterFinance {

    id: number;
    principalAmount: number;
    markupPercentage: number;
    markupValue: number;
    totalPenalty: number;
    financeDescription: string;
    defaulterAccountId: string;

}
