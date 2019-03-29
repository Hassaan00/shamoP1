import { BaseModel } from "./base.model";
import { QueryType } from './queryType';
import { LawFirm } from './lawFirm';
import { User } from "./user";
import { ExternalParty } from "./externalParty";
import { FormStatus } from "./formStatus";
import { FinalStatus } from "./finalStatus";
import { Observation } from './observation';
import { Document } from './document';
import { Tag } from "./tag";
import { Currency } from "./currency";
import { Contract } from "./contract.model";
import { EvaluationRemark } from "./evaluation.remark";

export class Advisory extends BaseModel {

    parentAdvisoryBasicId: number;
    advisoryId: number;
    advisoryServiceSystemNumber: string;
    assignmentTitle: string;
    queryDescription: string = null;
    initiateDate: string = null;
    followUpDate: string = null;
    completionDate: string = null;

    // queryTypeOther: any = null;
    queryTypeOther: string = null;
    queryTypeId: number;
    queryType: QueryType = new QueryType();

    advisoryServiceContractIds: number[] = [];
    advisoryServiceContracts: Contract[] = [];

    authorizedStaff: string = null;
    receivingDateLegal: string = null;

    formStatus: FormStatus = new FormStatus();
    finalStatus: FinalStatus = new FinalStatus();
    finalStatusName: string;
    finalStatusCode: string;
    adviceFormStatus: FormStatus = new FormStatus();
    adviceFinalStatus: FinalStatus = new FinalStatus();

    advisoryServiceDocument: Document[] = [];
    advisoryServiceDocuments: Document[] = [];

    referenceTagIds: number[] = [];
    referenceTags: Tag[] = [];

    advisoryServiceRequester: AdvisoryServiceRequester = new AdvisoryServiceRequester();
    advisoryServiceAssign: AdvisoryServiceAssign = new AdvisoryServiceAssign();

    advisoryServiceAdviceId: number;
    advisoryServiceAdvice: AdvisoryServiceAdvice = new AdvisoryServiceAdvice();

    reviewingAuthorityId: number;
    reviewingAuthority: User = new User();

    followUpUserId: number;
    followUpUser: User = new User();

    flagColor: string;

    by: User = new User();
    coordinatorId: number;
    coordinator: User = new User();
    detailComment: string;
    id: number;
    observations: Observation[] = [];
    isExistingAdvice: boolean = false;
    // file: any;
    status: string;
    // users: User[] = [];
    createdByUser: User = new User();
    lastMessage: string;
    isDiscardDisabled = false;

    isAdviceApproveDisabled = false;
    isAdviceRejectDisabled = false;
}

export class AdvisoryServiceRequester {
    id: number;
    internalEmployeeId: number;
    internalEmployee: User = new User();
    externalPartyId: number;
    externalParty: ExternalParty = new ExternalParty();
    internalUnionId: number;
    internalUnion: any;
    userId: number;
    user: User = new User();
}

export class AdvisoryServiceAssign {
    id: number;
    feeAmount: string;
    feePercentage: string;
    currencyId: number;
    currency: Currency = new Currency();
    userId: number;
    user: User = new User();
    lawFirmId: number;
    lawFirm: LawFirm = new LawFirm();
    panel: string;
    adviceEvaluationStatus: EvaluationRemark = new EvaluationRemark();
}

export class AdvisoryServiceAdvice extends BaseModel {
    advisoryServiceAdviceId: number;
    // advisoryServiceAdviceId: number;
    // isExistingAdvice: boolean = false;
    existingAdviceId: number;
    userId: number;
    user: User = new User();
    lawFirmId: number;
    lawFirm: LawFirm = new LawFirm();
    panel: string;
    adviceDescription: string;
    advisoryServiceAdviceDocument: Document[] = [];
    advisoryServiceAdviceDocuments: Document[] = [];

    isSelected: boolean = false;
    formStatus: FormStatus = new FormStatus();
    finalStatus: FinalStatus = new FinalStatus();
}