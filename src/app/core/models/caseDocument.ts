import { BaseModel } from './base.model';
import { CaseDocumentBelongTo } from './caseDocumentBelongTo';
import { CaseDocumentType } from './caseDocumentType';
import { Observation } from './observation';

export class CaseDocument {

    id: number;
    caseDocumentId: number;
    caseDocumentBelongTo: CaseDocumentBelongTo = new CaseDocumentBelongTo();
    documentName: string;
    documentOriginalName: string;
    documentExtension: string;
    documentUrl: string;
    // documentType: CaseDocumentType = new CaseDocumentType();
    documentType: string;
    documentTypeId: number;
    selected: boolean;
    documentCode: string;
    documentDescription: string;
    documentTooltip: string;
    documentUploadId: string;
    observations: Observation[] = [];
    genericStatus: any;
    docAction: any;
    isActive: boolean;
    isProcessing: boolean = false;
    value: string;

}
