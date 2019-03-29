import { BaseModel } from './base.model';
import { Branch } from './branch';
import { LoanProduct } from './loanProduct';
import { DefaulterDetail } from './defaulterDetail';
import { DefaulterFinance } from './defaulterFinance';
import { DefaulterCollateral } from './defaulterCollateral';
import { DefaulterCharge } from './defaulterCharge';
import { Director } from './director';
import { CIF } from './cif';
import { Currency } from './currency';
import { Country } from './country';
import { Region } from './region';
import { City } from './city';

export class DefaultAccount {

    id: number;
    DefaultAccountId: number;
    accountNumber: string;
    classificationType: string;
    classificationPercentage: string;
    contactPersonName: string;
    isSecured: boolean;
    director: Director[] = [];

    acknowledgementDate: string;
    accountOpeningDate: string;
    defaultDate: string;
    accountTransferDate: string;
    renewalDate: string;

    countryId: number;
    country: Country = new Country();

    regionId: number;
    region: Region = new Region();
    
    cityId: number;
    city: City = new City();

    branchId: number;
    branch: Branch = new Branch();

    loanProduct: LoanProduct = new LoanProduct();
    loanProductId: number;
    // defaulterDetail: DefaulterDetail[];
    defaulterBasicDetails: CIF = new CIF();
    defaulterCif: string;
    defaulterCifId: number;
    defaulterId: number;
    defaulterFinance: DefaulterFinance = new DefaulterFinance();

    // defaulterCollateral: DefaulterCollateral = new DefaulterCollateral();
    defaulterCollaterals: DefaulterCollateral[] = [];
    defaulterCharge: DefaulterCharge = new DefaulterCharge();

    negotiationAmount: string;
    recoveredAmount: string;
    remainingAmount: number;
    currency: Currency = new Currency();
    currencyId: number;
}
