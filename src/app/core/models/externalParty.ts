import { BaseModel } from './base.model';

import { Role } from './role';
import { Permission } from './permission';
import { Document } from './document';
import { Flag } from './flag';
import { Department } from './department';
import { Designation } from './designation';
import { Country } from './country';
import { Region } from './region';
import { City } from './city';
import { Branch } from './branch';

export class ExternalParty extends BaseModel {

    externalPartyId: number;
    // sapId: string;
    firstName: string;
    lastName: string;
    joiningDate: string;
    leavingDate: string;
    functionalTitle: string;
    location: string;
    companyName: string;
    group: string;
    // password: any;
    // confirmPassword: any;
    email: string;
    flag: Flag;

    fullName: string;
    mobileNumber: String;
    phoneNumber: String;
    cnic: String;

    credentials: String;
    title: String;
    country: Country = new Country();
    // countryName: string;
    countryId: number;
    region: Region = new Region();
    // regionName: string;
    regionId: number;
    state: string;
    stateId: number;
    city: City = new City();
    cityId: number;
    branch: Branch = new Branch();
    branchId: number;
    userStatus: string;
    zipCode: string;
    terms: string;
    token: string;
    expiry: number;
    entityType: string;
    entityName: string;
    entityId: number;
    profilePicture: any;
    accountVerified: boolean;
    designationId: number;
    designation: Designation = new Designation();
    designationName: string;
    departmentId: number;
    department: Department = new Department();
    departmentName: string;
    userRole: string;
    roles: Role[] = [];
    permissions: Permission[];
    userRolePermission: Role = new Role();
    resume: Document = new Document();

    // roleId: number;
    // roleName: string;

    lastLogin: string;
    stateName: string;

    // createdOn: string;
    // createdBy: string;
    // updatedOn: string;
    // updatedBy: string;
    gender: string;

    utcDSTOffset: number;
    // employer: string;
    // address: string;
    // state: string;
    // secretQuestion1: string;
    // secretQuestion2: string;
    // secretAnswer1: string;
    // secretAnswer2: string;
    // webUrl: string;
    unsuccessfulAttempt: string;
    isActive: boolean;
    isBlocked: boolean;
    isLoggedIn: boolean;
}
