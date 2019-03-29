import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../../core/models/user';
import { Message, MessageTypes } from '../../../core/models/message';
import { SidebarPermissions } from '../../../core/models/sidebar.permission';

import { UIService } from '../../../core/services/ui/ui.service';
import { UserService } from '../../../core/services/user/user.service';
import { IAuthService } from '../../../core/services/auth/iauth.service';
import { UtilityService } from '../../../core/services/general/utility.service';

@Component({
    selector: 'login',
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    phide = true;
    Mainpage = 'none';
    Loginpage = 'block';
    Loadingpage = 'none';
    signin: boolean;
    user: User = new User();
    loginUser: User = new User();
    successResponse: any;
    errorResponse: any;
    errMsg: string;
    isSubmitted = false;
    pms: SidebarPermissions = new SidebarPermissions();

    // patternemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    formLogin = new FormGroup({
        // 'email': [this.user.email, Validators.compose([Validators.required, Validators.email, Validators.pattern(this.patternEmail)])],
        'email': new FormControl(this.user.email, [Validators.required, Validators.email]),
        'password': new FormControl(this.user.password, [Validators.required]),
    });
    constructor(
        // private _authServices: AuthService,
        @Inject('IAuthService') private _authServices: IAuthService,
        private _uiServices: UIService,
        private _router: Router,
        private u: UtilityService,
        private _userService: UserService
    ) { }

    Mainpagecreateaccount() {
        this._router.navigate(['/registration']);
    }
    // emailFocus()
    // {
    //     this.user.email= this.user.email.toLocaleLowerCase();
    // }

    Mainpagesignin() {
        this.Mainpage = 'none';
        this.Loginpage = 'block';
    }

    ngOnInit(): void {
        // this._authServices.currentMessage.subscribe(value => this.signin = value)
        // if (this.signin) {
        //     this.Mainpagesignin()
        // }

        // if (this._authServices.checkToken()) {
        if (this._authServices.isLoggedIn()) {
            this._router.navigate(['/home']);
        }
    }

    onEmailFocusOut() {
        this.user.email = (this.user.email && this.user.email.length > 0 ? this.user.email.trim() : this.user.email);
    }

    login(): void {

        if (this.formLogin.invalid) {
            const msg = new Message();
            msg.title = '';
            msg.iconType = '';

            if (this.formLogin.controls['email'].hasError('required') && this.formLogin.controls['password'].hasError('required')) {
                msg.msg = 'Email and password are required.';
            } else if (this.formLogin.controls['email'].hasError('required')) {
                msg.msg = 'Email is required.';
            } else if (this.formLogin.controls['email'].hasError('email')) {
                msg.msg = 'Invalid email address.';
            } else if (this.formLogin.controls['email'].hasError('pattern')) {
                msg.msg = 'Invalid email address.';
            } else if (this.formLogin.controls['password'].hasError('required')) {
                msg.msg = 'Password is required.';
            }
            this._uiServices.showToast(msg, '');

        } else {
            this.Loginpage = 'none';
            this.Loadingpage = 'block';
            // console.log("trying to login...");
            this.isSubmitted = true;
            this.user.email = this.user.email.toLocaleLowerCase();

            this._authServices.checkLogin(this.user).subscribe(
                (res) => {

                    this._userService.getStatus().subscribe(
                        (res) => {
                            console.log('res', res);
                            this.isSubmitted = false;


                            // this.loginUser = this._authServices.getUser();
                            // // if (this._authServices.getUser().accountVerified) {

                            // // if (this._authServices.getUser().isActive || this._authServices.getUser().isActive == undefined) {
                            // if (this.loginUser.isActive || this.loginUser.isActive == undefined) {
                            //     console.log('test1');
                            //     this._router.navigate(['/home']);
                            // }
                            // else {
                            //     console.log('test2');
                            //     this._router.navigate(['/verification']);
                            // }
                            this.loginUser = this._authServices.getUser();

                            this.pms.user_add = this.u.checkUserPermission(this.loginUser, 'user_add');
                            this.pms.user_list = this.u.checkUserPermission(this.loginUser, 'user_list');
                            this.pms.npl_account_list = this.u.checkUserPermission(this.loginUser, 'npl_account_list');
                            this.pms.internal_employee_list = this.u.checkUserPermission(this.loginUser, 'internal_employee_list');
                            this.pms.external_party_list = this.u.checkUserPermission(this.loginUser, 'external_party_list');
                            this.pms.case_create_page = this.u.checkUserPermission(this.loginUser, 'case_create_page');
                            this.pms.case_list = this.u.checkUserPermission(this.loginUser, 'case_list');
                            this.pms.case_plaint_list_lawyer = this.u.checkUserPermission(this.loginUser, 'case_plaint_list_lawyer');
                            this.pms.case_plaint_list_other = this.u.checkUserPermission(this.loginUser, 'case_plaint_list_other');
                            this.pms.case_decision_action_page = this.u.checkUserPermission(this.loginUser, 'case_decision_action_page');
                            this.pms.case_close_page = this.u.checkUserPermission(this.loginUser, 'case_close_page');
                            this.pms.law_firm_list = this.u.checkUserPermission(this.loginUser, 'law_firm_list');
                            this.pms.law_firm_add_page = this.u.checkUserPermission(this.loginUser, 'law_firm_add_page');
                            this.pms.law_firm_user_add = this.u.checkUserPermission(this.loginUser, 'law_firm_user_add');
                            this.pms.court_list = this.u.checkUserPermission(this.loginUser, 'court_list');
                            this.pms.judge_list = this.u.checkUserPermission(this.loginUser, 'judge_list');
                            this.pms.case_expense_list = this.u.checkUserPermission(this.loginUser, 'case_expense_list');
                            this.pms.case_expense_add = this.u.checkUserPermission(this.loginUser, 'case_expense_add');
                            this.pms.settlement_prefiling_list = this.u.checkUserPermission(this.loginUser, 'settlement_prefiling_list');
                            this.pms.settlement_postfiling_list = this.u.checkUserPermission(this.loginUser, 'settlement_postfiling_list');
                            this.pms.settlement_payment_page = this.u.checkUserPermission(this.loginUser, 'settlement_payment_page');
                            this.pms.negotiation_list = this.u.checkUserPermission(this.loginUser, 'negotiation_list');
                            this.pms.negotiation_process_start = this.u.checkUserPermission(this.loginUser, 'negotiation_process_start');
                            this.pms.auction_held_list = this.u.checkUserPermission(this.loginUser, 'auction_held_list');
                            this.pms.auction_list = this.u.checkUserPermission(this.loginUser, 'auction_list');
                            this.pms.bail_list = this.u.checkUserPermission(this.loginUser, 'bail_list');
                            this.pms.fir_list = this.u.checkUserPermission(this.loginUser, 'fir_list');
                            this.pms.case_setup_page = this.u.checkUserPermission(this.loginUser, 'case_setup_page');
                            this.pms.branch_setup_page = this.u.checkUserPermission(this.loginUser, 'branch_setup_page');
                            this.pms.manage_role_page = this.u.checkUserPermission(this.loginUser, 'manage_role_page');
                            this.pms.request_advice_page = this.u.checkUserPermission(this.loginUser, 'request_advice_page');
                            this.pms.request_create_page = this.u.checkUserPermission(this.loginUser, 'request_create_page');
                            this.pms.request_list = this.u.checkUserPermission(this.loginUser, 'request_list');
                            this.pms.discussion_page = this.u.checkUserPermission(this.loginUser, 'discussion_page');
                            this.pms.contract_list = this.u.checkUserPermission(this.loginUser, 'contract_list');
                            this.pms.contract_add = this.u.checkUserPermission(this.loginUser, 'contract_add');

                            this.pms.daily_report = this.u.checkUserPermission(this.loginUser, 'daily_report');
                            this.pms.main_report = this.u.checkUserPermission(this.loginUser, 'main_report');
                            this.pms.case_added_report = this.u.checkUserPermission(this.loginUser, 'case_added_report');
                            this.pms.case_closed_report = this.u.checkUserPermission(this.loginUser, 'case_closed_report');
                            this.pms.payment_report = this.u.checkUserPermission(this.loginUser, 'payment_report');
                            this.pms.lawfirm_general_report = this.u.checkUserPermission(this.loginUser, 'lawfirm_general_report');
                            this.pms.lawfirm_region_wise_report = this.u.checkUserPermission(this.loginUser, 'lawfirm_region_wise_report');
                            this.pms.lawfirm_court_wise_report = this.u.checkUserPermission(this.loginUser, 'lawfirm_court_wise_report');
                            this.pms.lawfirm_decree_percentile = this.u.checkUserPermission(this.loginUser, 'lawfirm_decree_percentile');
                            this.pms.npl_file_upload_log = this.u.checkUserPermission(this.loginUser, 'npl_file_log_list');
                            // setTimeout(2000);
                            this._authServices.storeSidebarPermissions(this.pms);

                            // this._router.navigate(['/home']);
                            // this._router.navigate(['/admin/home']);

                            this._router.navigate(['/home']);


                        },
                        (err) => {
                            console.log('err', err);
                            this.isSubmitted = false;
                            // this._authServices.errStatusCheck(err);
                        }
                    );

                    // this.loginUser = this._authServices.getUser();
                    // // if (this._authServices.getUser().accountVerified) {

                    // // if (this._authServices.getUser().isActive || this._authServices.getUser().isActive == undefined) {
                    // if ((this.loginUser && this.loginUser.isActive) || this.loginUser == null) {
                    //     console.log('test1');
                    //     this._router.navigate(['/home']);
                    // }
                    // else {
                    //     console.log('test2');
                    //     this._router.navigate(['/verification']);
                    // }


                },
                (err) => {
                    console.log('err', err);
                    this.isSubmitted = false;
                    // this._authServices.errStatusCheck(err);
                    const msg = new Message();
                    if (err.status == 400) {

                        if (err.json() && err.json().error == 'invalid_client') {
                            msg.msg = err.json() && err.json().error_description ? err.json().error_description : 'Sorry, an error has occured';
                            msg.msgType = MessageTypes.Error;
                            msg.autoCloseAfter = 400;
                            this._uiServices.showToast(msg, '');

                            this._router.navigate(['/verification']);
                        } else {
                            msg.msg = err.json() && err.json().error_description ? err.json().error_description : 'Sorry, an error has occured';
                            msg.msgType = MessageTypes.Error;
                            msg.autoCloseAfter = 400;
                            this._uiServices.showToast(msg, '');
                        }
                    } else {
                        this._authServices.errStatusCheck(err);
                    }
                }
            );
        }
    }

    onForgetPassword() {
        this._router.navigateByUrl('forgot-password');
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }

}
