import { BaseModel } from './base.model';

export class CaseDocumentBelongTo {

    id: number;
    documentBelongToId: number;
    documentBelongTo: string;
    selected: boolean;
    documentBelongToCode: string;
    documentBelongToDescription: string;
    documentBelongToTooltip: string;
    value: string;
    sortOrder: number;

}
