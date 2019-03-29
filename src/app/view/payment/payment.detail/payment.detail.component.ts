import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';

import { Message, MessageTypes } from '../../../core/models/message';
import { User } from '../../../core/models/user';
import { Case } from '../../../core/models/case';
import { Payment } from '../../../core/models/payment';
import { Currency } from '../../../core/models/currency';
import { Document } from '../../../core/models/document';
import { ExpenseNature } from '../../../core/models/expenseNature';
import { LawyerRecommend } from '../../../core/models/lawyerRecommend';
import { PaymentTerm } from '../../../core/models/paymentTerm';
import { Milestone } from '../../../core/models/milestone';

import { IAuthService } from '../../../core/services/auth/iauth.service';
import { UIService } from '../../../core/services/ui/ui.service';
import { UtilityService } from '../../../core/services/general/utility.service';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { AdminSetupService } from '../../../core/services/admin/admin.setup.service';

import { Config } from '../../../config/config';

declare var libraryVar: any;

@Component({
    selector: 'payment-detail',
    moduleId: module.id,
    templateUrl: 'payment.detail.component.html',
    styleUrls: ['../payment.component.css'],
    providers: [
        DatePipe // this pipe is used to change date format
    ],
})
export class PaymentDetailComponent implements OnInit {

    title = "Add";
    isLogin: any;
    patternEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // patternName = /^[A-Za-z ]+$/;
    phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    isSubmitted = false;

    paymentDetails: Payment = new Payment();
    newPayment: Payment = new Payment();
    paymentForm: Payment = new Payment();
    paymentId: number;

    // newPaymentForm: Payment = new Payment();

    caseList: Case[] = [];
    expenseNatureList: ExpenseNature[] = [];
    lawFirmList: LawyerRecommend[] = [];
    courtList: any[] = [];
    currencies: Currency[] = [];
    user: User = new User();

    isCaseValid = true;
    isExpenseNatureValid = true;
    isLawFirmValid = true;
    isCourtValid = true;
    isCurrencyValid = true;

    successResponse: any;
    errorResponse: any;

    signin: boolean;

    formRegister: FormGroup;

