import { BaseModel } from "./base.model";
import { User } from './user';
import { Case } from './case';
import { Observation } from './observation';
import { CaseDocument } from './caseDocument';
// import { LawFirm } from './lawFirm';
import { Court } from './court';
import { HearingPostponedReason } from "./hearingPostponedReason";
import { ComplianceResponsibility } from "./complianceResponsibility";
import { ComplianceNature } from "./complianceNature";
import { OrderPass } from "./orderPass";
import { CaseCourt } from "./caseCourt";
import { CaseFilling } from "./caseFilling";
import { CourtComplianceIssue } from "./courtComplianceIssue";
import { LawFirm } from "./lawFirm";
import { Currency } from "./currency";

export class CaseProceeding extends BaseModel {

    caseProceedingId: number;
    caseProceedingHistoryId: number;
    caseProceedingSystemNo: string;
    caseBasic: Case = new Case();
    caseBasicId: number;

    hearingDate: string;
    isHearingHeld: boolean;
    hearingHeld: string;
    hearingNote: string = null;

    hearingPostponedReason: HearingPostponedReason = new HearingPostponedReason();
    hearingPostponedReasonId: number;

    isFinalOrder: boolean;
    orderPassOption: OrderPass = new OrderPass();
    orderPassOptionId: number;

    decreeAmount: number;
    decreeAmountCurrency: Currency = new Currency();
    decreeAmountCurrencyId: number;

    executionAmount: number;
    executionAmountCurrency: Currency = new Currency();
    executionAmountCurrencyId: number;

    isFinancialExposure: boolean;
    financialExposure: string;

    caseCourt: CaseFilling = new CaseFilling();
    caseCourtId: number;

    court: Court = new Court();
    courtId: number;

    isCourtComplianceIssue: boolean;
    // courtComplianceIssue: CourtComplianceIssue[] = new CourtComplianceIssue();
    courtComplianceIssue: CourtComplianceIssue[] = [];
    complianceStatus: boolean;

    judges: User[] = [];
    judgeIds: number[] = [];

    caseProceedingJudge: CaseProceedingJudge[] = [];

    caseProceedingAttendee: CaseProceedingAttendee[] = [];

    caseProceedingAttendeeLawFirms: CaseProceedingAttendeeLawFirm[] = [];
    caseProceedingAttendeeLawFirm: CaseProceedingAttendeeLawFirm = new CaseProceedingAttendeeLawFirm();

    // lawFirm: LawFirm = new LawFirm();
    // attendeeLawyer: CaseProceedingAttendee[] = [];
    // attendeeLawyerUserIds: number[] = [];
    caseProceedingAttendeeLc: CaseProceedingAttendeeLc = new CaseProceedingAttendeeLc();
    attendeeLC: CaseProceedingAttendee = new CaseProceedingAttendee();


    nextHearingDate: string;
    nextHearingNote: string = null;

    documents: CaseDocument[] = [];

    caseHearingHistory: CaseProceeding[] = [];
    caseProceedingStatus: any;
    caseProceedingGenericStatus: any;

    status: string;

}


export class CaseProceedingJudge extends BaseModel {

    user: User = new User();
    judgeUserId: number;
    judgeRemarks: string;
}

export class CaseProceedingAttendee extends BaseModel {

    user: User = new User();
    userId: number;
    lawFirm: LawFirm = new LawFirm();
    lawFirmId: number;
}

export class CaseProceedingAttendeeLawFirm extends BaseModel {

    lawFirm: LawFirm = new LawFirm();
    lawFirmId: number;
    selectedUsers: User[] = [];
    selectedUserIds: number[] = [];
}

export class CaseProceedingAttendeeLc extends BaseModel {


    users: User[] = [];
    selectedUsers: User[] = [];
    selectedUserIds: number[] = [];
}