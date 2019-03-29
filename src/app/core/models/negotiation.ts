import { DefaultAccount } from "./defaultAccount";
import { CIF } from "./cif";
import { RemarkOption } from "./remark.option";
import { CaseFinalStatus } from "./caseFinalStatus";
import { User } from "./user";
import { ExternalParty } from "./externalParty";
import { Case } from "./case";

export class Negotiation {

    id: number;
    negotiationId: number;
    caseBasicId: number;
    caseBasic: any;
    case: Case = new Case();

    detailObjective: string;
    negotiationChat = new Array();

    defaulterCIFDetails: CIF = new CIF();
    defaulterCif: string;

    negotiationParty = new Array<NegotiationParty>();
    negotiationParties: NegotiationParty[] = [];
    negotiationType: string;
    startDate: string;
    expectedEndDate: string;
    endDate: string;

    remarkId: number;
    remark: RemarkOption = new RemarkOption();
    endResultRemarks: string;
    status: CaseFinalStatus = new CaseFinalStatus();
}

export class NegotiationParty {

    id: number;

    // externalParty: any;
    externalParty: ExternalParty = new ExternalParty();
    externalPartyId: number;

    defaulterAccount: DefaultAccount = new DefaultAccount();
    defaulterAccountId: number;

    internalEmployee: User = new User();
    internalEmployeeId: number;

    negotiationAmount: string;
}
