import { Flag } from "./flag";
import { Country } from "./country";
import { Region } from "./region";
import { City } from "./city";
import { Branch } from "./branch";
import { Document } from './document';

export class Judge {
    id: number;
    JudgeId: number;
    firstName: string;
    lastName: string;
    locationAddress: string;
    contactEmail: string;
    contactNumber: string;
    mobileNumber: string;
    portfolioDescription: string;
    cnic: string;

    country: Country = new Country();
    countryId: number;

    // state: State = new State();
    // state: string;
    stateId: number;

    region: Region = new Region();
    regionId: number;

    city: City = new City();
    cityId: number;

    branch: Branch = new Branch();
    branchId: number;

    flag: Flag;


    profilePicture: Document = new Document();
    resume: Document = new Document();
}
