import { DefaulterInfo } from "./defaulterInfo";
import { Department } from "./department";
import { User } from "./user";
import { ExternalParty } from "./externalParty";
import { InternalUnion } from "./internalUnion";
import { LawyerRecommend } from "./lawyerRecommend";
import { CaseCourt } from "./caseCourt";
import { Court } from "./court";
import { CaseLC } from "./case";
import { CaseProceeding } from "./caseProceeding";
import { PartyNature } from "./partyNature";
import { FlagData } from "./flagData";


export class DailyLitigationRequestPayload {
    dateFrom: string = null;
    dateTo: string = null;
    caseLcUserId: number = null;
    regionId: number = null;
    departmentId: number = null;
    caseTerritoryId: number = null;
    criticalOptionCode: string = null;
    caseStatusCode: string = null;
    caseNatureCode: string = null;
    tabOptionCode: string = null;
    keyword: string = null;
    pageNo: number = null;
    pageLimit: number = null;
    showFlag: boolean = false;
}

export class DailyLitigationReport {

    id: number;
    caseId: number;
    caseName: string;
    caseSystemNumber: string;

    flagData: FlagData = new FlagData();

    claimAmount: number;

    executionNumber: string;
    executionDate: string;
    executionAmount: number;

    decreeDate: string;
    decreeAmount: number;

    caseDate: string;
    caseFileDate: string;

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
    defaulterInfo: DefaulterInfo = new DefaulterInfo();
    cAgDepartmentIds: number[] = [];
    cAgDepartments: Department[] = [];
    internalEmployeeIds: number[] = [];
    internalEmployees: User[] = [];
    externalPartyIds: number[] = [];
    externalParties: ExternalParty[] = [];
    internalUnionIds: number[] = [];
    internalUnions: InternalUnion[] = [];

    lawyerRecommendation: LawyerRecommend[] = [];

    partyNature: PartyNature = new PartyNature();

    caseCourt: CaseCourt = new CaseCourt();
    suitNo: string;
    firstHearingDate: string;
    courtId: number;
    court: Court = new Court();

    caseLC: CaseLC[] = [];

    caseProceeding: CaseProceeding = new CaseProceeding();

    noOfHearingToDate: number;
    noOfAuction: number;
    isAuctionHeld: boolean = false;
    isAuctionSuccessful: boolean = false;

    createdByUser: User = new User();

}
