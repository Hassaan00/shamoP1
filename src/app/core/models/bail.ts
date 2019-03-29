import { CaseCourt } from "./caseCourt";
import { PaymentDepositOptions } from "./auction";
import { Document } from "./document";
import { LawFirm } from "./lawFirm";
import { InternalEmployee } from "./employee";

export class Bail {
    id: number;
    bailDescription: number;
    bailValue: number;
    paymentDepositInId: number;
    caseCourtId: number;
    lawFirmId: number;
    lawFirm: LawFirm = new LawFirm();
    internalEmployeeId: number;
    internalEmployee: InternalEmployee = new InternalEmployee();
    proxyName: string;
    genericStatus: any;
    caseCourt: CaseCourt = new CaseCourt();
    paymentDepositIn: PaymentDepositOptions = new PaymentDepositOptions();
    bailDocument = [];
    // BailOptionId: number;
    bailFinalStatus: BailOption = new BailOption();
    bailDocs: Document[] = [];

}


export class BailOption {
    id: number;
    optionName: string;
    optionCode: string;
    optionDescription: string;
    optionTooltip: string;
    sortOrder: number;
}