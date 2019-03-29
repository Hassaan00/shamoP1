import { BaseModel } from "./base.model";
import { Event } from './event';
import { Reference } from './reference';
import { AssociatePartner, ManagingPartner } from './partner';
import { Expertise } from './expertise';
import { User } from './user';
import { Flag } from "./flag";
import { Rating } from "./rating";
import { Country } from "./country";
import { Region } from "./region";
import { City } from "./city";
import { Document } from './document';

export class LawFirm extends BaseModel {

    lawFirmId: number;
    typeName: string;
    firmName: string;
    firmCode: string;

    country: Country = new Country();
    // countryName: string;
    countryId: number;

    // state: State = new State();
    // state: string;
    stateId: number;

    region: Region = new Region();
    // region: string;
    regionId: number;

    city: City = new City();
    // city: string;
    cityId: number;

    postalAddress: string;
    jurisdiction: string;
    barLicenseOrRegistrationNo: string;
    dateOfCommencement: string;
    expertise: Expertise[] = [];
    reportedJudgments: string;

    dateOfLicenseExpired: string;
    website: string;
    email: string;
    fax: string;
    contactNumber: String;
    contactNumberTwo: String;
    contactNumberThree: String;
    yearlyRanking: String = "0";

    // resume: any;
    resume: Document = new Document();

    flag: Flag;
    blackListEvents: Event[] = [];
    references: Reference[] = [];
    // managingPartner: string;
    managingPartners: ManagingPartner[] = [];

    associatePartners: AssociatePartner[] = [];
    rating: any;
    lawFirmRating: LawFirmRating[] = [];

    documents: Document[] = [];
    file: any;

    status: string;

    users: User[] = [];

    isActive: boolean = false;
    isActiveReason: string;

    isDelist: boolean = false;
    isDelistReason: string;


    isApproveDisabled: boolean = false;
    isDisapproveDisabled: boolean = false;

    isAddFlagDisabled: boolean = false;
    isRemoveFlagDisabled: boolean = false;

    isRatingDisabled: boolean = false;

    isActiveDisabled: boolean = false;
    isInActiveDisabled: boolean = false;

    isInListDisabled: boolean = false;
    isDeListDisabled: boolean = false;

}

export class ApprovedLawFirm {
    id: number;
    lawFirmCode: string;
    lawFirmName: string;
}

export class LawFirmRating {
    id: number;
    lawFirmRatingId: number;
    rating: Rating = new Rating();
}