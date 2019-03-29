import { BaseModel } from './base.model';

export class CaseResultOption {

    id: number = null;
    caseResultOptionId: number = null;
    caseResultOption: string = null;
    caseResultOptionCode: string = null;
    selected: boolean;
    sortOder: number;
    isActive: boolean;
    value: string;

}
