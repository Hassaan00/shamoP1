import { User } from "./user";
import { Currency } from "./currency";
import { DefaultAccount } from "./defaultAccount";
import { PaymentDepositIn } from "./paymentDepositIn";
import { Document } from "./document";
import { Case } from "./case";

export class PrefilingSettlement {

    id: number;
    defaultAmount: number = 0;
    principalAmount: number = 0;
    markupPercentage: number = 0;
    markupAmount: number = 0;
    writeOffAmount: number = 0;
    totalAmount: number = 0;
    remainingAmount: number = 0;

    settlementSystemNumber: string;
    // SubmitAmount: number;
    // ReferenceNumber: string;
    settlementStatus: string;
    settlementOptionId: number;
    userComment: string;
    partyComment: string;
    // preSettlementParty: any;
    preSettlementParty: PreSettlementParty = new PreSettlementParty();
    settlementDate: string;
    currencyId: number;
    currency: Currency = new Currency();
    documents: Document[] = [];

    user: User;


}

export class PreSettlementParty {
    id: number;
    defaulterAccount: DefaultAccount = new DefaultAccount();
    settlementPaymentReceive: SettlementPaymentReceive[] = [];
    settlementPaymentTerm: SettlementPaymentTerm[] = [];
}


export class PostfilingSettlement {
    id: number;
    postfilingSettlementId: number;
    caseBasicId: number;
    caseBasic: any;
    case: Case = new Case();
    caseId: number;
    depositeIn: string;
    settlementSystemNumber: string;
    settlementDate: string;
    settlementStartDate: string;
    settlementEndDate: string;
    settlementSchedule: string;
    currencyId: number;
    currency: Currency = new Currency();
    principalAmount: number = 0;
    markupPercentage: number = 0;
    markupAmount: number = 0;
    defaultAmount: number = 0;
    remainingAmount: number = 0;
    totalAmount: number = 0;
    writeOffAmount: number = 0;
    settlementOptionId: number;
    settlementOption: SettlementType = new SettlementType();
    userComment: string;
    partyComment: string;
    settlementType: string;
    postSettlementParty: PostSettlementParty = new PostSettlementParty();
    documents: Document[] = [];
    user: User;

}

export class PostSettlementParty {
    id: number;
    defaulterAccount: DefaultAccount = new DefaultAccount();
    settlementPaymentReceive: SettlementPaymentReceive[] = [];
    settlementPaymentTerm: SettlementPaymentTerm[] = [];
}

export class SettlementPaymentTerm {
    id: number;
    amountPercentage: number;
    amount: number;
    paymentDate: string;
    currencyId: number;
    currency: Currency = new Currency();

}

export class SettlementPaymentReceive {
    id: number;
    amountReceive: string;
    paymentDate: string;
    instrumentNumber: string;
    currencyId: number;
    currency: Currency = new Currency();
    // paymentDepositIn: any;
    paymentDepositIn: PaymentDepositIn = new PaymentDepositIn();
    paymentDepositInId: number;
}

export class SettlementType {
    id: number;
    settlementName: string;
    settlementCodeName: string;
}

export class SettlementPayment {
    id: number;
    preSettlement: string;
    postSettlement: string;
    submitAmount: number = 0;
    currencyId: number;
    currency: Currency = new Currency();
    payOrderOrReferenceOrReceiptNo: string;
    depositIn: string;
    paymentDate: string;
}
