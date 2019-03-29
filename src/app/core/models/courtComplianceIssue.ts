import { BaseModel } from './base.model';
import { ComplianceResponsibility } from './complianceResponsibility';
import { ComplianceNature } from './complianceNature';
import { CourtComplianceSubmit } from './courtComplianceSubmit';
import { User } from './user';

export class CourtComplianceIssue {

    id: number;
    courtComplianceIssueId: number;
    complianceTitle: string;
    dueDate: string;
    complianceResponsibilityOption: ComplianceResponsibility = new ComplianceResponsibility();
    complianceResponsibilityOptionId: number;

    singleCaseStakeHolder: User = new User();
    singleCaseStakeHolderId: number;

    multipleCaseStakeHolder: User[] = [];
    multipleCaseStakeHolderId: number[] = [];

    complianceNatureOption: ComplianceNature = new ComplianceNature();
    complianceNatureOptionId: number;
    descriptiveNote: string;
    isDNPartOne: boolean;
    courtComplianceSubmit: CourtComplianceSubmit = new CourtComplianceSubmit();
    courtComplainceIssueGenericStatus: any;

}
