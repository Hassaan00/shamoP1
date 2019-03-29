import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../base/http.service';
import { Observable } from 'rxjs/Observable';
import { Token } from '../../models/token';
import { Injectable, Inject } from '@angular/core';

import { IAuthService } from '../auth/iauth.service';
import { Fir, FirLawFirm, FirParty } from '../../models/fir';
import { FileService } from '../file/file.service';

@Injectable()
export class FirService {

    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _http: HttpService,
        private _fileService: FileService,
    ) {
    }

    public mapFir(res: any): Fir {
        const firData = res ? res : null;
        const isFir = new Fir();
        if (firData) {
            isFir.id = firData.id || null;
            isFir.firId = firData.id || null;

            isFir.caseBasic = firData.caseBasic;
            isFir.caseBasicId = firData.caseBasic ? firData.caseBasic.id : null;

            isFir.firDate = firData.firDate || null;
            isFir.firDescription = firData.firDescription || null;
            isFir.investigationOfficerDesignation = firData.investigationOfficerDesignation || null;
            isFir.investigationOfficerName = firData.investigationOfficerName || null;
            isFir.investigationOfficerAddress = firData.investigationOfficerAddress || null;

            isFir.firResource = firData.firResource;
            isFir.firResourceId = firData.firResource ? firData.firResource.id : null;

            isFir.policeStation = firData.policeStation;
            isFir.policeStationId = firData.policeStation ? firData.policeStation.id : null;

            let docs = [];

            if (firData.firDocument && firData.firDocument.length > 0) {
                firData.firDocument.forEach(element1 => {
                    docs.push(this._fileService.mapDocument(element1));
                });
            }

            isFir.firDocs = docs;
            // isFir.firDocs = firData.firDocument;

            // if (firData.firLawFirm) {
            if (firData.firLawFirm && firData.firLawFirm.length > 0) {
                firData.firLawFirm.forEach(fl => {
                    isFir.FirLawFirm.push(fl.lawFirm.id);
                    isFir.lawFirmIds.push(fl.lawFirm.id);
                    isFir.firLawFirmIds.push(fl.lawFirm.id);
                    isFir.lawFirms.push(fl.lawFirm);
                    isFir.firLawFirms.push(fl.lawFirm);
                });
            }

            if (firData.firParty) {
                firData.firParty.forEach(fp => {
                    const obj: FirParty = {
                        PartyName: fp.partyName,
                        PartyCnic: fp.partyCnic,
                        PartyNtn: fp.partyNtn,
                        PartyContactNumber: fp.partyContactNumber,
                        PartyAddress: fp.partyAddress,
                    };
                    isFir.firParty.push(obj);
                });
            }

        }
        return isFir;
    }

    public saveFir(firObj: Fir): Observable<any> {
        const getUrl = 'fir/add';

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);


        let lawfirms = [];
        let firParties = [];

        // if (firObj && firObj.lawFirms && firObj.lawFirms.length > 0) {

        //     firObj.lawFirms.forEach(element => {
        //         lawfirms.push({ LawFirmId: element.id })
        //     });
        // }
        if (firObj && firObj.firLawFirms && firObj.firLawFirms.length > 0) {

            firObj.firLawFirms.forEach(element => {
                lawfirms.push({ LawFirmId: element.id })
            });
        }

        // if (firObj.firObj && FirParty.length > 0) {
        if (firObj && firObj.firParty && firObj.firParty.length > 0) {
            firObj.firParty.forEach((field, index) => {

                if (field && (field.PartyName || field.PartyCnic || field.PartyNtn || field.PartyContactNumber || field.PartyAddress)) {
                    firParties.push({
                        PartyName: field.PartyName || "",
                        PartyCnic: field.PartyCnic || "",
                        PartyNtn: field.PartyNtn || "",
                        PartyContactNumber: field.PartyContactNumber || "",
                        PartyAddress: field.PartyAddress || "",
                    });
                }
            });
        }

        let docs = [];
        if (firObj && firObj.firDocs && firObj.firDocs.length > 0) {
            firObj.firDocs.forEach(element => {
                docs.push({ DocumentUploadId: element.documentUploadId })
            });
        }

        let body = {
            Id: 0,
            CaseBasicId: firObj.caseBasicId || null,
            InvestigationOfficerName: firObj.investigationOfficerName || null,
            InvestigationOfficerDesignation: firObj.investigationOfficerDesignation || null,
            InvestigationOfficerAddress: firObj.investigationOfficerAddress || null,
            FirResourceId: firObj.firResourceId || null,
            PoliceStationId: firObj.policeStationId || null,
            FirDate: firObj.firDate || null,
            FirDescription: firObj.firDescription || null,
            FirParty: firParties || [],
            FirLawFirm: lawfirms || [],
            FirDocument: docs || []

        };

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public updateFir(firObj: Fir): Observable<any> {
        const getUrl = 'fir/update';

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        let lawfirms = [];
        let firParties = [];

        // if (firObj && firObj.lawFirms && firObj.lawFirms.length > 0) {

        //     firObj.lawFirms.forEach(element => {
        //         lawfirms.push({ LawFirmId: element.id })
        //     });
        // }

        if (firObj && firObj.firLawFirms && firObj.firLawFirms.length > 0) {

            firObj.firLawFirms.forEach(element => {
                lawfirms.push({ LawFirmId: element.id })
            });
        }

        // if (firObj.firObj && FirParty.length > 0) {
        if (firObj && firObj.firParty && firObj.firParty.length > 0) {
            firObj.firParty.forEach((field, index) => {
                if (field && (field.PartyName || field.PartyCnic || field.PartyNtn || field.PartyContactNumber || field.PartyAddress)) {
                    firParties.push({
                        PartyName: field.PartyName || "",
                        PartyCnic: field.PartyCnic || "",
                        PartyNtn: field.PartyNtn || "",
                        PartyContactNumber: field.PartyContactNumber || "",
                        PartyAddress: field.PartyAddress || "",
                    });
                }
            });
        }

        let docs = [];
        if (firObj && firObj.firDocs && firObj.firDocs.length > 0) {
            firObj.firDocs.forEach(element => {
                docs.push({ DocumentUploadId: element.documentUploadId })
            });
        }

        let body = {
            Id: firObj.id || 0,
            CaseBasicId: firObj.caseBasicId || null,
            InvestigationOfficerName: firObj.investigationOfficerName || null,
            InvestigationOfficerDesignation: firObj.investigationOfficerDesignation || null,
            InvestigationOfficerAddress: firObj.investigationOfficerAddress || null,
            FirResourceId: firObj.firResourceId || null,
            PoliceStationId: firObj.policeStationId || null,
            FirDate: firObj.firDate || null,
            FirDescription: firObj.firDescription || null,
            FirParty: firParties || [],
            FirLawFirm: lawfirms || [],
            FirDocument: docs || []

        };

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getAllFirsCount(): Observable<any> {
        const getUrl = 'fir/all/count';

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

    public getAllFirsPagination(pageNo, limit): Observable<any> {
        const getUrl = 'fir/all/' + pageNo + '/' + limit;

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

    public getAllFirs(): Observable<any> {
        const getUrl = 'fir/all';

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

    public getFirById(firId): Observable<any> {
        const getUrl = 'fir/via/id/' + firId;

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
}
