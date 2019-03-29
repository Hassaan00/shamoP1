import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../base/http.service';
import { Observable } from 'rxjs/Observable';
import { Token } from '../../models/token';
import { Injectable, Inject } from '@angular/core';

import { IAuthService } from '../auth/iauth.service';
import { AuctionSchedule, AuctionHeld } from '../../models/auction';
import { Bail, BailOption } from '../../models/bail';
import { AdminSetupService } from '../admin/admin.setup.service';

@Injectable()
export class BailService {

    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _http: HttpService,
        private _adminSetupService: AdminSetupService,
    ) {
    }

    public mapBail(res: any): Bail {
        const bailData = res ? res : null;
        const isBail = new Bail();
        if (bailData) {
            isBail.id = bailData.id;
            isBail.proxyName = bailData.proxyName;
            isBail.bailDescription = bailData.bailDescription;
            isBail.bailValue = bailData.bailValue;
            isBail.caseCourt = bailData.caseCourt;
            isBail.caseCourtId = bailData.caseCourt && bailData.caseCourt.court ? bailData.caseCourt.court.id : null;
            isBail.genericStatus = bailData.genericStatus;
            isBail.lawFirm = bailData.lawFirm;
            if (bailData.lawFirm) {
                isBail.lawFirmId = bailData.lawFirm.id;
            }

            isBail.internalEmployee = this._adminSetupService.mapInternalEmployee(bailData.internalEmployee);
            isBail.internalEmployeeId = bailData.internalEmployee ? bailData.internalEmployee.id : null;
            // if (bailData.internalEmployee) {
            //     isBail.internalEmployeeId = bailData.internalEmployee.id;
            // }

            isBail.bailFinalStatus = bailData.bailFinalStatus ? bailData.bailFinalStatus : new BailOption();
            // if (bailData.bailOption) {
            //     isBail.BailOptionId = bailData.bailOption.id;
            //     isBail.bailOption = bailData.bailOption;
            // }
            isBail.bailDocs = bailData.bailDocument;
            isBail.paymentDepositIn = bailData.paymentDepositIn;
            isBail.paymentDepositInId = bailData.paymentDepositIn.id;
        }
        return isBail;
    }

    public saveBail(bailObj: Bail): Observable<any> {
        const getUrl = 'bail/save';
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        let docs = [];
        if (bailObj.bailDocument && bailObj.bailDocument.length > 0) {
            bailObj.bailDocument.forEach(element => {
                docs.push({ DocumentUploadId: element.DocumentUploadId })
            });
        }

        let body = {
            CaseCourtId: bailObj.caseCourtId || null,
            PaymentDepositInId: bailObj.paymentDepositInId || null,
            BailValue: bailObj.bailValue || null,
            BailDescription: bailObj.bailDescription || null,
            LawFirmId: bailObj.lawFirmId || null,
            InternalEmployeeId: bailObj.internalEmployeeId || null,
            ProxyName: bailObj.proxyName || null,
            BailDocument: docs
        };

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public updateBail(bailObj: Bail): Observable<any> {
        const getUrl = 'bail/update';

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        let docs = [];
        if (bailObj.bailDocument && bailObj.bailDocument.length > 0) {
            bailObj.bailDocument.forEach(element => {
                docs.push({ DocumentUploadId: element.DocumentUploadId })
            });
        }

        let body = {
            Id: bailObj.id || 0,
            CaseCourtId: bailObj.caseCourtId || null,
            PaymentDepositInId: bailObj.paymentDepositInId || null,
            BailValue: bailObj.bailValue || null,
            BailDescription: bailObj.bailDescription || null,
            LawFirmId: bailObj.lawFirmId || null,
            InternalEmployeeId: bailObj.internalEmployeeId || null,
            ProxyName: bailObj.proxyName || null,
            BailDocument: docs
        };

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAllBailsCount(): Observable<any> {
        const getUrl = 'bail/all/count';

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAllBailOptions(): Observable<any> {
        const getUrl = 'bail/option/all';

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAllBailsPagination(pageNo, limit): Observable<any> {
        const getUrl = 'bail/all/' + pageNo + '/' + limit;

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAllBails(): Observable<any> {
        const getUrl = 'bail/all';

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getBailById(bailId): Observable<any> {
        const getUrl = 'bail/via/id/' + bailId;

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.get(getUrl, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public approveBailById(bailId): Observable<any> {
        const getUrl = 'bail/approve/' + bailId;
        const body = '';

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }
    public rejectBailById(bailId): Observable<any> {
        const getUrl = 'bail/reject/' + bailId;
        const body = '';

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

}
