import { BaseModel } from './base.model';
import { Document } from './document';

export class DefaulterPersonalGuarantee {

    id: number;
    defaulterPersonalGuaranteeId: number;
    guarantor: string;
    guarantorAmount: string;
    netWorth: string;
    expiryDate: string;
    
}
