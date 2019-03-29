import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../base/http.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { Injectable, Inject } from '@angular/core';

import { IAuthService } from '../auth/iauth.service';
import { FileService } from '../file/file.service';

import { User } from '../../models/user';
import { Token } from "../../models/token";
import { ExternalParty } from '../../models/externalParty';
import { Designation } from '../../models/designation';
import { Department } from '../../models/department';
import { Country } from '../../models/country';
import { Region } from '../../models/region';
import { City } from '../../models/city';
import { Branch } from '../../models/branch';
import { InternalUnion } from '../../models/internalUnion';
import { LawFirm } from '../../models/lawFirm';
import { Role } from '../../models/role';

@Injectable()
export class AdminService {

    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _http: HttpService,
        // private _lawFirmService: LawFirmService
        private _fileService: FileService,
    ) {
    }

    // --------- User
    // --------- User List Count
    public getUsersListCount(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'user/all/mini/count';
        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            }
            );
    }

    // --------- User Pagination
    public getUsersListPagination(pageNo, limit): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'user/all/mini/' + pageNo + '/' + limit;
        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            }
            );
    }

    // --------- User List
    public getUsersList(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'user/all/mini';
        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            }
            );
    }

    public getUserDetails(id): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'user/details/' + id;
        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            }
            );
    }

    createUser(user: User): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        let getUrl = (user.id && user.id != null && user.id != 0 ? 'user/update' : 'user/add');
        let body = {
            Id: user.id,
            SapId: user.sapId,
            UserEmail: user.email,
            UserPassword: user.password,
            ConfirmPassword: user.confirmPassword,
            FirstName: user.firstName,
            LastName: user.lastName,
            CountryId: user.countryId,
            RegionId: user.regionId,
            CityId: user.cityId,
            BranchId: user.branchId,
            DesignationId: user.designationId,
            DepartmentId: user.departmentId,

            Cnic: user.cnic,
            MobileNum: user.mobileNumber,
            PhoneNum: user.phoneNumber,

            UserRolePermission: [
                {
                    RoleId: user.userRolePermission.roleId,
                }
            ],
        }

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    public updateUser(user: User): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'user/update';
        let body = {

            Id: user.id,
            SapId: user.sapId,
            UserEmail: user.email,
            UserPassword: user.password,
            ConfirmPassword: user.confirmPassword,
            FirstName: user.firstName,
            LastName: user.lastName,
            CountryId: user.countryId,
            RegionId: user.regionId,
            CityId: user.cityId,
            BranchId: user.branchId,
            DesignationId: user.designationId,
            DepartmentId: user.departmentId,

            Cnic: user.cnic,
            MobileNum: user.mobileNumber,
            PhoneNum: user.phoneNumber,

            UserRolePermission: [
                {
                    RoleId: user.userRolePermission.roleId,
                }
            ],
        }

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    public mapUser(res: any): User {
        const userData = res;
        const isUser = new User();
        if (userData) {
            isUser.id = userData.id;
            isUser.sapId = userData.sapId;
            isUser.email = userData.userEmail;
            isUser.password = userData.userPassword;
            isUser.firstName = userData.firstName;
            isUser.lastName = userData.lastName;
            isUser.joiningDate = userData.joiningDate;

            isUser.cnic = userData.cnic;
            isUser.mobileNumber = userData.mobileNumber;
            isUser.phoneNumber = userData.phoneNumber;

            // isUser.designationId = userData.designationId;
            isUser.designation = userData.designation || new Designation();
            isUser.designationId = userData.designation ? userData.designation.id : null;

            // isUser.departmentId = userData.departmentId;
            isUser.department = userData.department || new Department();
            isUser.departmentId = userData.department ? userData.department.id : null;

            // isUser.countryId = userData.countryId;
            isUser.country = userData.country || new Country();
            isUser.countryId = userData.country ? userData.country.id : null;

            isUser.stateId = userData.stateId;
            // isUser.state = userData.state || new State();
            // isUser.stateId = userData.state ? userData.state.id : null;

            // isUser.regionId = userData.regionId;
            isUser.region = userData.region || new Region();
            isUser.regionId = userData.region ? userData.region.id : null;

            // isUser.cityId = userData.cityId;
            isUser.city = userData.city || new City();
            isUser.cityId = userData.city ? userData.city.id : null;

            // isUser.branchId = userData.branchId;
            isUser.branch = userData.branch || new Branch();
            isUser.branchId = userData.branch ? userData.branch.id : null;

            isUser.userRolePermission = userData.roles && userData.roles.length > 0 ? this.mapRole(userData.roles[0]) : new Role();
            // isUser.userRolePermission = userData.role && userData.role.length > 0 ? this.mapRole(userData.role[0]) : new Role();

            isUser.roles = userData.roles || [];
            // isUser.roles = userData.role || [];
            isUser.permissions = userData.permissions;

            isUser.lawFirms = [];
            if (userData.lawFirm && userData.lawFirm.length > 0) {
                userData.lawFirm.forEach(element => {
                    let u = new LawFirm();
                    // u = this._lawFirmService.mapLawFirm(element);
                    u = this.mapLawFirm(element);
                    isUser.lawFirms.push(u);
                });
            }

            isUser.isActive = userData.isActive;
            isUser.isBlocked = userData.isBlocked;
            isUser.lastLogin = userData.lastLogin;
            isUser.createdOn = userData.createdOn;
            isUser.createdBy = userData.createdBy;
            isUser.updatedOn = userData.updatedOn;
            isUser.updatedBy = userData.updatedBy;
            if (userData.flag === null) {
                const defaultFlag = {
                    flagCode: 'green',
                    flagDescription: 'none',
                    flagName: 'Green',
                    flagTooltip: 'none',
                    id: 2
                };
                isUser.flag = defaultFlag;
            } else {
                isUser.flag = userData.flag;
            }

            if (userData.profilePicture) {
                isUser.profilePicture = userData.profilePicture;
            }
            isUser.resume = this._fileService.mapDocument(userData.resume);
        }


        return isUser;
    }

    public mapLawFirm(res: any): LawFirm {
        // const userData = res.json().genericResponse.genericBody.data.userData;
        // const userData = res.json().genericBody.data.userData;

        // const userData = res.json();
        // const lawFirmData = res.json().length > 0 ? res.json()[0] : null;
        const lawFirmData = res ? res : null;
        const islawFirm = new LawFirm();
        if (lawFirmData) {

            islawFirm.id = lawFirmData.id;
            islawFirm.lawFirmId = lawFirmData.id;
            islawFirm.typeName = lawFirmData.lawFirmType;
            islawFirm.firmName = lawFirmData.lawFirmName;
            islawFirm.firmCode = lawFirmData.lawFirmCode;
            islawFirm.status = lawFirmData.status;

            // islawFirm.rating = null;
            // islawFirm.lawFirmRating = [];
            // if (lawFirmData.lawFirmRating && lawFirmData.lawFirmRating.length > 0) {
            //     islawFirm.rating = lawFirmData.lawFirmRating[lawFirmData.lawFirmRating.length - 1].id || null;
            //     lawFirmData.lawFirmRating.forEach(element => {
            //         islawFirm.lawFirmRating.push(this.mapLawFirmRating(element));
            //     });

            // }


            if (lawFirmData.flag === null) {
                const defaultFlag = {
                    flagCode: 'green',
                    flagDescription: 'none',
                    flagName: 'Green',
                    flagTooltip: 'none',
                    id: 2
                };
                islawFirm.flag = defaultFlag;
            } else {
                islawFirm.flag = lawFirmData.flag;
            }

            // islawFirm.countryId = lawFirmData.id;
            // islawFirm.region = lawFirmData.id;
            // islawFirm.regionId = lawFirmData.id;
            // islawFirm.city = lawFirmData.id;
            islawFirm.cityId = lawFirmData.cityId;
            islawFirm.postalAddress = lawFirmData.postalAddress;
            islawFirm.jurisdiction = lawFirmData.jurisdiction;
            islawFirm.barLicenseOrRegistrationNo = lawFirmData.barLicenseNumber;
            islawFirm.dateOfCommencement = lawFirmData.commencementDate;

            // islawFirm.expertise = lawFirmData.expertise;
            islawFirm.expertise = [];
            if (lawFirmData.expertise && lawFirmData.expertise.length > 0) {
                lawFirmData.expertise.forEach(element => {
                    let u = {
                        id: element.id,
                        name: element.expertise,
                        lawFirmId: element.lawFirmId,
                        selected: true
                    }
                    islawFirm.expertise.push(u);
                });
            }
            // islawFirm.reportedJudgments = lawFirmData.id;

            // islawFirm.blackListEvents = lawFirmData.lawFirmBlackListEvent;
            islawFirm.blackListEvents = [];
            if (lawFirmData.lawFirmBlackListEvent && lawFirmData.lawFirmBlackListEvent.length > 0) {
                lawFirmData.lawFirmBlackListEvent.forEach(element => {
                    let u = {
                        id: element.id,
                        event: element.eventDetail
                    }
                    islawFirm.blackListEvents.push(u);
                });
            }


            islawFirm.dateOfLicenseExpired = lawFirmData.licenseExpiredDate;
            islawFirm.website = lawFirmData.websiteUrl;
            islawFirm.email = lawFirmData.contactEmail;
            islawFirm.fax = lawFirmData.faxNumber;
            islawFirm.contactNumber = lawFirmData.contactNumber;
            islawFirm.yearlyRanking = lawFirmData.yearlyRanking;

            // islawFirm.resume = lawFirmData.id;

            // islawFirm.references = lawFirmData.reference;
            islawFirm.references = [];
            // if (lawFirmData.reference && lawFirmData.reference.length > 0) {
            //     lawFirmData.reference.forEach(element => {

            //         let docs = [];

            //         if (element.lawFirmReferenceDocument && element.lawFirmReferenceDocument.length > 0) {
            //             element.lawFirmReferenceDocument.forEach(element1 => {
            //                 docs.push(this._fileService.mapDocument(element1));
            //             });
            //         }

            //         let u = {
            //             id: element.id,
            //             name: element.referenceName,
            //             email: element.referenceEmail,
            //             address: element.postalAddress,
            //             documents: docs
            //         }
            //         islawFirm.references.push(u);
            //     });
            // }

            // islawFirm.managingPartner = lawFirmData.managingPartner;

            // islawFirm.file = lawFirmData.id;
            islawFirm.associatePartners = [];
            if (lawFirmData.associatePartner && lawFirmData.associatePartner.length > 0) {
                lawFirmData.associatePartner.forEach(element => {
                    let u = {
                        id: element.id,
                        name: element.partnerName,
                        email: element.partnerEmail,
                        address: element.partnerAddress,
                        mobileNumber: element.partnerMobileNumber,
                        // contactNumber: element.partnerPhoneNumber,
                        contactNumber: element.partnerMobileNumber
                    }
                    islawFirm.associatePartners.push(u);
                });
            }

            islawFirm.managingPartners = [];
            if (lawFirmData.managingPartner && lawFirmData.managingPartner.length > 0) {
                lawFirmData.managingPartner.forEach(element => {
                    let u = {
                        id: element.id,
                        name: element.partnerName,
                        email: element.partnerEmail,
                        address: element.partnerAddress,
                        mobileNumber: element.partnerMobileNumber,
                        // contactNumber: element.partnerPhoneNumber,
                        contactNumber: element.partnerMobileNumber
                    }
                    islawFirm.managingPartners.push(u);
                });
            }

            islawFirm.users = [];

            // if (lawFirmData.lawFirmLawyer && lawFirmData.lawFirmLawyer.length > 0) {
            //     lawFirmData.lawFirmLawyer.forEach(element => {
            //         // let u = this._adminService.mapUser(element.user);
            //         let u: User = new User();
            //         u = this._adminService.mapUser(element.user);
            //         u.resume = this._fileService.mapDocument(element.resume);
            //         islawFirm.users.push(u);
            //     });
            // }



        }

        return islawFirm;
    }

    public mapExternalParty(res: any): ExternalParty {
        const userData = res;
        const isUser = new ExternalParty();
        if (userData) {
            isUser.id = userData.id;
            // isUser.sapId = userData.sapId;
            isUser.email = userData.externalPartyEmail;
            // isUser.password = userData.userPassword;
            isUser.firstName = userData.firstName;
            isUser.lastName = userData.lastName;
            isUser.joiningDate = userData.joiningDate;
            isUser.leavingDate = userData.leavingDate;
            isUser.functionalTitle = userData.functionalTitle;
            isUser.companyName = userData.companyName;
            isUser.group = userData.group;

            isUser.cnic = userData.cnic;
            isUser.mobileNumber = userData.mobileNum;
            isUser.phoneNumber = userData.phoneNum;

            isUser.designation = userData.designation || new Designation();
            isUser.designationId = userData.designationId;
            isUser.departmentId = userData.department || new Department();
            isUser.departmentId = userData.departmentId;
            isUser.country = userData.country || new Country();
            isUser.countryId = userData.country ? userData.country.id || null : null;
            // isUser.stateId = userData.state || new State();
            isUser.stateId = userData.stateId;
            isUser.region = userData.region || new Region();
            isUser.regionId = userData.region ? userData.region.id || null : null;
            isUser.city = userData.city || new City();
            isUser.cityId = userData.city ? userData.city.id || null : null;
            isUser.branch = userData.branch || new Branch();
            isUser.branchId = userData.branch ? userData.branch.id || null : null;
            isUser.isActive = userData.isActive;
            isUser.isBlocked = userData.isBlocked;
            isUser.lastLogin = userData.lastLogin;
            isUser.createdOn = userData.createdOn;
            isUser.createdBy = userData.createdBy;
            isUser.updatedOn = userData.updatedOn;
            isUser.updatedBy = userData.updatedBy;
            if (userData.flag === null) {
                const defaultFlag = {
                    flagCode: 'green',
                    flagDescription: 'none',
                    flagName: 'Green',
                    flagTooltip: 'none',
                    id: 2
                };
                isUser.flag = defaultFlag;
            } else {
                isUser.flag = userData.flag;
            }
        }
        return isUser;
    }

    public mapInternalUnion(res: any): InternalUnion {
        const userData = res;
        const isUser = new InternalUnion();
        if (userData) {
            isUser.id = userData.id || null;
            isUser.sapId = userData.sapId || null;
            isUser.contactPersonEmail = userData.contactPersonEmail || null;
            isUser.email = userData.email || null;
            // isUser.password = userData.userPassword;
            isUser.contactPerson = userData.contactPerson || "";
            isUser.unionName = userData.unionName;
            isUser.firstName = userData.firstName;
            isUser.lastName = userData.lastName;
            isUser.joiningDate = userData.joiningDate;
            isUser.leavingDate = userData.leavingDate;
            isUser.functionalTitle = userData.functionalTitle;
            isUser.companyName = userData.companyName;
            isUser.group = userData.group;

            isUser.cnic = userData.cnic;
            isUser.mobileNumber = userData.mobileNum;
            isUser.phoneNumber = userData.phoneNum;

            isUser.websiteUrl = userData.websiteUrl;

            isUser.designation = userData.designation || new Designation();
            isUser.designationId = userData.designationId || null;

            isUser.department = userData.department || new Department();
            isUser.departmentId = userData.department ? userData.department.id : null;

            isUser.region = userData.region || new Region();
            isUser.regionId = userData.region ? userData.region.id || null : null;

            isUser.country = userData.country || new Country();
            isUser.countryId = userData.country ? userData.country.id || null : (userData.region ? userData.region.countryId : null);

            if (userData.region) {
                isUser.country = userData.country || new Country();
                isUser.country.id = userData.region.countryId || null;
                isUser.countryId = userData.region.countryId || null;
            }


            // isUser.stateId = userData.state || new State();
            isUser.stateId = userData.stateId;

            isUser.city = userData.city || new City();
            isUser.cityId = userData.city ? userData.city.id || null : null;

            isUser.branch = userData.branch || new Branch();
            isUser.branchId = userData.branch ? userData.branch.id || null : null;

            isUser.isActive = userData.isActive;
            isUser.isBlocked = userData.isBlocked;
            isUser.lastLogin = userData.lastLogin;
            isUser.createdOn = userData.createdOn;
            isUser.createdBy = userData.createdBy;
            isUser.updatedOn = userData.updatedOn;
            isUser.updatedBy = userData.updatedBy;
            if (userData.flag === null) {
                const defaultFlag = {
                    flagCode: 'green',
                    flagDescription: 'none',
                    flagName: 'Green',
                    flagTooltip: 'none',
                    id: 2
                };
                isUser.flag = defaultFlag;
            } else {
                isUser.flag = userData.flag;
            }
        }
        return isUser;
    }

    public mapRole(res: any): Role {
        const roleData = res;
        const isRole = new Role();
        if (roleData) {
            isRole.id = roleData.id || null;
            isRole.roleId = roleData.id || null;
            isRole.roleName = roleData.roleName || null;
            isRole.departmentId = roleData.departmentId || null;
        }


        return isRole;
    }

    public unBlockUser(id): Observable<any> {
        const getUrl = 'user/unblock/' + id;

        const body = {};

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.put(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public blockUser(id): Observable<any> {
        const getUrl = 'user/block/' + id;

        const body = {};

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.put(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public fetchDataFromFile(type): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        let getUrl = '';
        if (type == "npl") {
            getUrl = 'read/npl/file';
        }
        else if (type == "hr") {
            getUrl = 'read/hr/file';
        }
        let body = {
            // SapId: user.sapId,
        }

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    public getYear(): Observable<any> {
        const getUrl = 'year';
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getLitigatonFiledGraph(startDate, endDate): Observable<any> {
        const getUrl = 'dashboard/stats/case/basic/overall/via/range/' + startDate + '/' + endDate;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getLitigatonRecoveryGraph(year): Observable<any> {
        const getUrl = 'dashboard/stats/recovery/and/defaults/' + year;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getDisposalBreakdownGraph(year): Observable<any> {
        const getUrl = 'dashboard/stats/disposal/breakdown/' + year;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getCaseOverallGraph(year): Observable<any> {

        const getUrl = 'dashboard/stats/case/basic/overall/' + year;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getRecoveryDetailsGraph(year): Observable<any> {
        const getUrl = 'dashboard/stats/recovery/details/' + year;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getInternalLitigationIssueGraph(year, complainNatures): Observable<any> {

        let arr = [1, 2, 3, 4]
        let result = 'complaintNatureIDs=' + complainNatures[0] + complainNatures.slice(1).map(a => '&complaintNatureIDs=' + a).join('');
        const getUrl = 'dashboard/stats/internal/litigation/issue/' + year + '?' + result;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getGroupWiseSegregationGraph(): Observable<any> {
        const getUrl = 'dashboard/stats/group/wise/seggregation/';
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAgingByClassification(CaseClassificationId): Observable<any> {
        const getUrl = 'dashboard/stats/aging/' + CaseClassificationId;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getPresettlementDisposalBreakdown(presettlementDisposalYear): Observable<any> {
        const getUrl = 'dashboard/stats/disposal/breakdown/presettlement/decree/' + presettlementDisposalYear;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAvgTimeDecreeLawyerGraph(LawFirmId): Observable<any> {
        const getUrl = 'dashboard/stats/average/time/decree/' + LawFirmId;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAvgHearingTimeLawyerGraph(LawFirmId): Observable<any> {
        const getUrl = 'dashboard/stats/average/hearing/time/' + LawFirmId;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAmountReceivedLawyerGraph(LawFirmId, amounts): Observable<any> {
        const getUrl = 'dashboard/stats/amount/recovered';
        let token: Token;
        token = this._authService.getTokenData();
        const body = {
            lawFirmId: LawFirmId,
            amount: amounts
        };
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAvgAdjourmentLawyerGraph(LawFirmId): Observable<any> {
        const getUrl = 'dashboard/stats/no/adjournment/' + LawFirmId;
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getCaseAgainstUnionWiseGraph(year, UnionId): Observable<any> {
        const getUrl = 'dashboard/stats/union/case/against';
        let token: Token;
        token = this._authService.getTokenData();
        const body = {
            UnionId: UnionId,
            Year: year
        };
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getCaseByUnionWiseGraph(year, UnionId): Observable<any> {
        const getUrl = 'dashboard/stats/union/case/by';
        let token: Token;
        token = this._authService.getTokenData();
        const body = {
            UnionId: UnionId,
            Year: year
        };
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getRoleCodeUsers(roleCode): Observable<any> {
        // const getUrl = 'api/users/via/role/code/{RoleCode}';
        const getUrl = 'users/via/role/code/' + roleCode;

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            // .map(res => res.json())
            .map((res: Response) => res)
            .catch((error: any) =>
            // Observable.throw(error.json() || 'Server error')
            {
                return Observable.throw(error);
            }
            );
    }


}
