import { BaseModel } from './base.model';
import { DefaultAccount } from './defaultAccount';

export class DefaulterInfo {

    id: number;
    relationshipDate: string;
    cifId: number;
    cif: string;
    defaulterName: string;
    entityType: string;
    defaulterAccountDetails: DefaultAccount[] = [];

}
