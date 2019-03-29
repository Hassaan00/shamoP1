import { BaseModel } from "./base.model";
import { Case } from './case';
import { Observation } from './observation';
import { CaseDocument } from './caseDocument';
import { LawFirm } from './lawFirm';

export class CasePlaint extends BaseModel {

    casePlaintId: number;
    case: Case = new Case();
    caseBasicId: number;
    lawFirm: LawFirm = new LawFirm();
    lawFirmLawyerId: number;
    documents: CaseDocument[] = [];
    // caseTerritoryId: number;
    // caseTerritory: CaseTerritory = new CaseTerritory();
    // caseFileRequestDate: any;

    casePlaintDescription: string = null;
    casePlaintStatus: any;
    casePlaintGenericStatus: any;
    observations: Observation[] = [];
    status: string;

}