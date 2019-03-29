import { BaseModel } from './base.model';

export class ComplianceNature {

    id: number;
    complianceNatureId: number;
    complianceNatureOption: string;
    complianceNatureOptionCode: string;
    complianceNatureOptionDescription: string;
    complianceNatureOptionTooltip: string;
    sortOrder: number;
    value: string;

}
