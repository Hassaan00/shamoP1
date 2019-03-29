import { BaseModel } from './base.model';
import { DefaultAccount } from './defaultAccount';
import { DefaulterDetail } from './defaulterDetail';
import { DefaulterFinance } from './defaulterFinance';

export class CIF {

    id: number;
    defaulterCifId: number;
    contactPerson: string;
    defaulterCif: string;
    defaulterCifCode: string;
    defaulterName: string;
    defaulterCifDescription: string;
    defaulterCifTooltip: string;
    defaulterCnic: string;
    defaulterEcib: string;
    defaulterLocation: string;
    defaulterLocationTwo: string;
    defaulterLocationThree: string;
    defaulterNtn: string;
    defaulterSector: string;
    defaulterType: string;
    selected: boolean;
    value: string;
    
    defaulterAccountDetails = new Array<DefaultAccount>();
    defaulterDetail: DefaulterDetail[];

}
