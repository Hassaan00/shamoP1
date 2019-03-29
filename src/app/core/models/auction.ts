import { Currency } from "./currency";
import { Court } from "./court";
import { CaseCourt } from "./caseCourt";
import { Case } from "./case";
import { CaseFilling } from "./caseFilling";

export class AuctionSchedule {
    id: number;
    auctionScheduleId: number;
    auctionSystemNumber: string;
    auctionDate: string;
    auctionDescription: string;
    auctionFee: string;
    currency: Currency = new Currency();
    currencyId: number;
    locationAddress: string;
    // caseCourt: CaseCourt = new CaseCourt();
    caseCourt: CaseFilling = new CaseFilling();
    caseCourtId: number;

    case: Case = new Case();
    caseId: number;


    isSuccessful: boolean = true;
    isRescheduled: boolean = false;
    auctionFailedReason: string;

    // auctionHeld: AuctionHeld = new AuctionHeld();

    genericStatus: any;
}


export class AuctionHeld {
    id: number;
    auctionHeldId: number;

    auctionSchedule: AuctionSchedule = new AuctionSchedule();
    auctionScheduleId: number;
    auctionSystemNumber: string;

    auctionHeldDate: string;
    noOfBidder: number;

    // auctionBidder = new Array<Bidder>();
    auctionBidder: Bidder[] = [];
    genericStatus: any;
}

export class Bidder {
    id: number;
    bidderId: number;
    bidderName: string = '';
    bidderContactNumber: string = '';
    bidAmount: number = 0;
    bid: number = 0;
    currency: Currency = new Currency();
    currencyId: number;
    bidderCnic: string = '';
    bidderNtn: string = '';
    isFullAmountReceived: boolean;
    payment: any;
    paymentTerm: any;
    remainingAmount: number = 0;
    isSelect: boolean;

    genericStatus: any;
}

export class PaymentDepositOptions {
    id: number;
    paymentDepositeIn: number;
    paymentDepositeInCode: string;
    paymentDepositeInDescription: string;
    paymentDepositeInTooltip: string;
}


export class BidderFirstPayment {
    AuctionBidderId: number;
    Amount: number;
    PaymentDate: string;
    InstrumentNumber: string;
    CurrencyId: number;
    PaymentDepositInId: number;
}

export class BidderPaymentTerm {
    AmountPercentage: number;
    PaymentDate: string;
    CurrencyId: number;
    Amount: number;

}