    addPermission = false;
    isPayOrderShow = false;


    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(@Inject('IAuthService') private _authService: IAuthService,
        // private _brandService: BrandService, 
        private _adminSetupService: AdminSetupService,
        private _paymentService: PaymentService,
        private utilityService: UtilityService,
        private _uiServices: UIService,
        private route: ActivatedRoute,
        private _router: Router,
        public uiService: UIService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private datePipe: DatePipe,
    ) {

        this.formRegister = fb.group({
            'caseId': [this.newPayment.caseBasicId, Validators.compose([Validators.required])],
            'expenseNatureId': [this.newPayment.expenseNatureId, Validators.compose([Validators.required])],
            'lawFirmId': [this.newPayment.caseRecommendLawFirmPaymentTermDetailId, Validators.compose([])],
            'courtId': [this.newPayment.courtId, Validators.compose([])],
            'expenseAmount': [this.newPayment.expenseAmount, Validators.compose([Validators.required])],
            'currencyId': [this.newPayment.currencyId, Validators.compose([Validators.required])],
            'payOrderNo': [this.newPayment.payOrder, Validators.compose([])],
            'expenseDescription': [this.newPayment.expenseDescription, Validators.compose([Validators.required])],
            // 'file': [this.newPayment.documents, Validators.compose([])]
        });

        const sub = _router.events
            .takeUntil(this.ngUnsubscribe)
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    let id = null;
                    id = this.route.snapshot.params['id'];

                    // let id = this.route.snapshot.params['id'];

                    if (id) {
                        this.title = "Update";
                        this.paymentId = id;
                        console.log('id from constructor testing', id);
                        // this.brandDetails = new BrandCampaignListModel();
                        this.loadPaymentDetails(id);
                    }
                }
            });

        // this.countryCtrl = new FormControl();
        // this.filteredCountries = this.countryCtrl.valueChanges
        //     .startWith(null)
        //     .map(name => this.filterCountries(name));

        // this.regionCtrl = new FormControl();
        // this.filteredRegions = this.regionCtrl.valueChanges
        //     .startWith(null)
        //     .map(name => this.filterRegions(name));


    }

    ngOnInit(): void {
        this.user = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();

        let id = null;
        id = this.route.snapshot.params['id'];

        this.formRegister.reset();

        if (!this._authService.isLoggedIn()) {
            this._router.navigateByUrl('login');
        }

        this.addPermission = this.utilityService.checkUserPermission(this.user, 'add_users');
        if (this.addPermission) {

            this.loadCaseList();
            this.loadExpenseNatures();
            this.loadCurrencies();
            // this.loadCountries();

            if (!id || id == null || id == "") {
                // for (var index = 0; index < this.minBlackListEvents; index++) {
                //     let element = new Event();
                //     element.event = "";
                //     // var element = array[index];
                //     this.newPayment.blackListEvents.push(element);
                // }
            }
        }
        else {
            this._router.navigate(['/permission']);
        }

    }

    loadPaymentDetails(id) {
        console.log("id", id);

        this._uiServices.showSpinner();
        this._paymentService.getPaymentDetails(id).subscribe(
            (res) => {
                this._uiServices.hideSpinner();
                console.log("response Payment", res.json().data);

                this.paymentDetails = this._paymentService.mapPayment(res.json().data);

                // this.paymentForm = this.newPayment = this.mapPaymentForm(this.paymentDetails);
                this.paymentForm = this.newPayment = this.paymentDetails;

                this.isPayOrderShow = this.paymentDetails.genericStatus && this.paymentDetails.genericStatus.statusType == "APPROVED" ? true : false;

                if (this.isPayOrderShow) {
                    this.formRegister.get('payOrderNo').setValidators([Validators.required, Validators.maxLength(50)]);
                    this.formRegister.get('payOrderNo').updateValueAndValidity();
                }
                // let attachmentFilter = res.campaign.attachments;
                // attachmentFilter.filter((element, index) => {

                //     if (element.meta.type == "document") {
                //         this._documents.push({ extension: element.original.extension, link: element.original.url })
                //     }
                // })

                // console.log('respnse message', res.campaign.attachments);

                console.log("this.paymentDetails", this.paymentDetails);
                this.paymentForm = this.newPayment = this._paymentService.mapPayment(this.paymentDetails);

                console.log("paymentForm", this.paymentForm);
                // this.paymentForm = this.newPayment = this.paymentDetails;
                // this.paymentDetails.mediaUrls.forEach(element => {
                //     this.mediaLinksUrl.push(element.mediaUrl);
                // });



                //payment Description
                // if (this.paymentDetails.description && this.brandDetails.description.length > 450) {
                //     this.readMore = true;
                //     this.descriptionPartOne = this.brandDetails.description.substr(0, 450) + '...';
                //     this.descriptionPartTwo = this.brandDetails.description;
                // } else {
                //     this.descriptionPartOne = this.brandDetails.description;
                // }
            },
            (err) => {
                console.log("error", err);
                this._uiServices.hideSpinner();
            }
        )


    }

    loadCaseList() {


    }

    loadExpenseNatures() {
        this._adminSetupService.getExpenseNatures().subscribe(
            (res) => {
                this.expenseNatureList = res.json().data;
                // this.filterExpenseNatures('');
            },
            (err) => console.log(err)
        );
    }

    loadCurrencies() {
        this._adminSetupService.getCurrencies().subscribe(
            (res) => {
                this.currencies = res.json().data;
                // console.log('test111', res.json());
                // this.filterCurrencies('');
            },
            (err) => console.log(err)
        );
    }


    loadCourtsViaCase(id) {
        this._adminSetupService.getCourtsViaCaseId(id).subscribe(
            (res) => {
                this.courtList = [];
                let array = res.json().data;
                array.forEach(element => {
                    this.courtList.push(element.court);
                });
                this.isCourtValid = this.courtList.length > 0 ? true : false;
                // this.filterJurisdictions('');
            },
            (err) => console.log(err)
        );
    }


    loadRecommendLawfirmViaCase(id) {
    }

    pushFetchRecommendation(data) {
        console.log("pushFetchRecommendation data", data)
        this.lawFirmList = [];

        for (var index = 0; index < data.length; index++) {
            let element = new LawyerRecommend();

            // console.log("data", data[index]);

            element.lawFirmTableId = data[index].id;
            element.lawFirmId = data[index].lawFirm.id;
            element.lawFirm = data[index].lawFirm;
            element.lawFirmTypeId = data[index].lawFirmType.id;
            element.lawFirmType = data[index].lawFirmType;
            element.feeRangeTo = data[index].feeRangeTo;
            element.feeRangeFrom = data[index].feeRangeFrom;

            element.totalFee = data[index].paymentTerm && data[index].paymentTerm.length > 0 ? data[index].paymentTerm[0].totalFee : null;

            // element.currency = data[index].paymentTerm && data[index].paymentTerm.length > 0 && data[index].paymentTerm[0].currency ? data[index].paymentTerm[0].currency : new Currency();
            element.currency.id = data[index].paymentTerm && data[index].paymentTerm.length > 0 && data[index].paymentTerm[0].currency ? data[index].paymentTerm[0].currency.id : null;
            element.currency.displayName = data[index].paymentTerm && data[index].paymentTerm.length > 0 && data[index].paymentTerm[0].currency ? data[index].paymentTerm[0].currency.displayName : null;
            element.currency.codeName = data[index].paymentTerm && data[index].paymentTerm.length > 0 && data[index].paymentTerm[0].currency ? data[index].paymentTerm[0].currency.codeName : null;

            element.paymentTerm = data[index].paymentTerm && data[index].paymentTerm.length > 0 && data[index].paymentTerm[0].paymentTermOption ? data[index].paymentTerm[0].paymentTermOption : new PaymentTerm();
            element.milestone = data[index].paymentTerm && data[index].paymentTerm.length > 0 && data[index].paymentTerm[0].parentMilestone ? data[index].paymentTerm[0].parentMilestone : new Milestone();
            // element.paymentDetails = data[index].paymentTerm && data[index].paymentTerm.length > 0 && data[index].paymentTerm[0].paymentTermDetail.length > 0 ? data[index].paymentTerm[0].paymentTermDetail : [];



            element.paymentDetails = [];
            if (data[index].paymentTerm && data[index].paymentTerm.length > 0 && data[index].paymentTerm[0].paymentTermDetail.length > 0) {
                data[index].paymentTerm[0].paymentTermDetail.forEach(ptd => {
                    // let ele = this._caseService.mapMilestone(ptd);

                    // element.paymentDetails.push(ele);
                });
            }

            element.genericStatus = data[index].genericStatus;
            element.recommendationAction = data[index].recommendationAction;
            element.user = data[index].user;

            // this.lawyerRecommendationsAll.push(element);
            if (data[index] && data[index].genericStatus.statusType == "APPROVED" && data[index].isSelected) {
                this.lawFirmList.push(element);
            }
        }

        console.log('this.lawFirmList', this.lawFirmList);
    }

    onCaseFocusOut() {
        // this.paymentForm.caseBasicId = this.newPayment.caseBasicId = (this.newPayment.caseBasicId && this.newPayment.caseBasicId.length > 0 ? this.newPayment.caseBasicId.trim() : this.newPayment.caseBasicId);
        this.paymentForm.caseBasicId = this.newPayment.caseBasicId;
        if (this.paymentForm.expenseNature.expenseNatureCode == "lawfirm_fee") {

            if (this.paymentForm.caseBasicId) {
                this.paymentForm.caseRecommendLawFirmPaymentTermDetailId = this.newPayment.caseRecommendLawFirmPaymentTermDetailId = null;
                this.paymentForm.lawyerRecommend = this.newPayment.lawyerRecommend = new LawyerRecommend();
                this.loadRecommendLawfirmViaCase(this.paymentForm.caseBasicId);
            }
        }
        else if (this.paymentForm.expenseNature.expenseNatureCode == "court_fee") {
            if (this.paymentForm.caseBasicId) {
                this.paymentForm.courtId = this.newPayment.courtId = null;
                // this.paymentForm.court = this.newPayment.court = null;
                this.loadCourtsViaCase(this.paymentForm.caseBasicId);
            }
        }
        else {

        }
    }

    onExpenseNatureFocusOut() {
        // this.paymentForm.expenseNatureId = this.newPayment.expenseNatureId = (this.newPayment.expenseNatureId && this.newPayment.expenseNatureId.length > 0 ? this.newPayment.expenseNatureId.trim() : this.newPayment.expenseNatureId);
        this.paymentForm.expenseNatureId = this.newPayment.expenseNatureId;

        const expenseNature = this.expenseNatureList.filter(e => e.id === +this.paymentForm.expenseNatureId);

        if (expenseNature.length === 0) {
            // console.log("test1");
            // this.paymentForm.expenseNature = null;
            return;
        }
        else {
            // console.log("test2");
            this.paymentForm.expenseNatureId = this.newPayment.expenseNatureId = expenseNature[0].id;
            this.paymentForm.expenseNature = this.newPayment.expenseNature = expenseNature[0];

            console.log("this.paymentForm", this.paymentForm);



            if (this.paymentForm.expenseNature.expenseNatureCode == "lawfirm_fee") {

                if (this.paymentForm.caseBasicId) {
                    this.paymentForm.caseRecommendLawFirmPaymentTermDetailId = this.newPayment.caseRecommendLawFirmPaymentTermDetailId = null;
                    this.paymentForm.lawyerRecommend = this.newPayment.lawyerRecommend = new LawyerRecommend();
                    this.loadRecommendLawfirmViaCase(this.paymentForm.caseBasicId);
                }

                this.formRegister.get('lawFirmId').setValidators([Validators.required]);
                this.formRegister.get('lawFirmId').updateValueAndValidity();
                this.formRegister.get('courtId').setValidators([]);
                this.formRegister.get('courtId').updateValueAndValidity();
            }
            else if (this.paymentForm.expenseNature.expenseNatureCode == "court_fee") {
                if (this.paymentForm.caseBasicId) {
                    this.paymentForm.courtId = this.newPayment.courtId = null;
                    // this.paymentForm.court = this.newPayment.court = null;
                    this.loadCourtsViaCase(this.paymentForm.caseBasicId);
                }

                this.formRegister.get('lawFirmId').setValidators([]);
                this.formRegister.get('lawFirmId').updateValueAndValidity();
                this.formRegister.get('courtId').setValidators([Validators.required]);
                this.formRegister.get('courtId').updateValueAndValidity();
            }
            else {
                this.formRegister.get('lawFirmId').setValidators([]);
                this.formRegister.get('lawFirmId').updateValueAndValidity();
                this.formRegister.get('courtId').setValidators([]);
                this.formRegister.get('courtId').updateValueAndValidity();
            }

        }
    }

    onLawFirmFocusOut() {
        // this.paymentForm.currencyId = this.newPayment.currencyId = (this.newPayment.currencyId && this.newPayment.currencyId.length > 0 ? this.newPayment.currencyId.trim() : this.newPayment.currencyId);
        this.paymentForm.caseRecommendLawFirmPaymentTermDetailId = this.newPayment.caseRecommendLawFirmPaymentTermDetailId;
    }

    onCourtFocusOut() {
        // this.paymentForm.currencyId = this.newPayment.currencyId = (this.newPayment.currencyId && this.newPayment.currencyId.length > 0 ? this.newPayment.currencyId.trim() : this.newPayment.currencyId);
        this.paymentForm.courtId = this.newPayment.courtId;
    }

    onExpenseAmountFocusOut() {
        this.paymentForm.expenseAmount = this.newPayment.expenseAmount = (this.newPayment.expenseAmount && this.newPayment.expenseAmount.length > 0 ? this.newPayment.expenseAmount.trim() : this.newPayment.expenseAmount);
    }

    onCurrencyFocusOut() {
        // this.paymentForm.currencyId = this.newPayment.currencyId = (this.newPayment.currencyId && this.newPayment.currencyId.length > 0 ? this.newPayment.currencyId.trim() : this.newPayment.currencyId);
        this.paymentForm.currencyId = this.newPayment.currencyId;
    }

    onPayOrderFocusOut() {
        this.paymentForm.payOrder = this.newPayment.payOrder = (this.newPayment.payOrder && this.newPayment.payOrder.length > 0 ? this.newPayment.payOrder.trim() : this.newPayment.payOrder);
    }

    onExpenseDescriptionFocusOut() {
        this.paymentForm.expenseDescription = this.newPayment.expenseDescription = (this.newPayment.expenseDescription && this.newPayment.expenseDescription.length > 0 ? this.newPayment.expenseDescription.trim() : this.newPayment.expenseDescription);
    }

    onCountryFocusOut(countryId) {

        // if (this.paymentForm.countryId !== +this.newPayment.countryId) {
        //     const country = this.countries.filter(c => c.id === +this.newPayment.countryId);
        //     // const country = this.countries.filter(c => c.countryId === +countryId);

        //     this.newPayment.regionId = null;
        //     this.newPayment.cityId = null;

        //     this.regions = [];
        //     this.cities = [];

        //     if (country.length === 0) {
        //         // this.isCountryValid = false;
        //         this.newPayment.countryId = null;
        //         this.paymentForm.countryId = this.newPayment.countryId;

        //         this.newPayment.country = null;
        //         this.paymentForm.country = this.newPayment.country;
        //         return;
        //     }
        //     // this.isCountryValid = true;
        //     this.newPayment.countryId = country[0].id;
        //     this.paymentForm.countryId = this.newPayment.countryId;

        //     this.newPayment.country = country[0].countryName;
        //     this.paymentForm.country = this.newPayment.country;

        //     this.loadRegions(this.newPayment.countryId);
        // }
    }


    onSubmit() {

        console.log("this.newPayment", this.newPayment)
        console.log("this.paymentForm", this.paymentForm)
        console.log("this.formRegister.valid", this.formRegister)
        if (this.formRegister.valid) {

            // this.isSubmitStarted = true;
            this.isSubmitted = true;
            const msg = new Message();

            // for update
            if (this.paymentId) {
                this._paymentService.updatePayment(this.paymentForm).subscribe(
                    (res) => {
                        this.isSubmitted = false;

                        console.log("success", res);
                        // this._router.navigate(['/verification']);
                        msg.msg = res.json().message ? res.json().message : 'Successfully updated Payment';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiServices.showToast(msg, 'info');
                        this._router.navigate(['/payment/p/list']);
                    },
                    (err) => {
                        this.isSubmitted = false;
                        console.log("err", err);
                        this._authService.errStatusCheckResponse(err);
                    }
                );
            }
            // for create
            else {
                this._paymentService.createPayment(this.paymentForm).subscribe(
                    (res) => {
                        this.isSubmitted = false;
                        this.paymentId = this.paymentForm.id = res.json().data;

                        console.log("success", res);
                        // this._router.navigate(['/verification']);
                        msg.msg = res.json() ? res.json().message : 'Successfully created Payment';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiServices.showToast(msg, 'info');
                        // if (!this.parent) {
                        this._router.navigate(['/payment/p/list']);
                        // }

                    },
                    (err) => {
                        this.isSubmitted = false;
                        console.log("err", err);
                        this._authService.errStatusCheckResponse(err);
                    }
                );
            }
        }
        else {
            const msg = new Message();
            msg.msg = "Fill the required fields";
            msg.msgType = MessageTypes.Information;
            msg.autoCloseAfter = 400;
            this._uiServices.showToast(msg, '');
            // console.log("asd")
            this.validateAllFormFields(this.formRegister);
        }

    }

    onUpdatePayOrder() {

        console.log("this.newPayment", this.newPayment)
        console.log("this.paymentForm", this.paymentForm)
        console.log("this.formRegister.valid", this.formRegister)
        if (this.formRegister.valid) {

            // this.isSubmitStarted = true;
            this.isSubmitted = true;
            const msg = new Message();

            this._paymentService.updatePayOrderPayment(this.paymentId, this.paymentForm.payOrder).subscribe(
                (res) => {
                    this.isSubmitted = false;

                    console.log("success", res);
                    // this._router.navigate(['/verification']);
                    msg.msg = res.json().message ? res.json().message : 'Successfully updated Pay Order';
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiServices.showToast(msg, 'info');
                    this._router.navigate(['/payment/p/list']);
                },
                (err) => {
                    this.isSubmitted = false;
                    console.log("err", err);
                    this._authService.errStatusCheckResponse(err);
                }
            );
        }
        else {
            const msg = new Message();
            msg.msg = "Fill the required fields";
            msg.msgType = MessageTypes.Information;
            msg.autoCloseAfter = 400;
            this._uiServices.showToast(msg, '');
            // console.log("asd")
            this.validateAllFormFields(this.formRegister);
        }

    }

    validateAllFormFields(formGroup: FormGroup) {         //{1}
        Object.keys(formGroup.controls).forEach(field => {  //{2}
            const control = formGroup.get(field);             //{3}
            if (control instanceof FormControl) {             //{4}
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {        //{5}
                this.validateAllFormFields(control);            //{6}
            }
        });
    }

    resetForm(formGroup: FormGroup) {
        let control: AbstractControl = null;
        formGroup.reset();
        formGroup.markAsUntouched();
        Object.keys(formGroup.controls).forEach((name) => {
            control = formGroup.controls[name];
            control.setErrors(null);
        });
    }

}