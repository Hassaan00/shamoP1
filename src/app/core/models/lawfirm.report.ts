import { Expertise } from "./expertise";
import { ManagingPartner } from "./partner";
import { Event } from './event';

export class FirmReport {

    id: number;
    lawFirmName: string;
    lawFirmCode: string;
    postalAddress: string;
    contactEmail: string;
    faxNumber: string;
    contactNumber: String;
    lawFirmType: string;
    expertise: Expertise[] = [];
    managingPartner: any;
    managingPartners: ManagingPartner[] = [];
    lawFirmBlackListEvent: any;
    blackListEvents: Event[] = [];
    averageTimeToDecree: string;
    noOfFavorableOutCome: string;
    favorableVsUnFavorableValue: string;
    favorableVsUnFavorablePercentage: string;
    noOfCasesAssignedInLastTwoYears: string;
    totalNoOfCasesAssigned: string;
    noOfCasesDisposedInLastTwoYears: string;
    totalNoOfCasesDisposed: string;

    courtWiseCases: any;




    noOfUnfavorableOutCome: any;
    percentileOfDecree: any;

    regionWiseCases: any;


}

export class FirmRegionWiseReport {

    regionName: string;
    caseCount: number;

}

export class FirmCourtWiseReport {

    courtName: string;
    caseCount: number;

}

export class FirmDecreePercentileReport {

    lawFirmId: number;
    lawFirmName: string;
    averageTimeToDecree: string;
    lawFirmType: string;

}