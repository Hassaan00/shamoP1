import { BaseModel } from './base.model';
import { LawFirm } from './lawFirm';
import { LawFirmType } from './lawFirmType';
import { Currency } from './currency';
import { User } from './user';
import { PaymentTerm } from './paymentTerm';
import { Milestone } from './milestone';

export class LawyerRecommend {

    id: number;
    lawFirmTableId: number;
    lawFirmId: number;
    lawFirmName: number;
    lawFirm: LawFirm = new LawFirm();
    lawFirmTypeId: number;
    lawFirmType: LawFirmType = new LawFirmType();
    feeRangeTo: string;
    feeRangeFrom: string;
    currencyId: number;
    currency: Currency = new Currency();
    totalFee: string;
    advanceFee: string;
    paymentTerm: PaymentTerm = new PaymentTerm();
    milestoneList: Milestone[] = [];
    milestone: Milestone = new Milestone();
    paymentDetails: Milestone[] = [];
    user: User = new User();
    genericStatus: any;
    isSelected: boolean;
    // recommendationAction: RecommendAction = new RecommendAction();
    recommendationAction: RecommendAction[] = [];
}

export class RecommendAction {

    genericStatus: any;
    user: User = new User();

}