import { BaseModel } from "./base.model";
import { Currency } from "./currency";

export class Milestone extends BaseModel {

    milestoneTableId: number;
    milestoneId: number;
    customMilestone: string;
    milestoneName: string;
    milestoneCodeName: string;
    milestoneParentId: number;
    value: string;
    currency: Currency = new Currency();
    percentage: string;
    
}