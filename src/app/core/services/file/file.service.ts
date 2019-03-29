import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy, Inject } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { User } from "../../models/user";
import { Case } from "../../models/case";
import { DefaultAccount } from "../../models/defaultAccount";
import { Observation } from "../../models/observation";
import { Token } from "../../models/token";
import { Milestone } from "../../models/milestone";
import { Document } from "../../models/document";
import { CaseDocument } from "../../models/caseDocument";
import { CaseDocumentBelongTo } from "../../models/caseDocumentBelongTo";

import { IAuthService } from '../auth/iauth.service';
import { AdminService } from '../admin/admin.service';

import { environment } from "../../../../environments/environment";

@Injectable()
export class FileService {
    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _http: HttpService,
        // private _adminService: AdminService
    ) { }

    protected mapUser(res: any): User {
        // const userData = res.json().genericResponse.genericBody.data.userData;
        // const userData = res.json().genericBody.data.userData;

        // const userData = res.json();
        // const userData = res.json().length > 0 ? res.json()[0] : null;
        const userData = res ? res : null;
        console.log("userData", userData);
        const isUser = new User();
        if (userData) {


            // isUser.fullName = userData.entity.entityName;
            isUser.id = userData.id;
            isUser.sapId = userData.sapId;
            isUser.email = userData.userEmail;
            isUser.password = userData.userPassword;
            isUser.firstName = userData.firstName;
            isUser.lastName = userData.lastName;

            isUser.cnic = userData.cnic;
            isUser.mobileNumber = userData.mobileNum;
            isUser.phoneNumber = userData.phoneNum;

            isUser.designationId = userData.designationId;
            isUser.departmentId = userData.departmentId;
            // isUser.roleId =  userData.roleId;
            isUser.countryId = userData.countryId;
            isUser.stateId = userData.stateId;
            isUser.regionId = userData.regionId;
            isUser.cityId = userData.cityId;
            isUser.branchId = userData.branchId;

            // isUser.accountVerified = userData.isActive;
            isUser.isActive = userData.isActive;
            isUser.isBlocked = userData.isBlocked;
            isUser.lastLogin = userData.lastLogin;
            isUser.createdOn = userData.createdOn;
            isUser.createdBy = userData.createdBy;
            isUser.updatedOn = userData.updatedOn;
            isUser.updatedBy = userData.updatedBy;

            // isUser.entityType = userData.entity.entityType;
            // isUser.entityId = userData.entity.id;
            // isUser.entityName = userData.entity.entityName;

            // isUser.token = userData.token.token;

            // isUser.permissions = userData.userRole.permissions;
            // isUser.overAllUnreadStatus = userData.entity.overAllUnreadStatus;
            // isUser.profilePic = userData.entity.profilePic;
            // isUser.coverPic = userData.entity.coverPic;;

            // let expiryTime = new Date(Date.now());
            // expiryTime.setSeconds(expiryTime.getSeconds() + userData.token.expiry);
            // isUser.expiry = Date.now() + (userData.token.expiry * 1000);
        }

        return isUser;
    }

    public mapCaseDocument(res: any): CaseDocument {
        // const userData = res.json().genericResponse.genericBody.data.userData;
        // const userData = res.json().genericBody.data.userData;

        // const userData = res.json();
        // const caseData = res.json().length > 0 ? res.json()[0] : null;
        const documentData = res ? res : null;
        let isDocument = new CaseDocument();
        if (documentData) {
            isDocument.caseDocumentId = documentData.caseDocumentId || null;
            isDocument.caseDocumentBelongTo = documentData.caseDocumentBelongTo || new CaseDocumentBelongTo();
            isDocument.documentName = documentData.documentName || "";
            isDocument.documentExtension = documentData.documentExtension || "";
            isDocument.documentUrl = documentData.documentUrl || "";
            // isDocument.documentType = documentData.observationBelongTo.belongTo || "";
            isDocument.documentType = documentData.documentType || "";
            isDocument.documentTypeId = documentData.documentTypeId || null;
            isDocument.documentUploadId = documentData.documentUploadId || "";
            const dob = [];
            if (documentData.caseDocumentObservation && documentData.caseDocumentObservation.length > 0) {
                documentData.caseDocumentObservation.forEach(element => {
                    dob.push(this.mapObservation(element));
                });

            }
            isDocument.observations = dob;
            // isObservation.user = this.mapUser(documentData.user);
            // isObservation.user = this.mapCaseDocumentObservation(documentData.caseDocumentObservation);
        }

        return isDocument;
    }

    public mapDocument(res: any): Document {
        // const userData = res.json().genericResponse.genericBody.data.userData;
        // const userData = res.json().genericBody.data.userData;

        // const userData = res.json();
        // const caseData = res.json().length > 0 ? res.json()[0] : null;
        const documentData = res ? res : null;
        let isDocument = new Document();
        if (documentData) {
            isDocument.documentId = documentData.documentUploadedId || null;
            isDocument.documentOriginalName = documentData.documentOriginalName || "";
            isDocument.documentName = documentData.documentName || "";
            isDocument.documentExtension = documentData.documentExtension || "";
            isDocument.documentUrl = documentData.documentUrl || "";
            // isDocument.documentType = documentData.observationBelongTo.belongTo || "";
            isDocument.documentType = documentData.documentType || "";
            isDocument.documentTypeId = documentData.documentTypeId || null;
            isDocument.documentUploadId = documentData.documentUploadId || "";
            const dob = [];
            // if (documentData.caseDocumentObservation && documentData.caseDocumentObservation.length > 0) {
            //     documentData.caseDocumentObservation.forEach(element => {
            //         dob.push(this.mapObservation(element));
            //     });

            // }
            isDocument.observations = dob;
        }

        return isDocument;
    }

    public mapObservation(res: any): Observation {
        // const userData = res.json().genericResponse.genericBody.data.userData;
        // const userData = res.json().genericBody.data.userData;

        // const userData = res.json();
        // const caseData = res.json().length > 0 ? res.json()[0] : null;
        const observationData = res ? res : null;
        const isObservation = new Observation();
        if (observationData) {
            isObservation.id = observationData.id || null;
            isObservation.caseBasicId = observationData.caseBasicId || 0;
            isObservation.detailObservation = observationData.detailObservation || "";
            isObservation.observationBelongTo = observationData.observationBelongTo ? observationData.observationBelongTo.belongTo || "" : null;
            isObservation.isVerified = observationData.isVerified || null;
            // isObservation.user = this.mapUser(observationData.user);
            isObservation.user = this.mapUser(observationData.user);
        }

        return isObservation;
    }

    // --------- case file save
    // public saveFile(caseData, documentTypeId, file): Observable<any> {
    public saveFile(caseBasicId, documentTypeId, file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/case/doc';
        let body: FormData = new FormData();
        body.append('CaseBasicId', caseBasicId);
        body.append('DocumentTypeId', documentTypeId);
        body.append('File', file, file.name);
        // let body = {
        //     CaseBasicId: caseBasicId || 0, //for insert or update 
        //     DocumentTypeId: documentTypeId || 0,
        //     File: file || null,
        // }

        // return this._http.post(getUrl, body, options)
        //     .map((res: Response) => res)
        //     .catch((err, caught) => {
        //         return Observable.throw(err);
        //     })
        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- case file remove
    public removeFile(caseBasicId, documentUploadId): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'remove/case/document/' + caseBasicId + '/' + documentUploadId;
        let body = {}

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- resume save
    public saveResume(file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/lawfirm/lawyer/resume';
        let body: FormData = new FormData();
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- lawfirm resume save
    public saveLawFirmResume(file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/lawfirm/resume/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- reference file save
    public saveReference(file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/lawfirm/reference/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- payment file save
    public savePaymentDoc(caseBasicId, file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/case/expense/doc';
        let body: FormData = new FormData();
        body.append('CaseBasicId', caseBasicId);
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- proceeding file save
    public saveProceedingDoc(caseBasicId, file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/case/proceeding/doc';
        let body: FormData = new FormData();
        body.append('CaseBasicId', caseBasicId);
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- case filing file save
    public saveCaseFilingDoc(caseBasicId, file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/case/file/doc';
        let body: FormData = new FormData();
        body.append('CaseBasicId', caseBasicId);
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }
    // --------- plaint file save
    public savePlaintDoc(caseBasicId, file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/case/plaint/doc';
        let body: FormData = new FormData();
        body.append('CaseBasicId', caseBasicId);
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- Post File Settlement file save
    public savePostFileSettlementUpload(caseBasicId, file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/post/settlement/doc';
        let body: FormData = new FormData();
        body.append('CaseBasicId', caseBasicId);
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- Pre File Settlement file save
    public savePreFileSettlementUpload(file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/pre/settlement/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- Defaulter Collateral file save
    public saveDefaulterCollateralDoc(file, defaulterId): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        let getUrl = 'upload/defaulter/collateral/doc';
        let body: FormData = new FormData();
        body.append('DefaulterId', defaulterId);
        body.append('File', file, file.name);
        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    // --------- Defaulter Charge file save
    public saveDefaulterChargeDoc(file, defaulterId): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/defaulter/charge/type/doc';
        let body: FormData = new FormData();
        body.append('DefaulterId', defaulterId);
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }


    // --------- Bail Document save
    public saveBailDocs(file, CaseCourtId): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        let getUrl = 'upload/bail/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);
        body.append('CaseCourtId', CaseCourtId);
        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }


    // --------- Fir Document save
    public saveFirDocs(file, CaseBasicId): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        let getUrl = 'upload/fir/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);
        body.append('CaseBasicId', CaseBasicId);
        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    // --------- NPL File save
    public uploadNplFile(file): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        options.headers.append('Accept', 'application/json');
        let getUrl = 'upload/npl/data/file';
        let body: FormData = new FormData();
        body.append('File', file, file.name);
        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    // --------- HR File save
    public uploadHrFile(file): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        options.headers.append('Accept', 'application/json');
        let getUrl = 'upload/hr/data/file';
        let body: FormData = new FormData();
        body.append('File', file, file.name);
        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    // --------- Profile Picture Upload
    public uploadProfilePic(file, userId): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        options.headers.append('Accept', 'application/json');
        let getUrl = 'upload/user/profile/picture';
        let body: FormData = new FormData();
        body.append('File', file, file.name);
        body.append('UserId', userId);
        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    // --------- Bail Document save
    public saveContractDocs(file): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        let getUrl = 'upload/contract/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);
        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    // --------- advisory file save
    public saveAdvisoryDocs(file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/advisory/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- advice file save
    public saveAdviceDocs(file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/advisory/service/advice/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    // --------- advisory discussion file save
    public saveAdvisoryDiscussionDocs(file): Observable<any> {
        console.log("file", file);
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);
        // options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        // options.headers.append('Content-Type', 'application/json');

        let getUrl = 'upload/advisory/discussion/doc';
        let body: FormData = new FormData();
        body.append('File', file, file.name);

        return this._http.postWithFile(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }
}
