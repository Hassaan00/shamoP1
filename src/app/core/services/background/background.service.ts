import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy, Inject } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { User } from "../../models/user";
import { Token } from "../../models/token";

import { IAuthService } from '../auth/iauth.service';

@Injectable()
export class BacgroundService {
    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _http: HttpService,
    ) { }


    // --------- 1
    public contractRenewBackground(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'contract/renew/background';

        let body = {};

        return this._http.post(getUrl, body, options)
            // .map(res => res.json())
            .map((res: Response) => res)
            .catch((error: any) =>
            // Observable.throw(error.json() || 'Server error')
            {
                return Observable.throw(error);
            }
            );
    }

    // --------- 2
    public contractExpire(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'contract/expire';

        let body = {};

        return this._http.post(getUrl, body, options)
            // .map(res => res.json())
            .map((res: Response) => res)
            .catch((error: any) =>
            // Observable.throw(error.json() || 'Server error')
            {
                return Observable.throw(error);
            }
            );
    }

    // --------- 3
    public caseMarkDeadlineFlag(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'case/mark/deadline/flag';

        let body = {};

        return this._http.post(getUrl, body, options)
            // .map(res => res.json())
            .map((res: Response) => res)
            .catch((error: any) =>
            // Observable.throw(error.json() || 'Server error')
            {
                return Observable.throw(error);
            }
            );
    }

    // --------- 4
    public lawfirmMarkDeadlineFlag(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'lawfirm/mark/deadline/flag';

        let body = {};

        return this._http.post(getUrl, body, options)
            // .map(res => res.json())
            .map((res: Response) => res)
            .catch((error: any) =>
            // Observable.throw(error.json() || 'Server error')
            {
                return Observable.throw(error);
            }
            );
    }

    // --------- 5
    public readNplFile(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'read/npl/file';

        let body = {};

        return this._http.post(getUrl, body, options)
            // .map(res => res.json())
            .map((res: Response) => res)
            .catch((error: any) =>
            // Observable.throw(error.json() || 'Server error')
            {
                return Observable.throw(error);
            }
            );
    }

    // --------- 6
    public readHrFile(): Observable<any> {

        let token: Token;
        token = this._authService.getTokenData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Authorization', token.tokenType + ' ' + token.tokenId);

        const getUrl = 'read/hr/file';

        let body = {};

        return this._http.post(getUrl, body, options)
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
