import { BaseModel } from "./base.model";
import { CaseTerritory } from './caseTerritory';
import { CaseType } from './caseType';
import { CaseNature } from './caseNature';
import { CaseClassification } from './caseClassification';
import { LawyerRecommend } from './lawyerRecommend';
import { Observation } from './observation';
import { Department } from './department';
import { Currency } from './currency';
import { CaseDocument } from './caseDocument';
// import { AssociatePartner } from './associatePartner';
// import { Expertise } from './expertise';
// import { User } from './user';
import { DefaulterInfo } from './defaulterInfo';
import { CaseResultOption } from "./caseResultOption";
import { CaseResultActionOption } from "./caseResultActionOption";
import { CaseCloseSource } from "./caseCloseSource";
import { AmountRecoverSource } from "./amountRecoverSource";
import { PaymentDepositIn } from "./paymentDepositIn";
import { Court } from "./court";
import { ComplainNature } from "./complainNature";
import { PartyNature } from "./partyNature";
import { User } from "./user";
import { ExternalParty } from "./externalParty";
import { CaseCourt } from "./caseCourt";
import { InternalUnion } from "./internalUnion";

export class Case extends BaseModel {

    parentCaseBasicId: number;
    caseId: number;
    caseName: string;
    caseSystemNumber: string;
    caseTerritoryId: number;
    caseTerritory: CaseTerritory = new CaseTerritory();
    caseTypeId: number;
    caseType: CaseType = new CaseType();
    caseNatureId: number;
    caseNature: CaseNature = new CaseNature();
    caseSubNatureId: number;
    caseSubNature: CaseNature = new CaseNature();
    caseClassificationId: number;
    caseClassification: CaseClassification = new CaseClassification();
    caseClassificationCode: string;
    complainNatureId: number;
    complainNature: ComplainNature = new ComplainNature();
    partyNatureId: number;
    partyNature: PartyNature = new PartyNature();

    caseDepartmentId: number;
    caseDepartment: Department = new Department();

    caseObjective: string;

    caseCourt: CaseCourt = new CaseCourt();
    suitNo: string = null;
    firstHearingDate: string = null;
    courtId: number;
    court: Court = new Court();

    claimAmount: number = 0;
    currencyId: number;
    currency: Currency = new Currency();
    isClubbedCase: boolean = false;
    // clubbedCase: any = [];
    clubbedCase: Case[] = [];
    caseAttorney: any = [];
    caseAttorneyUsers: User[] = [];
    caseAttorneyUserIds: number[] = [];

    caseAttorneyUserOne: User = new User();
    caseAttorneyUserOneId: number = null;
    caseAttorneyUserOneDepartment: Department = new Department();
    caseAttorneyUserOneDepartmentId: number = null;

    caseAttorneyUserTwo: User = new User();
    caseAttorneyUserTwoId: number = null;
    caseAttorneyUserTwoDepartment: Department = new Department();
    caseAttorneyUserTwoDepartmentId: number = null;

    caseBy: any = [];
    caseDepartmentIds: number[] = [];
    caseDepartments: Department[] = [];
    caseByInternalEmployeeIds: number[] = [];
    caseByInternalEmployees: User[] = [];
    caseByExternalPartyIds: number[] = [];
    caseByExternalParties: ExternalParty[] = [];
    caseByInternalUnionIds: number[] = [];
    caseByInternalUnions: InternalUnion[] = [];

    caseAgainst: any = [];
    cAgDepartmentIds: number[] = [];
    cAgDepartments: Department[] = [];
    internalEmployeeIds: number[] = [];
    internalEmployees: User[] = [];
    externalPartyIds: number[] = [];
    externalParties: ExternalParty[] = [];
    internalUnionIds: number[] = [];
    internalUnions: InternalUnion[] = [];

    executionNumber: string;
    totalPrincipalAmount: number = 0;
    totalMarkupPercentage: number = 0;
    totalMarkupAmount: number = 0;

    caseDocument: CaseDocument[] = [];
    caseDate: string;
    
    caseFileDate: string;
    caseFileRequestDate: any;
    
    lawyerRecommendation: LawyerRecommend[] = [];
    lawyerRecommendationHistory: LawyerRecommend[] = [];
    defaulterInfo: DefaulterInfo = new DefaulterInfo();

    caseResult: CaseResultOption = new CaseResultOption();
    caseResultId: number;

    caseResultAction: CaseResultActionOption = new CaseResultActionOption();
    caseResultActionId: number;

    caseCloseSource: CaseCloseSource = new CaseCloseSource();
    caseCloseSourceId: number;

    caseCloseDate: string;
    caseCloseNote: string;

    amountRecoverSource: AmountRecoverSource = new AmountRecoverSource();
    amountRecoverSourceId: number;

    amountRecover: number = null;

    paymentDepositIn: PaymentDepositIn = new PaymentDepositIn();
    paymentDepositInId: number;

    caseFinalStatus: string;
    caseFinalStatusCode: string;
    observations: Observation[] = [];

    caseLC: any = [];
    // caseLC: CaseLC = [];

    documents: CaseDocument[] = [];
    // file: any;
    status: string;
    createdByUser: User = new User();
    // users: User[] = [];

    isDiscardDisabled = false;
}


export class SimpleCase {
    id: number;
    caseSystemNumber: string;

}


export class CIFCase {
    defaulterCif: string;
    defaulterCifId: number;
}

export class CaseLC {
    id: number;
    assignedDate: string;
    caseBasicId: number;
    user: User = new User();
}
