import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy, Inject } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { User } from "../../models/user";
import { Payment } from "../../models/payment";
import { Currency } from "../../models/currency";
import { Token } from "../../models/token";
import { ExpenseNature } from "../../models/expenseNature";
import { Case } from "../../models/case";
import { CaseCourt } from "../../models/caseCourt";
import { LawFirm } from "../../models/lawFirm";
import { Milestone } from "../../models/milestone";

import { IAuthService } from '../auth/iauth.service';
import { AdminService } from '../admin/admin.service';
import { FileService } from '../file/file.service';

import { environment } from "../../../../environments/environment";

@Injectable()
export class PaymentService {
    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _http: HttpService,
        private _adminService: AdminService,
        private _fileService: FileService,
    ) { }

    protected mapUser(res: any): User {
        // const userData = res.json().genericResponse.genericBody.data.userData;
        // const userData = res.json().genericBody.data.userData;

        // const userData = res.json();
        const userData = res.json().length > 0 ? res.json()[0] : null;
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

    public mapPayment(res: any): Payment {
        const paymentData = res ? res : null;
        const isPayment = new Payment();
        if (paymentData) {

            isPayment.id = paymentData.id;
            isPayment.paymentId = paymentData.id;
            isPayment.caseBasicId = paymentData.caseBasic ? paymentData.caseBasic.id : null;
            isPayment.expenseAmount = paymentData.expenseAmount;
            isPayment.expenseDescription = paymentData.expenseDescription;
            isPayment.expenseNature = paymentData.expenseNature ? paymentData.expenseNature : new ExpenseNature();
            isPayment.expenseNatureId = paymentData.expenseNature ? paymentData.expenseNature.id : null;

            isPayment.caseCourt = paymentData.caseCourt ? paymentData.caseCourt : new CaseCourt();
            isPayment.caseCourtId = paymentData.caseCourt ? paymentData.caseCourt.id : null;

            isPayment.auctionScheduleId = paymentData.auctionScheduleId || null;

            isPayment.lawFirmId = paymentData.lawFirm ? paymentData.lawFirm.id : null;
            isPayment.caseRecommendLawFirmPaymentTermDetailId = paymentData.caseRecommendLawFirmPaymentTermDetail ? paymentData.caseRecommendLawFirmPaymentTermDetail.id : null;

            // isPayment.lawyerRecommend = paymentData.lawyerRecommend ? paymentData.lawyerRecommend : new lawyerRecommend();
            // isPayment.lawFirmId = paymentData.caseCourt ? paymentData.caseCourt.id : null;
            // isPayment.caseRecommendLawFirmPaymentTermDetailId = paymentData.caseCourt ? paymentData.caseCourt.id : null;

            isPayment.currency = paymentData.currency ? paymentData.currency : new Currency();
            isPayment.currencyId = paymentData.currency ? paymentData.currency.id : null;
            isPayment.payOrder = paymentData.payOrder ? paymentData.payOrder : null;
            isPayment.payOrderDispatchDate = paymentData.payOrderDispatchDate ? paymentData.payOrderDispatchDate : null;
            isPayment.payOrderDate = paymentData.payOrderDate ? paymentData.payOrderDate : null;

            const docs = [];
            if (paymentData.caseExpenseDocument && paymentData.caseExpenseDocument.length > 0) {
                paymentData.caseExpenseDocument.forEach(element => {
                    docs.push(this._fileService.mapDocument(element));
                });

            }
            isPayment.documents = docs;
            // isPayment.currencyId = paymentData.currency ? paymentData.currencyId : null;
            isPayment.genericStatus = paymentData.genericStatus;
            //         isPayment.status = paymentData.status;

            //         islawFirm.references = [];
            //         if (lawFirmData.reference && lawFirmData.reference.length > 0) {
            //             lawFirmData.reference.forEach(element => {

            //                 let docs = [];

            //                 if (element.lawFirmReferenceDocument && element.lawFirmReferenceDocument.length > 0) {
            //                     element.lawFirmReferenceDocument.forEach(element1 => {
            //                         docs.push(this._fileService.mapDocument(element1));
            //                     });
            //                 }

            //                 let u = {
            //                     id: element.id,
            //                     name: element.referenceName,
            //                     email: element.referenceEmail,
            //                     address: element.postalAddress,
            //                     documents: docs
            //                 }
            //                 islawFirm.references.push(u);
            //             });
            //         }



        }

        return isPayment;
    }

    // --------- payment list Count
    public getPaymentListCount(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        // const getUrl = 'users/list';
        const getUrl = 'case/expense/all/count';
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

    // --------- payment list Pagination
    public getPaymentListPagination(pageNo, limit): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        // const getUrl = 'users/list';
        const getUrl = 'case/expense/all/' + pageNo + '/' + limit;
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
    // --------- payment list
    public getPaymentList(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        // const getUrl = 'users/list';
        const getUrl = 'case/expense/all';
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

    public createPayment(payment): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        console.log("payment", payment);
        let getUrl = (payment.id ? "case/expense/update" : "case/expense/add");

        let docs = [];
        if (payment.documents && payment.documents.length > 0) {
            payment.documents.forEach(element => {
                docs.push({ DocumentUploadId: element.documentUploadId })
            });
        }
        let body = {
            // id: lawFirm.id || "",
            CaseBasicId: payment.caseBasicId || "",
            ExpenseNatureId: payment.expenseNatureId || "",
            CurrencyId: payment.currencyId || "",
            // GenericStatusId: 1,
            ExpenseAmount: payment.expenseAmount || 0,
            ExpenseDescription: payment.expenseDescription || "",
            CaseCourtId: payment.caseCourtId || null,
            CaseRecommendLawFirmPaymentTermDetailId: payment.caseRecommendLawFirmPaymentTermDetailId || null,
            AuctionScheduleId: payment.auctionScheduleId || null,
            CaseExpenseDocument: docs || []
        }



        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    public updatePayment(payment): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        let getUrl = (payment.id ? "case/expense/update" : "case/expense/add");
        let docs = [];
        if (payment.documents && payment.documents.length > 0) {
            payment.documents.forEach(element => {
                docs.push({ DocumentUploadId: element.documentUploadId })
            });
        }
        let body = {
            id: payment.id || "",
            CaseBasicId: payment.caseBasicId || "",
            ExpenseNatureId: payment.expenseNatureId || "",
            CurrencyId: payment.currencyId || "",
            // GenericStatusId: 1,
            ExpenseAmount: payment.expenseAmount || 0,
            ExpenseDescription: payment.expenseDescription || "",
            CaseCourtId: payment.caseCourtId || null,
            CaseRecommendLawFirmPaymentTermDetailId: payment.caseRecommendLawFirmPaymentTermDetailId || null,
            AuctionScheduleId: payment.auctionScheduleId || null,
            // CaseRecommendLawFirmPaymentTermDetailId: null,
            CaseExpenseDocument: docs || []
        }


        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    public approvePayment(id): Observable<any> {
        const getUrl = 'case/expense/approve/' + id;

        const body = {};

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public rejectPayment(id): Observable<any> {
        const getUrl = 'case/expense/reject/' + id;

        const body = {};

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public updatePayOrderPayment(id, payment): Observable<any> {
        // const getUrl = 'activate/user/' + id;
        // const getUrl = 'case/expense/payorder/update';
        const getUrl = 'case/expense/update/payorder';

        const body = {
            Id: id || "",
            PayOrder: payment ? payment.payOrder || "" : "",
            PayOrderDate: payment ? payment.payOrderDate || "" : "",
            PayOrderDispatchDate: payment ? payment.payOrderDispatchDate || "" : ""
        };

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public discardPayment(id): Observable<any> {
        // const getUrl = 'activate/user/' + id;
        const getUrl = 'expense/discard/' + id;

        const body = {};

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getPaymentDetails(id): Observable<any> {
        // const getUrl = 'activate/user/' + id;
        const getUrl = 'case/expense/' + id;

        const body = {};

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

}