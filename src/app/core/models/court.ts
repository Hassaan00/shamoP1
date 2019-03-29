import { Flag } from './flag';
import { Country } from './country';
import { Region } from './region';
import { City } from './city';
import { Branch } from './branch';

export class Court {

    id: number;
    courtId: number;
    courtName: string;
    locationAddress: string;
    selected: boolean;
    contactNumber: string;
    contactPerson: string;

    suitNumberFormat: string;


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


    value: string;
    flag: Flag;
    judge: any;

    isDeleteDisabled: boolean = false;

    isAddFlagDisabled: boolean = false;
    isRemoveFlagDisabled: boolean = false;
}


export class SelectJudge {
    _id: number;
    _name: string;
}
