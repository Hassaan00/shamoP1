import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { Message, MessageTypes } from '../../../core/models/message';
import { User } from '../../../core/models/user';
import { Case } from '../../../core/models/case';
import { Payment } from '../../../core/models/payment';
import { Currency } from '../../../core/models/currency';
import { Document } from '../../../core/models/document';
import { ExpenseNature } from '../../../core/models/expenseNature';
import { LawyerRecommend } from '../../../core/models/lawyerRecommend';
import { LawFirm } from '../../../core/models/lawFirm';
import { PaymentTerm } from '../../../core/models/paymentTerm';
import { Milestone } from '../../../core/models/milestone';
import { CaseCourt } from '../../../core/models/caseCourt';
import { AuctionSchedule } from '../../../core/models/auction';

import { IAuthService } from '../../../core/services/auth/iauth.service';
import { UIService } from '../../../core/services/ui/ui.service';
import { UtilityService } from '../../../core/services/general/utility.service';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { AdminSetupService } from '../../../core/services/admin/admin.setup.service';
import { FileService } from '../../../core/services/file/file.service';

import { ConfirmationDialogComponent } from '../../../shared/dialog-box/confirmation.dialog.component';
import { MessageDialogComponent } from '../../../shared/dialogs/message.dialoge.component';

import { Config } from '../../../config/config';

declare var libraryVar: any;

@Component({
    selector: 'payment-add',
    moduleId: module.id,
    templateUrl: 'payment.add.component.html',
    styleUrls: ['../payment.component.css'],
    providers: [
        DatePipe // this pipe is used to change date format
    ],
})
export class PaymentAddComponent implements OnInit, OnDestroy {

    private _sub: Subscription;
    title = "Add";
    isLogin: any;
    isSubmitted = false;

    paymentDetails: Payment = new Payment();
    newPayment: Payment = new Payment();
    paymentForm: Payment = new Payment();
    paymentId: number;

    // newPaymentForm: Payment = new Payment();

    caseList: Case[] = [];
    expenseNatureList: ExpenseNature[] = [];
    lawFirmList: LawyerRecommend[] = [];
    aucScheduleList: AuctionSchedule[] = [];
    lawFirmPaymentTermDetails: any[] = [];
    caseCourtList: CaseCourt[] = [];
    currencies: Currency[] = [];
    user: User = new User();

    isCaseValid = true;
    isExpenseNatureValid = true;
    isLawFirmValid = true;
    isAuctionValid = true;
    isCourtValid = true;
    isCurrencyValid = true;

    isShowUpload = true;

    successResponse: any;
    errorResponse: any;

    signin: boolean;

    formRegister: FormGroup;

    addPermission = false;
    updatePermission = false;
    savePayOrderPermission = false;
    isPayOrderShow = false;
    isDisabled = false;

