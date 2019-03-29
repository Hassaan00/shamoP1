
import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../base/http.service';
import { Observable } from 'rxjs/Observable';
import { Token } from '../../models/token';
import { Injectable, Inject } from '@angular/core';

import { IAuthService } from '../auth/iauth.service';
import { AuctionSchedule, AuctionHeld } from '../../models/auction';
import { Bail } from '../../models/bail';
import { Contract, ContractType } from '../../models/contract.model';
import { FileService } from '../file/file.service';
import { AdminSetupService } from '../admin/admin.setup.service';
import { Currency } from '../../models/currency';
import { ExternalEmployee } from '../../models/employee';

@Injectable()
export class ContractService {

    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _http: HttpService,
        private _adminSetupService: AdminSetupService,
        private _fileService: FileService,
    ) {
    }

    public mapContract(res: any): Contract {
        const contractData = res ? res : null;
        const isContract = new Contract();
        if (contractData) {

            isContract.id = contractData.id || null;
            isContract.contractId = contractData.id || null;
            isContract.contractTitle = contractData.contractTitle || null;

            isContract.contractTypeId = contractData.contractType ? contractData.contractType.id : null;
            isContract.contractType = contractData.contractType ? contractData.contractType : new ContractType();

            isContract.contractDescription = contractData.contractDescription || null;

            isContract.contractStartDate = contractData.contractStartDate || null;
            isContract.contractExpiryDate = contractData.contractExpiryDate || null;
            isContract.contractExpired = contractData.contractExpired || false;

            isContract.contractPrice = contractData.contractPrice || null;
            isContract.currencyId = contractData.currency ? contractData.currency.id : null;
            isContract.currency = contractData.currency ? contractData.currency : new Currency();

            isContract.externalPartyId = contractData.externalParty ? contractData.externalParty.id : null;
            isContract.externalParty = contractData.externalParty ? contractData.externalParty : new ExternalEmployee();

            isContract.contractRenewalIntimation = contractData.contractRenewalIntimation || null;
            isContract.contractRenewalPricePercentage = contractData.contractRenewalPricePercentage || null;

            isContract.isContractTerminated = contractData.isContractTerminated || false;
            isContract.contractTerminationDate = contractData.contractTerminationDate || null;
            isContract.contractTerminationReason = contractData.contractTerminationReason || null;


            isContract.contractDocument = contractData.contractDocument;
            const cd = [];
            if (contractData.contractDocument && contractData.contractDocument.length > 0) {
                contractData.contractDocument.forEach(element => {
                    cd.push(this._fileService.mapDocument(element));
                });

            }
            isContract.contractDocuments = cd;

            const ct = [];
            const ctId = [];
            if (contractData.contractTag && contractData.contractTag.length > 0) {
                contractData.contractTag.forEach(element => {
                    if (element) {
                        ct.push(this._adminSetupService.mapTag(element));
                        ctId.push(this._adminSetupService.mapTag(element).id);
                    }

                });

            }

            isContract.contractTags = ct;
            isContract.contractTagIds = ctId;

            const cCon = [];
            if (contractData.clubbedContract && contractData.clubbedContract.length > 0) {
                contractData.clubbedContract.forEach(element => {
                    cCon.push(this.mapContract(element));
                });

            }
            isContract.clubbedContract = cCon;
            isContract.isClubbedContract = cCon.length > 0 ? true : false;

            const c = [];
            if (contractData.contractInformationHistory && contractData.contractInformationHistory.length > 0) {
                contractData.contractInformationHistory.forEach(element => {
                    c.push(this.mapContract(element));
                });

            }
            isContract.contractInformationHistory = c;

            // isAdvisory.contractInformationHistory = this.mapUser(advisoryData.advisoryServiceCreatedBy);

        }
        return isContract;
    }

    public saveContract(contractData: Contract): Observable<any> {
        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        // console.log("contractData", contractData);
        let getUrl = 'contract/information/add';

        let docs = [];
        if (contractData.contractDocuments && contractData.contractDocuments.length > 0) {
            contractData.contractDocuments.forEach(element => {
                docs.push({ DocumentUploadId: element.documentUploadId });
            });
        }

        let cCon = [];
        if (contractData.clubbedContract && contractData.clubbedContract.length > 0) {
            contractData.clubbedContract.forEach(element => {
                cCon.push({ PreviousContractId: element.id });
            });
        }

        let rts = [];
        if (contractData.contractTags && contractData.contractTags.length > 0) {
            contractData.contractTags.forEach(element => {
                rts.push({ ContractTagId: element.id })
            });
        }

        let body = {
            Id: 0, //for insert or update 
            ContractTitle: contractData.contractTitle || null,
            ContractDescription: contractData.contractDescription || null,
            ContractTypeId: contractData.contractTypeId || null,
            ContractStartDate: contractData.contractStartDate || null,
            ContractExpiryDate: contractData.contractExpiryDate || null,
            ExternalPartyId: contractData.externalPartyId || null,
            ContractPrice: contractData.contractPrice || null,
            CurrencyId: contractData.currencyId || null,
            ContractRenewalIntimation: contractData.contractRenewalIntimation || null,
            ContractRenewalPricePercentage: contractData.contractRenewalPricePercentage || null,

            ContractDocument: docs || [],
            ClubbedContract: cCon || [],
            ContractTagMarked: rts || []
        }

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    // public updateContract(obj): Observable<any> {
    public updateContract(contractData: Contract): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        // console.log("contractData", contractData);
        let getUrl = 'contract/information/update';

        let docs = [];
        if (contractData.contractDocuments && contractData.contractDocuments.length > 0) {
            contractData.contractDocuments.forEach(element => {
                docs.push({ DocumentUploadId: element.documentUploadId });
            });
        }

        let cCon = [];
        if (contractData.clubbedContract && contractData.clubbedContract.length > 0) {
            contractData.clubbedContract.forEach(element => {
                cCon.push({ PreviousContractId: element.id });
            });
        }

        let rts = [];
        if (contractData.contractTags && contractData.contractTags.length > 0) {
            contractData.contractTags.forEach(element => {
                rts.push({ ContractTagId: element.id })
            });
        }

        let body = {
            Id: contractData.id || 0, //for insert or update 
            ContractTitle: contractData.contractTitle || null,
            ContractDescription: contractData.contractDescription || null,
            ContractTypeId: contractData.contractTypeId || null,
            ContractStartDate: contractData.contractStartDate || null,
            ContractExpiryDate: contractData.contractExpiryDate || null,
            ExternalPartyId: contractData.externalPartyId || null,
            ContractPrice: contractData.contractPrice || null,
            CurrencyId: contractData.currencyId || null,
            ContractRenewalIntimation: contractData.contractRenewalIntimation || null,
            ContractRenewalPricePercentage: contractData.contractRenewalPricePercentage || null,

            ContractDocument: docs || [],
            ClubbedContract: cCon || [],
            ContractTagMarked: rts || []
        }

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    // public renewContract(obj): Observable<any> {
    public renewContract(contractData: Contract): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        // console.log("contractData", contractData);
        let getUrl = 'contract/renew';

        let docs = [];
        if (contractData.contractDocuments && contractData.contractDocuments.length > 0) {
            contractData.contractDocuments.forEach(element => {
                docs.push({ DocumentUploadId: element.documentUploadId });
            });
        }

        let cCon = [];
        if (contractData.clubbedContract && contractData.clubbedContract.length > 0) {
            contractData.clubbedContract.forEach(element => {
                cCon.push({ PreviousContractId: element.id });
            });
        }

        let rts = [];
        if (contractData.contractTags && contractData.contractTags.length > 0) {
            contractData.contractTags.forEach(element => {
                rts.push({ ContractTagId: element.id })
            });
        }

        let body = {
            Id: contractData.id || 0, //for insert or update 
            ContractTitle: contractData.contractTitle || null,
            ContractDescription: contractData.contractDescription || null,
            ContractTypeId: contractData.contractTypeId || null,
            ContractStartDate: contractData.contractStartDate || null,
            ContractExpiryDate: contractData.contractExpiryDate || null,
            ExternalPartyId: contractData.externalPartyId || null,
            ContractPrice: contractData.contractPrice || null,
            CurrencyId: contractData.currencyId || null,
            ContractRenewalIntimation: contractData.contractRenewalIntimation || null,
            ContractRenewalPricePercentage: contractData.contractRenewalPricePercentage || null,

            ContractDocument: docs || [],
            ClubbedContract: cCon || [],
            ContractTagMarked: rts || []
        }

        return this._http.post(getUrl, body, options)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getContractTypes(): Observable<any> {
        const getUrl = 'contract/type/all';

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

    public getAllContractsCount(): Observable<any> {
        const getUrl = 'contract/information/all/count';

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

    public getAllContractsPagination(pageNo, limit): Observable<any> {
        const getUrl = 'contract/information/all/' + pageNo + '/' + limit;

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

    public getAllContracts(): Observable<any> {
        const getUrl = 'contract/information/all';

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

    public getContractById(contractId): Observable<any> {
        const getUrl = 'contract/information/via/id/' + contractId;

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

    public terminateContract(contract, reason): Observable<any> {
        const getUrl = 'terminate/contract';
        const body = {
            Id: contract.id || 0,
            // ContractTerminationDate: "I am terminating this contract",
            ContractTerminationReason: reason || null
        };

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

    public getContractRequestViaTypeGraph(type): Observable<any> {
        const getUrl = 'contract/dashboard/stats/via/type/' + type;
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

    public getContractStatsGraph(startDate, endDate): Observable<any> {
        const getUrl = 'contract/dashboard/stats/all/via/range/' + startDate + '/' + endDate;
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
