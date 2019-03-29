import { BaseModel } from './base.model';
import { Case } from "./case";
import { CaseProceeding } from "./caseProceeding";
import { CaseResultOption } from "./caseResultOption";
import { CaseResultActionOption } from "./caseResultActionOption";
import { Rating } from './rating';
// import { User } from "./user";
// import { Document } from "./document";

export class CourtDecision {

    id: number;
    courtDecisionId: number;
    caseBasic: Case = new Case();
    caseBasicId: number;
    caseProceeding: CaseProceeding = new CaseProceeding();
    caseProceedingId: number;

    caseResultOption: CaseResultOption = new CaseResultOption();
    caseResultOptionId: number;

    caseResultActionOption: CaseResultActionOption = new CaseResultActionOption();
    caseResultActionOptionId: number;

    lawFirmRating: Rating = new Rating();
    lawFirmRatingId: number;

    // documents: Document[] = [];

    // user: User;


}
