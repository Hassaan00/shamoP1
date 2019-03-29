import { ExternalEmployee } from "./employee";
import { Document } from "./document";
import { Tag } from "./tag";
import { Currency } from "./currency";

export class ContractType {
    id: number;
    contractTypeName: string;
    contractTypeCode: string;
}

export class Contract {
    id: number;
    contractId: number;
    contractTitle: string;

    contractTypeId: number;
    contractType: ContractType = new ContractType();

    contractDescription: string;

    contractRenewalIntimation: number;
    contractRenewalPricePercentage: number;

    externalPartyId: number;
    externalParty: ExternalEmployee;

    contractStartDate: string;
    contractExpiryDate: string;
    contractExpired: boolean;

    contractPrice: string;
    currencyId: number;
    currency: Currency = new Currency();

    isContractTerminated: boolean = false;

    contractTerminationDate: string;
    contractTerminationReason: string;

    contractTagIds: number[] = [];
    contractTags: Tag[] = [];


    contractDocument: Document[] = [];
    contractDocuments: Document[] = [];
    contractDocs: any[] = [];

    isClubbedContract: boolean = false;
    clubbedContract: Contract[] = [];

    contractInformationHistory: Contract[] = [];

    isTerminateDisabled: boolean = false;
}



