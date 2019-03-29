import { BaseModel } from './base.model';
import { Country } from './country';

export class PaymentDepositIn {

    id: number = null;
    paymentDepositInId: number;
    paymentDepositIn: string;
    paymentDepositInCode: string;
    paymentDepositInDescription: string;
    paymentDepositInTooltip: string;
    sortOrder: string;
    isActive: boolean;

}
