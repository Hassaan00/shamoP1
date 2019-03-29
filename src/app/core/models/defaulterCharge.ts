import { BaseModel } from './base.model';
import { Document } from './document';
import { ChargeType } from './chargeType';

export class DefaulterCharge {

    id: number;
    chargeType: ChargeType = new ChargeType();
    chargeDate: string;
    document: Document = new Document();
    documents: Document[] = [];
    defaulterAccountId: string;
    defaulterChargeDocument: any;

}
