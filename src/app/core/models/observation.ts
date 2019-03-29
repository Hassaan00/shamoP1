import { BaseModel } from './base.model';
import { User } from './user';
import { CaseDocumentType } from './caseDocumentType';

export class Observation extends BaseModel {

    id: number;
    caseBasicId: number;
    casePlaintId: number;
    advisoryServiceId: number;
    advisoryServiceAdviceId: number;
    detailObservation: string;
    observationBelongTo: string;
    isVerified: boolean = null;
    user: User = new User();

}

export class DocumentObservation extends BaseModel {

    id: number;
    caseBasicId: number;
    casePlaintId: number;
    advisoryServiceId: number;
    advisoryServiceAdviceId: number;
    detailObservation: string;
    observationBelongTo: string;
    documentType: CaseDocumentType = new CaseDocumentType();
    documentTypeId: number;
    isVerified: boolean = null;
    user: User = new User();

}

// Obsevation Belongs To Code values

// case_basic_details
// case_attorney_details
// case_lawfirm_details
// case_document_details
// case_defaulter_basic_details
// case_defaulter_account_details
// case_defaulter_finanace_details
// case_defaulter_collateral_details
// case_defaulter_charge_details
// case_defaulter_valuation_details
// case_final_comment_details