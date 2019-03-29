import { BaseModel } from './base.model';
import { Document } from './document';

export class CourtComplianceSubmit {

    id: number;
    courtComplianceSubmitId: number;
    courtComplianceIssueId: number;
    descriptiveNote: string;
    submissionDate: string;
    documents: Document[] = [];

}
