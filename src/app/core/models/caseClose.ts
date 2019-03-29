import { BaseModel } from './base.model';
import { Case } from "./case";
import { CaseCloseSource } from "./caseCloseSource";
import { AmountRecoverSource } from "./amountRecoverSource";
import { PaymentDepositIn } from "./paymentDepositIn";
// import { User } from "./user";
// import { Document } from "./document";

export class CaseClose {

    id: number;
    caseCloseId: number;

    caseBasic: Case = new Case();
    caseBasicId: number;

    caseCloseSource: CaseCloseSource = new CaseCloseSource();
    caseCloseSourceId: number;

    amountRecoverSource: AmountRecoverSource = new AmountRecoverSource();
    amountRecoverSourceId: number;

    amountRecover: number = null;

    paymentDepositIn: PaymentDepositIn = new PaymentDepositIn();
    paymentDepositInId: number;

    caseCloseNote: string = null;
    caseCloseDate: string = null;

    // documents: Document[] = [];

    // user: User;


}
