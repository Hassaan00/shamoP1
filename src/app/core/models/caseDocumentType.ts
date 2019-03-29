import { BaseModel } from './base.model';
import { CaseDocumentBelongTo } from './caseDocumentBelongTo';

export class CaseDocumentType {

    id: number;
    documentTypeId: number;
    documentTypeBelongTo: number;
    documentBelongTo: CaseDocumentBelongTo;
    documentType: string;
    selected: boolean;
    documentTypeCode: string;
    documentTypeDescription: string;
    documentTypeTooltip: string;
    value: string;

}