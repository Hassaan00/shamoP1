
import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { IAuthService } from './iauth.service';
import { UIService } from '../ui/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { Token } from '../../models/token';
import { environment } from '../../../../environments/environment';

import { Message, MessageTypes } from '../../models/message';
import { SidebarPermissions } from '../../models/sidebar.permission';


@Injectable()
export class AuthService implements IAuthService, OnDestroy {


    private messageSource = new BehaviorSubject<boolean>(false);
    currentMessage = this.messageSource.asObservable();

    loginStatusChanged = new Subject<User>();
    // loginStatusChangedNew = new Subject<any>();

    private _clientId = '';
    private _clientSecret = '';
    private token_expires: number;
    constructor(private _http: Http, private _router: Router,
        private _uiService: UIService,
    ) {
    }

    ngOnDestroy(): void {
        console.log('destorying auth service');
    }

    /**
    * Build API url.
    * @param url
    * @returns {string}
    */
    signinstatus(message: boolean) {
        this.messageSource.next(message);
    }

    protected getAuthFullUrl(url: string): string {
        return environment.authBaseUrl + url;
    }

    protected getFullUrl(url: string): string {
        return environment.apiBaseUrl + url;
    }

    protected mapUser(res: any): User {
        const userData = res.json();
        const isUser = new User();
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

        return isUser;
    }

    /**
     * Build API url
     * @param res
     */
    protected getAPIFullUrl(url: String): string {
        return environment.apiBaseUrl + url;
    }

    private SaveToken(response: Response) {
        const data = response.json();
        this.token_expires = Date.now() + ((data.expires_in - 60) * 1000);
        console.log('expiry:' + data.expires_in);
        localStorage.setItem('token_id', data.access_token);
        localStorage.setItem('token_expiry', this.token_expires.toString());
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('token_type', data.token_type);
        // setTimeout(function(){ this.logoutUser(); }, (data.expires_in * 1000));
        // console.log();

        return data;
    }
    checkToken(): boolean {
        if (localStorage.getItem('token_id')) {
            if ((parseInt(localStorage.getItem('token_expiry'))) > Date.now()) {
                return true;
            } else {
                this.logoutUser();
                return false;
            }
        } else {
            return false;
        }

    }

    isLoggedIn(): boolean {
        const token = this.getTokenData();
        if (token && token.tokenExpiry) {
            if (token.tokenExpiry > Date.now().toString()) {
                return true;
            }
        }
        return false;
    }


    checkLogin(user: User): Observable<any> {
        const url = this.getAuthFullUrl('connect/token');
        const params = new URLSearchParams();
        params.append('grant_type', environment.grant_type);
        params.append('username', user.email);
        params.append('password', user.password);
        params.append('client_id', environment.client_id);
        params.append('client_secret', environment.client_secret);

        const options = new RequestOptions();

        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(url, params.toString(), options)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
            .do((res) => {
                this.SaveToken(res);
            });


    }


