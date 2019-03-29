import { BaseModel } from './base.model';
import { LawFirm } from './lawFirm';
import { User } from './user';
import { Court } from './court';
import { CaseDocument } from './caseDocument';
import { Case } from './case';

export class CaseCourt {

    id: number;
    caseCourtId: number;
    suitNumber: string;
    // suitNo: string = null;
    caseFileDate: string;
    firstHearingDate: string; 
    // caseHearingData: any = null;
    // lawFirmLawyerId: number;

    // lawFirm: LawFirm = new LawFirm();
    // lawFirmId: number;

    user: User = new User();
    court: Court = new Court();
    courtId: number;
    selected: boolean;
    value: string;

    caseBasic: any;
    // case: Case = new Case();
    // caseBasicId: number;

    // judges: User[] = [];
    // judgeIds: number[] = [];

    caseCourtDescription: string = null;

    // documents: CaseDocument[] = [];
    
    caseCourtStatus: any;
    caseCourtGenericStatus: any;
    // observations: Observation[] = [];
    status: string;

}
