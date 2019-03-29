import { BaseModel } from "./base.model";
import { User } from './user';
import { Case } from './case';
import { Observation } from './observation';
import { CaseDocument } from './caseDocument';
// import { LawFirm } from './lawFirm';
import { Court } from './court';
import { LawFirm } from "./lawFirm";

export class CaseFilling extends BaseModel {

    caseFillingId: number;
    case: Case = new Case();
    caseBasicId: number;
    suitNo: string = null;
    caseFileDate: string; 
    firstHearingDate: string; 
    // caseHearingData: any = null;
    // lawFirm: LawFirm = new LawFirm();
    // lawFirmLawyerId: number;
    court: Court = new Court();
    courtId: number;
    judges: User[] = [];
    judgeIds: number[] = [];
    caseFillingDescription: string = null;

    documents: CaseDocument[] = [];
    
    // caseTerritoryId: number;
    // caseTerritory: CaseTerritory = new CaseTerritory();
    // caseFileRequestDate: any;

    lawFirm: LawFirm = new LawFirm();
    lawFirmId: number;
    
    caseFillingStatus: any;
    caseFillingGenericStatus: any;
    // observations: Observation[] = [];
    status: string;

}