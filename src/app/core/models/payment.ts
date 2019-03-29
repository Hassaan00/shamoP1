import { BaseModel } from "./base.model";
import { Currency } from './currency';
import { Case } from './case';
import { ExpenseNature } from './expenseNature';
import { Document } from './document';
import { LawFirm } from './lawFirm';
import { LawyerRecommend } from './lawyerRecommend';
import { Milestone } from './milestone';
import { CaseCourt } from './caseCourt';
// import { Court } from './court';

export class Payment extends BaseModel {


    id: number;
    paymentId: number;
    caseBasic: Case = new Case();
    caseBasicId: number;
    expenseAmount: string;
    expenseDescription: string;
    expenseNatureId: number;

    auctionScheduleId: number;
    lawFirm: LawFirm = new LawFirm();
    lawFirmId: number;
    lawyerRecommend: LawyerRecommend = new LawyerRecommend();
    paymentDetail: Milestone = new Milestone();
    caseRecommendLawFirmPaymentTermDetailId: number;

    caseCourt: CaseCourt = new CaseCourt();
    caseCourtId: number;
    courtId: number;

    payOrder: string;
    // dispatchDate: string;
    payOrderDispatchDate: string;
    // dateOfPayOrder: string;
    payOrderDate: string;
    
    currencyId: number;
    currency: Currency = new Currency();
    genericStatusId: any;
    genericStatus: any;
    documents: Document[] = [];
    // "genericStatus": {
    //     "id": 6,
    //     "statusType": "APPROVED",
    //     "isActive": false
    // },
    expenseNature: ExpenseNature = new ExpenseNature();

    isApproveDisabled: boolean = false;
    isDisapproveDisabled: boolean = false;

}