    forgotPassword_(user: User): Observable<any> {
        const url = this.getFullUrl('forgetpassword');
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        const body = {
            entityType: user.entityType,
            email: user.email,
        };

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                //console.log(err);
                return Observable.throw(err);
            });
    }

    forgotPassword(user: User): Observable<any> {
        const url = this.getAPIFullUrl('user/reset/password/' + user.email);
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');
        const body = {};

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }


    resetPassword(user: User, key: string): Observable<any> {
        const url = this.getFullUrl('user/registration/verify');

        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        const body = {
            VerificationKey: key,
            UserPassword: user.password,
        };
        return this._http.put(url, body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    checkEntityNameAvailability(entityName, entityType): Observable<any> {

        const url = this.getFullUrl('name/available');

        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        const body = {
            entityName: entityName,
            entityType: entityType
        };

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    checkSapIdAvailability(sapId): Observable<any> {

        const url = this.getAPIFullUrl('/user/sapid/available/' + sapId);
        return this._http.get(url).catch((err, caught) => {
            return Observable.throw(err);
        });

    }

    checkEmailAvailability(emailAddress, entityType): Observable<any> {
        const url = this.getAPIFullUrl('/user/email/available/' + emailAddress);
        return this._http.get(url).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    update(user): Observable<any> {
        const url = this.getAPIFullUrl('user/registration/complete');
        const body = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            title: user.title,
            credentials: user.credentials,
            employer: user.employer,
            address: user.address,
            cityId: user.city.id,
            countryId: user.country.id,
            zipCode: user.zipCode,
            stateId: user.state.id,
            secretQuestion1: user.secretQuestion1,
            secretQuestion2: user.secretQuestion2,
            secretAnswer1: user.secretAnswer1,
            secretAnswer2: user.secretAnswer2
        };

        return this._http.put(url, body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    register(user: User): Observable<any> {

        const url = this.getAPIFullUrl('user/registration');

        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        const body = {
            SapId: user.sapId,
            UserEmail: user.email,
            UserPassword: user.password,
            ConfirmPassword: user.confirmPassword,
            FirstName: user.firstName,
            LastName: user.lastName,
            DesignationId: user.designationId,
            DepartmentId: user.departmentId,
            CountryId: user.countryId,
            RegionId: user.regionId,
            CityId: user.cityId,
            BranchId: user.branchId
        };

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    verifyKey(key: string): Observable<any> {
        const url = this.getAPIFullUrl('user/verify/account');
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        const body = { VerificationKey: key };

        return this._http.put(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    resendEmail(user: User): Observable<any> {
        const url = this.getFullUrl('accountverification/resend');
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        const body = {
            email: user.email,
            entityType: user.entityType
        };
        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    resendVerificationEmail(user: User): Observable<any> {
        const url = this.getFullUrl('user/resend/verification/email/' + user.email);

        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        const body = {};
        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getToken(): string {
        return localStorage.getItem('token_id');
    }

    getTokenData(): Token {

        const token = new Token();

        token.tokenId = localStorage.getItem('token_id');
        token.tokenExpiry = localStorage.getItem('token_expiry');
        token.refreshToken = localStorage.getItem('refresh_token');
        token.tokenType = localStorage.getItem('token_type');

        return token;

    }

    getLoggedinUser(): User {
        return this.getUser();
    }

    public storeUser(user: User) {
        if (!user) { return; }

        localStorage.setItem('user', JSON.stringify(user));
    }

    public storeUrlPath(urlPath: string) {
        localStorage.setItem('urlPath', JSON.stringify(urlPath));
    }

    getUrlPath(): string {
        return JSON.parse(localStorage.getItem('urlPath'));
    }

    getUser(): User {
        if (localStorage.getItem('user')) {
            return JSON.parse(localStorage.getItem('user'));
        }
        return;
    }

    public storeSidebarPermissions(sidebarPermissions: SidebarPermissions) {
        if (!sidebarPermissions) { return; }

        localStorage.setItem('sidebar_permissions', JSON.stringify(sidebarPermissions));
    }


    getSidebarPermissions(): SidebarPermissions {
        if (localStorage.getItem('sidebar_permissions')) {
            return JSON.parse(localStorage.getItem('sidebar_permissions'));
        }
        return;
    }

    verifyEmail(email: String) {
        const url = this.getAPIFullUrl('/user/email/available/' + email);
        return this._http.get(url).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    logoutUser() {
        console.log("logout");
        localStorage.clear();
        this.loginStatusChanged.next(null);
        this._router.navigate(['/']);

        // this.loginStatusChangedNew.next("Abc");
    }

    errStatusCheck(err: any): any {
        let errMsg: string;
        console.log('err', err);
        const msg = new Message();
        msg.title = '';
        msg.iconType = '';
        if (err.status == 400) {
            msg.msg = err.json() ? err.json().message : 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;

        } else if (err.status == 401) {
            msg.msg = err.json() ? err.json() : 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;

        } else if (err.status == 403) {

            this._router.navigate(['/permission']);

        } else if (err.status == 404 && err.statusText == 'Not Found') {

            msg.msg = 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;

        } else if (err.status == 404 && err.statusText !== 'Not Found') {

            msg.msg = err.json() ? err.json() : 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;

        } else {
            msg.msg = 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;
        }
    }

    errStatusCheckResponse(err: any): any {
        let errMsg: string;
        console.log('err', err);

        const msg = new Message();
        msg.title = '';
        msg.iconType = '';
        if (err.status == 400) {
            msg.msg = err.json() ? err.json().message : 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;

        } else if (err.status == 401) {
            msg.msg = err.json() ? err.json().message : 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;

        } else if (err.status == 403) {

            this._router.navigate(['/permission']);

        } else if (err.status == 404 && err.statusText == 'Not Found') {

            msg.msg = 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;

            // this._router.navigate(['/error']);

        } else if (err.status == 404 && err.statusText !== 'Not Found') {

            msg.msg = err.json() ? err.json().message : 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;

        } else {
            msg.msg = 'Sorry, an error has occured';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            return msg;
        }
    }
}
