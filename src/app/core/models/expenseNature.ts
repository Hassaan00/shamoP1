import { BaseModel } from "./base.model";

export class ExpenseNature extends BaseModel {

    
    id: number;
    expenseNatureId: number;
    expenseNature: string;
    expenseNatureCode: string;
    expenseNatureDescription: string;
    expenseNatureTooltip: string;

}