    auctionInfo: AuctionSchedule = new AuctionSchedule();
    // auctionInfo = {
    //     id: 0,
    //     auctionFee: 0,
    //     currencyName: '',
    //     auctionSystemNumber: ''
    // };
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
        private _fileService: FileService,
    ) {

        this.formRegister = fb.group({
            'caseId': [this.newPayment.caseBasicId, Validators.compose([Validators.required])],
            'expenseNatureId': [this.newPayment.expenseNatureId, Validators.compose([Validators.required])],
            'auctionId': [this.newPayment.lawFirmId, Validators.compose([])],
            'lawFirmId': [this.newPayment.lawFirmId, Validators.compose([])],
            'lawFirmPaymentDetailId': [this.newPayment.caseRecommendLawFirmPaymentTermDetailId, Validators.compose([])],
            'caseCourtId': [this.newPayment.caseCourtId, Validators.compose([])],
            'expenseAmount': [this.newPayment.expenseAmount, Validators.compose([Validators.required])],
            'currencyId': [this.newPayment.currencyId, Validators.compose([Validators.required])],
            'payOrderNo': [this.newPayment.payOrder, Validators.compose([])],
            'payOrderDispatchDate': [this.newPayment.payOrderDispatchDate, Validators.compose([])],
            'payOrderDate': [this.newPayment.payOrderDate, Validators.compose([])],
            'expenseDescription': [this.newPayment.expenseDescription, Validators.compose([Validators.required])],
            // 'file': [this.newPayment.documents, Validators.compose([])]
        });

        // const sub = _router.events
        this._sub = _router.events
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

        this.addPermission = this.utilityService.checkUserPermission(this.user, 'case_expense_add');
        this.updatePermission = this.utilityService.checkUserPermission(this.user, 'case_expense_update');
        this.savePayOrderPermission = this.utilityService.checkUserPermission(this.user, 'case_expense_payorder_save');
        // if ((!id && this.addPermission) || (id && id != null && id != "" && this.updatePermission)) {

        // this.loadCaseList();

        this.loadExpenseNatures();
        this.loadCurrencies();
        // this.loadCountries();

        if (id && id != null && id != "") {
            this.loadPaymentDetails(id);
        }
        // if (!id || id == null || id == "") {
        // for (var index = 0; index < this.minBlackListEvents; index++) {
        //     let element = new Event();
        //     element.event = "";
        //     // var element = array[index];
        //     this.newPayment.blackListEvents.push(element);
        // }
        // }

        // }
        // else {
        //     this._router.navigate(['/permission']);
        // }

    }

    loadPaymentDetails(id) {
        console.log("id", id);

        this._uiServices.showSpinner();
        this._paymentService.getPaymentDetails(id).subscribe(
            (res) => {
                this._uiServices.hideSpinner();
                console.log("response Payment", res.json().data);

                this.paymentForm = this.newPayment = this.paymentDetails = this._paymentService.mapPayment(res.json().data);
                // this.paymentForm = this.newPayment = this._paymentService.mapPayment(this.paymentDetails);

                // this.paymentForm = this.newPayment = this.mapPaymentForm(this.paymentDetails);
                // this.paymentForm = this.newPayment = this.paymentDetails;

                this.isPayOrderShow = this.paymentDetails.genericStatus && this.paymentDetails.genericStatus.statusType == "APPROVED" ? true : false;

                if (this.isPayOrderShow) {
                    this.formRegister.get('payOrderNo').setValidators([Validators.required, Validators.maxLength(50)]);
                    this.formRegister.get('payOrderNo').updateValueAndValidity();

                    this.formRegister.controls['expenseAmount'].disable();
                    this.formRegister.controls['expenseDescription'].disable();

                }

                if (this.paymentForm.expenseNature.expenseNatureCode == "auction_fee") {


                    // if (this.paymentForm.caseBasicId && this.paymentForm.auctionScheduleId) {
                    if (this.paymentForm.caseBasicId) {
                        this.loadAuctionScheduleViaCaseId(this.paymentForm.caseBasicId, true);
                    }
                }
                if (this.paymentForm.expenseNature.expenseNatureCode == "lawfirm_fee") {

                    if (this.paymentForm.caseBasicId) {
                        // this.paymentForm.lawFirmId = this.newPayment.lawFirmId = null;
                        // this.paymentForm.lawFirm = this.newPayment.lawFirm = null;
                        this.loadRecommendLawfirmViaCase(this.paymentForm.caseBasicId);
                    }
                }
                if (this.paymentForm.expenseNature.expenseNatureCode == "court_fee") {
                    if (this.paymentForm.caseBasicId) {
                        // this.paymentForm.courtId = this.newPayment.courtId = null;
                        // this.paymentForm.court = this.newPayment.court = null;
                        this.loadCourtsViaCase(this.paymentForm.caseBasicId);
                    }
                }
                // let attachmentFilter = res.campaign.attachments;
                // attachmentFilter.filter((element, index) => {

                //     if (element.meta.type == "document") {
                //         this._documents.push({ extension: element.original.extension, link: element.original.url })
                //     }
                // })

                // console.log('respnse message', res.campaign.attachments);

                console.log("this.paymentDetails", this.paymentDetails);


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
                this._authService.errStatusCheckResponse(err);
            }
        )


    }

    loadCaseList() {

        const msg = new Message();


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
                this.caseCourtList = [];
                let array = res.json().data;
                array.forEach(element => {
                    // this.caseCourtList.push(element.court);
                    this.caseCourtList.push(element);
                });
                this.isCourtValid = this.caseCourtList.length > 0 ? true : false;
                // this.filterJurisdictions('');
            },
            (err) => {
                console.log(err)
                this._authService.errStatusCheckResponse(err);
            });
    }

    loadAuctionScheduleViaCaseId(id, dataExist = false) {

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

    onCaseClick_old() {

        if (this.newPayment.documents.length > 0) {
            const msg = "If you change the case, document will discarded."
            const dialogRef = this.dialog.open(MessageDialogComponent, {
                width: '450px',
                data: { value: "", msg: msg }
            });
            dialogRef.afterClosed().subscribe(result => {

            });
        }

    }

    onCaseClick() {

        if (this.newPayment.documents.length > 0) {
            const msg = "If you change the case, document will discarded."
            const dialogRef = this.dialog.open(MessageDialogComponent, {
                width: '450px',
                data: { value: "", msg: msg }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.openCaseDialoge();
            });
        }
        else {
            this.openCaseDialoge();
        }

    }

    openCaseDialoge() {
        console.log("openCaseDialoge")
    }

    onCaseFocusOut() {
        // this.paymentForm.caseBasicId = this.newPayment.caseBasicId = (this.newPayment.caseBasicId && this.newPayment.caseBasicId.length > 0 ? this.newPayment.caseBasicId.trim() : this.newPayment.caseBasicId);
        this.paymentForm.caseBasicId = this.newPayment.caseBasicId;
        this.paymentForm.documents = this.newPayment.documents = [];
        if (this.paymentForm.expenseNature.expenseNatureCode == "auction_fee") {

            if (this.paymentForm.caseBasicId) {
                this.paymentForm.auctionScheduleId = this.newPayment.auctionScheduleId = null;
                this.auctionInfo = new AuctionSchedule();
                this.loadAuctionScheduleViaCaseId(this.paymentForm.caseBasicId, false);
            }
        }
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
                this.paymentForm.caseCourtId = this.newPayment.caseCourtId = null;
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



        this.paymentForm.caseRecommendLawFirmPaymentTermDetailId = this.newPayment.caseRecommendLawFirmPaymentTermDetailId = null;
        this.paymentForm.lawyerRecommend = this.newPayment.lawyerRecommend = new LawyerRecommend();
        this.paymentForm.lawFirm = this.newPayment.lawFirm = new LawFirm();
        this.paymentForm.lawFirmId = this.newPayment.lawFirmId = null;

        this.paymentForm.caseCourtId = this.newPayment.caseCourtId = null;
        this.paymentForm.courtId = this.newPayment.courtId = null;
        this.paymentForm.caseCourt = this.newPayment.caseCourt = new CaseCourt();

        this.paymentForm.auctionScheduleId = this.newPayment.auctionScheduleId = null;
        this.auctionInfo = new AuctionSchedule();

        const expenseNature = this.expenseNatureList.filter(e => e.id === +this.paymentForm.expenseNatureId);

        if (expenseNature.length === 0) {
            // console.log("test1");
            this.paymentForm.expenseNatureId = this.newPayment.expenseNatureId = null;
            this.paymentForm.expenseNature = this.newPayment.expenseNature = new ExpenseNature();

            return;
        }
        else {
            // console.log("test2");
            this.paymentForm.expenseNatureId = this.newPayment.expenseNatureId = expenseNature[0].id;
            this.paymentForm.expenseNature = this.newPayment.expenseNature = expenseNature[0];

            console.log("this.paymentForm", this.paymentForm);

            if (this.paymentForm.expenseNature.expenseNatureCode == "auction_fee") {

                if (this.paymentForm.caseBasicId) {
                    this.loadAuctionScheduleViaCaseId(this.paymentForm.caseBasicId, false);
                }

                this.formRegister.get('lawFirmId').setValidators([]);
                this.formRegister.get('lawFirmId').updateValueAndValidity();
                this.formRegister.get('lawFirmPaymentDetailId').setValidators([]);
                this.formRegister.get('lawFirmPaymentDetailId').updateValueAndValidity();
                this.formRegister.get('caseCourtId').setValidators([]);
                this.formRegister.get('caseCourtId').updateValueAndValidity();
            }


            if (this.paymentForm.expenseNature.expenseNatureCode == "lawfirm_fee") {

                if (this.paymentForm.caseBasicId) {
                    this.loadRecommendLawfirmViaCase(this.paymentForm.caseBasicId);
                }

                this.formRegister.get('lawFirmId').setValidators([Validators.required]);
                this.formRegister.get('lawFirmId').updateValueAndValidity();
                this.formRegister.get('lawFirmPaymentDetailId').setValidators([Validators.required]);
                this.formRegister.get('lawFirmPaymentDetailId').updateValueAndValidity();
                this.formRegister.get('caseCourtId').setValidators([]);
                this.formRegister.get('caseCourtId').updateValueAndValidity();
            }
            else if (this.paymentForm.expenseNature.expenseNatureCode == "court_fee") {
                if (this.paymentForm.caseBasicId) {
                    this.loadCourtsViaCase(this.paymentForm.caseBasicId);
                }

                this.formRegister.get('lawFirmId').setValidators([]);
                this.formRegister.get('lawFirmId').updateValueAndValidity();
                this.formRegister.get('lawFirmPaymentDetailId').setValidators([]);
                this.formRegister.get('lawFirmPaymentDetailId').updateValueAndValidity();
                this.formRegister.get('caseCourtId').setValidators([Validators.required]);
                this.formRegister.get('caseCourtId').updateValueAndValidity();
            }
            else {

                this.formRegister.get('lawFirmId').setValidators([]);
                this.formRegister.get('lawFirmId').updateValueAndValidity();
                this.formRegister.get('lawFirmPaymentDetailId').setValidators([]);
                this.formRegister.get('lawFirmPaymentDetailId').updateValueAndValidity();
                this.formRegister.get('caseCourtId').setValidators([]);
                this.formRegister.get('caseCourtId').updateValueAndValidity();
            }

        }
    }

    onLawFirmFocusOut() {
        // this.paymentForm.currencyId = this.newPayment.currencyId = (this.newPayment.currencyId && this.newPayment.currencyId.length > 0 ? this.newPayment.currencyId.trim() : this.newPayment.currencyId);
        this.paymentForm.lawFirmId = this.newPayment.lawFirmId;
        // this.paymentForm.caseRecommendLawFirmPaymentTermDetailId = this.newPayment.caseRecommendLawFirmPaymentTermDetailId;
        this.lawFirmPaymentTermDetails = [];
        const lawFirm = this.lawFirmList.filter(e => e.lawFirmId === +this.paymentForm.lawFirmId);

        if (lawFirm.length === 0) {

            return;
        }
        else {
            console.log("lawFirm", lawFirm);
            this.paymentForm.lawFirmId = this.newPayment.lawFirmId = lawFirm[0].lawFirm.id;
            this.paymentForm.lawyerRecommend.lawFirm = this.newPayment.lawyerRecommend.lawFirm = lawFirm[0].lawFirm;
            this.lawFirmPaymentTermDetails = lawFirm[0].paymentDetails;
        }
        console.log("this.lawFirmPaymentTermDetails", this.lawFirmPaymentTermDetails);
    }

    onPaymentDetailFocusOut() {
        if (this.newPayment.caseRecommendLawFirmPaymentTermDetailId) {
            // const lawFirm = this.lawFirmList.filter(e => e.lawFirmId === +this.paymentForm.lawFirmId);
            const pd = this.lawFirmPaymentTermDetails.filter(e => e.milestoneTableId === +this.newPayment.caseRecommendLawFirmPaymentTermDetailId);

            if (pd.length === 0) {
                this.newPayment.expenseAmount = null;
                return;
            }
            else {
                console.log("pd", pd);
                // this.newPayment.expenseAmount = pd[0].percentage;
                this.newPayment.expenseAmount = pd[0].value;

                // this.paymentForm.lawFirmId = this.newPayment.lawFirmId = lawFirm[0].lawFirm.id;
                // this.paymentForm.lawyerRecommend.lawFirm = this.newPayment.lawyerRecommend.lawFirm = lawFirm[0].lawFirm;
                // this.lawFirmPaymentTermDetails = lawFirm[0].paymentDetails;
            }
        }
        else {

        }
    }

    onCourtFocusOut() {
        // this.paymentForm.currencyId = this.newPayment.currencyId = (this.newPayment.currencyId && this.newPayment.currencyId.length > 0 ? this.newPayment.currencyId.trim() : this.newPayment.currencyId);
        this.paymentForm.caseCourtId = this.newPayment.caseCourtId;

        console.log("this.paymentForm.caseCourtId", this.paymentForm.caseCourtId);
    }

    onAuctionFocusOut(dataExist = false) {

        const auction = this.aucScheduleList.filter(as => as.id === +this.newPayment.auctionScheduleId);

        if (auction.length === 0) {

            this.auctionInfo = new AuctionSchedule();
            console.log("auctionInfo", this.auctionInfo);
            if (!dataExist) {
                this.paymentForm.expenseAmount = this.newPayment.expenseAmount = this.auctionInfo.auctionFee;
                this.paymentForm.auctionScheduleId = this.newPayment.auctionScheduleId = this.auctionInfo.id;
            }

            return;
        }
        else {
            this.auctionInfo = auction[0];
            if (!dataExist) {
                this.paymentForm.expenseAmount = this.newPayment.expenseAmount = this.auctionInfo.auctionFee;
                this.paymentForm.auctionScheduleId = this.newPayment.auctionScheduleId = this.auctionInfo.id;
            }
        }
    }

    onExpenseAmountFocusOut() {

        console.log("onExpenseAmountFocusOut");
        this.paymentForm.expenseAmount = this.newPayment.expenseAmount;
        if (this.paymentForm.expenseNature.expenseNatureCode === 'auction_fee' && +this.auctionInfo.auctionFee !== 0) {
            if (this.newPayment.expenseAmount && this.newPayment.expenseAmount.length > 0) {
                const amount = this.newPayment.expenseAmount.trim();
                this.formRegister.get('expenseAmount').updateValueAndValidity();

                if (parseInt(amount) !== +this.auctionInfo.auctionFee) {
                    this.formRegister.controls.expenseAmount.setErrors({ notEqual: true });
                }
            }

        }
        if (this.paymentForm.expenseNature.expenseNatureCode === 'lawfirm_fee' && this.newPayment.caseRecommendLawFirmPaymentTermDetailId) {

            const pd = this.lawFirmPaymentTermDetails.filter(e => e.milestoneTableId === +this.newPayment.caseRecommendLawFirmPaymentTermDetailId);

            if (this.newPayment.expenseAmount && this.newPayment.expenseAmount.length > 0 && pd.length > 0) {
                const amount = this.newPayment.expenseAmount.trim();
                this.formRegister.get('expenseAmount').updateValueAndValidity();

                if (parseInt(amount) !== +pd[0].value) {
                    this.formRegister.controls.expenseAmount.setErrors({ notEqualLf: true });
                }
            }

        }
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

    attachID(value) {
        console.log("value value", value);
        // this.newPayment.documents = [];
        let docs = [];
        if (value && value.length > 0) {
            value.forEach(element => {
                // this.newPayment.documents.push(this._fileService.mapDocument(element));
                docs.push(this._fileService.mapDocument(element));
            });
        }

        this.paymentForm.documents = this.newPayment.documents = docs;
        // this.newPayment.documents.push(value)
        // this._attachments.push(value);
        // console.log('final ids', this.fileIds);

    }

    dateChanged(event, type) {
        console.log('event', event.value);
        console.log('type', type);

        if (type == 'dispatchDate') {
            this.paymentForm.payOrderDispatchDate = this.datePipe.transform(this.newPayment.payOrderDispatchDate, 'yyyy-MM-dd');
            console.log('event', this.paymentForm.payOrderDispatchDate);
        }
        if (type == 'payOrderDate') {
            this.paymentForm.payOrderDate = this.datePipe.transform(this.newPayment.payOrderDate, 'yyyy-MM-dd');
            console.log('event', this.paymentForm.payOrderDate);
        }
    }

    confirmDialog(btn) {
        let msg;
        let obj;
        if (btn === 'save') {
            obj = 'Submit Details';
            msg = 'Are you sure you want to submit these details?';
        } else if (btn === 'payorder_update') {
            obj = 'Pay Order Details';
            msg = 'Are you sure you want to submit these details?';
        }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: { message: msg, obj: obj }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close', result);
            if (result && btn === 'save') {
                this.onSubmit();
            }
            if (result && btn === 'payorder_update') {
                this.onUpdatePayOrder();
            }
        });
    }

    onSubmit() {
        const msg = new Message();
        this._uiServices.showSpinner();
        // console.log("this.newPayment", this.newPayment);
        // console.log("this.paymentForm", this.paymentForm);
        // console.log("this.formRegister.valid", this.formRegister);

        if ((this.addPermission) || (this.paymentId && this.updatePermission)) {
            this.paymentForm = this.newPayment;
            if (this.formRegister.valid) {

                // this.isSubmitStarted = true;
                this.isSubmitted = true;

                // for update
                if (this.paymentId) {
                    if (this.updatePermission) {
                        this._paymentService.updatePayment(this.paymentForm).subscribe(
                            (res) => {
                                console.log("success res", res);
                                this.isSubmitted = false;
                                this._uiServices.hideSpinner();

                                // this._router.navigate(['/verification']);
                                msg.msg = res.json().message ? res.json().message : 'Successfully updated Payment';
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiServices.showToast(msg, 'info');
                                this._router.navigate(['/payment/p/list']);
                            },
                            (err) => {
                                console.log("err", err);
                                this.isSubmitted = false;
                                this._uiServices.hideSpinner();
                                this._authService.errStatusCheckResponse(err);
                            }
                        );
                    }
                    else {
                        this._uiServices.hideSpinner();
                        this.isSubmitted = false;
                        let msg = this.utilityService.permissionMsg();
                        this._uiServices.showToast(msg, '');
                    }
                }
                // for create
                else {
                    if (this.addPermission) {
                        this._paymentService.createPayment(this.paymentForm).subscribe(
                            (res) => {
                                console.log("success res", res);
                                this.isSubmitted = false;
                                this._uiServices.hideSpinner();
                                this.paymentId = this.paymentForm.id = res.json().data;

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
                                console.log("err", err);
                                this.isSubmitted = false;
                                this._uiServices.hideSpinner();
                                this._authService.errStatusCheckResponse(err);
                            }
                        );
                    }
                    else {
                        this._uiServices.hideSpinner();
                        this.isSubmitted = false;
                        let msg = this.utilityService.permissionMsg();
                        this._uiServices.showToast(msg, '');
                    }
                }
            }
            else {
                this._uiServices.hideSpinner();

                msg.msg = "Fill the required fields";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiServices.showToast(msg, '');
                // console.log("asd")
                this.validateAllFormFields(this.formRegister);
            }
        }
        else {
            this._uiServices.hideSpinner();
            let msg = this.utilityService.permissionMsg();
            this._uiServices.showToast(msg, '');
        }

    }

    onUpdatePayOrder() {
        const msg = new Message();
        this._uiServices.showSpinner();
        // console.log("this.newPayment", this.newPayment);
        // console.log("this.paymentForm", this.paymentForm);
        // console.log("this.formRegister.valid", this.formRegister);
        if (this.savePayOrderPermission) {
            if (this.formRegister.valid) {

                // this.isSubmitStarted = true;
                this.isSubmitted = true;

                // this._paymentService.updatePayOrderPayment(this.paymentId, this.paymentForm.payOrder).subscribe(
                this._paymentService.updatePayOrderPayment(this.paymentId, this.paymentForm).subscribe(
                    (res) => {
                        console.log("success res", res);
                        this.isSubmitted = false;
                        this._uiServices.hideSpinner();

                        // this._router.navigate(['/verification']);
                        msg.msg = res.json().message ? res.json().message : 'Successfully updated Pay Order';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiServices.showToast(msg, 'info');
                        this._router.navigate(['/payment/p/list']);
                    },
                    (err) => {
                        console.log("err", err);
                        this.isSubmitted = false;
                        this._uiServices.hideSpinner();
                        this._authService.errStatusCheckResponse(err);
                    }
                );
            }
            else {
                this._uiServices.hideSpinner();

                msg.msg = "Fill the required fields";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiServices.showToast(msg, '');
                // console.log("asd")
                this.validateAllFormFields(this.formRegister);
            }

        }
        else {
            this._uiServices.hideSpinner();
            let msg = this.utilityService.permissionMsg();
            this._uiServices.showToast(msg, '');
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

    ngOnDestroy(): void {
        if (this._sub) {
            this._sub.unsubscribe();
        }
    }
}