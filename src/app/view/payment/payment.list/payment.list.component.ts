import { Component, Input, OnInit, Inject, OnChanges, Output, EventEmitter, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Message, MessageTypes } from '../../../core/models/message';
import { User } from '../../../core/models/user';
// import { Case } from '../../core/models/case';
import { Payment } from '../../../core/models/payment';


import { UIService } from '../../../core/services/ui/ui.service';
import { IAuthService } from '../../../core/services/auth/iauth.service';
import { AdminService } from '../../../core/services/admin/admin.service';
import { UtilityService } from '../../../core/services/general/utility.service';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { ConfirmationDialogComponent } from '../../../shared/dialog-box/confirmation.dialog.component';

declare var libraryVar: any;

@Component({
    selector: 'payment-list',
    moduleId: module.id,
    templateUrl: 'payment.list.component.html',
    styleUrls: ['../payment.component.css']
})

export class PaymentListComponent implements OnInit, OnChanges, OnDestroy {

    user: User;
    // country = new CountryInfo();
    isLogin: boolean;
    paymentList: Payment[] = [];
    private ngUnsubscribe: Subject<any> = new Subject();

    paymentListPermission = false;
    addPermission = false;
    updatePermission = false;
    deletePermission = false;
    approvePaymentPermission = false;
    disApprovePaymentPermission = false;

    listFilter: string;

    displayedColumns = ['sNo', 'caseNo', 'nature', 'amount', 'status', 'action'];
    dataSource = new MatTableDataSource<Payment>(this.paymentList);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    isSpinner = false;
    filter: string = "";
    pageEvent: PageEvent;
    pageIndex: number = 0;
    pageSize: number = 10; // by default
    length: number = 0;
    pageSizeOptions = [5, 10, 25, 50, 100];
    // pageSizeOptions = [10];
    upperLimit = 0;

    currentURL: string;

    constructor(@Inject('IAuthService') private _authService: IAuthService,
        private _uiService: UIService,
        // private _utility: UtilityService,
        private route: ActivatedRoute,
        private _router: Router,
        private _formBuilder: FormBuilder,
        // private _countryService: CountryService, 
        private utilityService: UtilityService,
        public dialog: MatDialog,
        // private _brandService: BrandService, 
        private _adminService: AdminService,
        // private _caseService: CaseService,
        private _paymentService: PaymentService,
    ) {
        this.currentURL = window.location.href;
    }

    ngOnInit(): void {

        this.user = this._authService.getUser();
        // check if a user is logged in
        this.isLogin = this._authService.isLoggedIn();
        // if (!this._authService.isLoggedIn()) {
        //     this._router.navigateByUrl('login');
        // }



        this.paymentListPermission = this.utilityService.checkUserPermission(this.user, 'case_expense_list');
        // this.paymentPermission = true;
        if (this.paymentListPermission) {
            this.addPermission = this.utilityService.checkUserPermission(this.user, 'case_expense_add');
            this.updatePermission = this.utilityService.checkUserPermission(this.user, 'case_expense_update');
            // this.deletePermission = this.utilityService.checkUserPermission(this.user, 'delete_user');

            this.approvePaymentPermission = this.utilityService.checkUserPermission(this.user, 'case_expense_approve');
            this.disApprovePaymentPermission = this.utilityService.checkUserPermission(this.user, 'case_expense_reject');

            // console.log('this is a payment page');
            this.loadPaymentList();
        }
        else {
            this._router.navigate(['/permission']);
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    refreshList() {
        // if (this.paymentListPermission) {
        this.isSpinner = true;
        this.filter = "";
        this.dataSource.filter = null;
        this.loadPaymentList();
        // }
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    ngOnDestroy() {
        this.ngUnsubscribe.unsubscribe();
    }

    callPaginator(page) {
        console.log('Pagination Object:', page);
        if (page.pageSize) {
            this.pageSize = page.pageSize;
        }
        this.onPageChange(page.pageIndex);
    }

    onPageChange(pageNumber) {
        let offset = 0;
        const limit = this.pageSize;

        if (pageNumber) {
            offset = pageNumber * this.pageSize;
            this.upperLimit = pageNumber * this.pageSize + 1;

        }
        offset = pageNumber * this.pageSize;
        offset++;
        console.log('offset', offset, 'limit', limit);
        // this.searchObj.limitValue = limit;
        // this.searchObj.offsetValue = offset;
    }


    loadPaymentList_old() {
        if (this.paymentListPermission) {
            this.isSpinner = true;

            const msg = new Message();
            this._paymentService.getPaymentList().subscribe(
                (res) => {
                    // this.paymentList = res.json();
                    this.isSpinner = false;
                    let array = res.json().data;
                    // let array = res;
                    console.log('res list:', array);
                    var lFList = [];
                    for (let i = 0; i < array.length; i++) {
                        let u = this._paymentService.mapPayment(array[i]);
                        lFList.push(u);
                    }
                    this.paymentList = lFList;

                    this.dataSource = new MatTableDataSource<Payment>(this.paymentList);
                    this.dataSource.paginator = this.paginator;
                    // console.log('user list:', this.paymentList);

                    if (this.paymentList.length == 0) {
                        msg.msg = 'No Payment Found';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiService.showToast(msg, 'info');
                    }

                },
                (err) => {
                    console.log(err);
                    this._authService.errStatusCheckResponse(err);
                    this.isSpinner = false;
                }
            );
        }
        else {
            this.isSpinner = false;
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    pageChangeEvent(event?: PageEvent) {

        console.log("getServerData event", event);

        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadPaymentList();

    }

    loadPaymentList() {
        const msg = new Message();
        this.paymentList = [];
        this.dataSource = new MatTableDataSource<Payment>(this.paymentList);

        if (this.paymentListPermission) {
            this.isSpinner = true;

            this._paymentService.getPaymentListCount().subscribe(
                (res) => {

                    this.length = res.json().data;


                    this._paymentService.getPaymentListPagination(this.pageIndex, this.pageSize).subscribe(
                        (res) => {
                            // this.paymentList = res.json();
                            this.isSpinner = false;
                            let array = res.json().data;
                            // let array = res;
                            console.log('res list:', array);
                            var lFList = [];
                            for (let i = 0; i < array.length; i++) {
                                let u = this._paymentService.mapPayment(array[i]);
                                lFList.push(u);
                            }
                            this.paymentList = lFList;

                            this.dataSource = new MatTableDataSource<Payment>(this.paymentList);
                            // this.dataSource.paginator = this.paginator;
                            // console.log('user list:', this.paymentList);

                            if (this.paymentList.length == 0) {
                                msg.msg = 'No Payment Found';
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiService.showToast(msg, 'info');
                            }

                        },
                        (err) => {
                            console.log(err);
                            this.dataSource = new MatTableDataSource<Payment>(this.paymentList);
                            this._authService.errStatusCheckResponse(err);
                            this.isSpinner = false;
                        }
                    );

                },
                (err) => {
                    console.log(err);
                    this._authService.errStatusCheckResponse(err);
                    this.isSpinner = false;
                }
            );


        }
        else {
            this.isSpinner = false;
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    openConfirmDialog(payment, index, btn) {

        let msg;
        let obj;
        if (btn === 'approve') {
            obj = 'Approve Payment';
            msg = 'Are you sure you want to approve this payment?';
        } else
            if (btn === 'reject') {
                obj = 'Reject Payment';
                msg = 'Are you sure you want to reject this payment?';
            }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: { message: msg, obj: obj }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close', result);
            if (result && btn === 'approve') {
                this.approvePayment(payment, index);
            }

            if (result && btn === 'reject') {
                this.rejectPayment(payment, index);
            }
        });
    }

    approvePayment(payment, index) {
        const msg = new Message();
        this._uiService.showSpinner();
        this.paymentList[index].isApproveDisabled = true;

        if (this.approvePaymentPermission) {

            this._paymentService.approvePayment(payment.id).subscribe(
                (res) => {
                    this._uiService.hideSpinner();
                    // this.paymentList = res.json();
                    // console.log('payment list:', this.paymentList);
                    this.paymentList[index].isApproveDisabled = false;
                    msg.msg = res.json() ? res.json().message : 'You have successfully approved payment';
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, 'info');
                    this.refreshList();
                },
                (err) => {
                    console.log(err);
                    this._uiService.hideSpinner();
                    this.paymentList[index].isApproveDisabled = false;
                    this._authService.errStatusCheckResponse(err);
                }
            );
        }
        else {
            this._uiService.hideSpinner();
            this.paymentList[index].isApproveDisabled = false;
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    rejectPayment(payment, index) {
        const msg = new Message();
        this._uiService.showSpinner();
        this.paymentList[index].isDisapproveDisabled = true;

        if (this.disApprovePaymentPermission) {

            this._paymentService.rejectPayment(payment.id).subscribe(
                (res) => {
                    this._uiService.hideSpinner();
                    // this.paymentList = res.json();
                    // console.log('payment list:', this.paymentList);
                    this.paymentList[index].isDisapproveDisabled = false;
                    msg.msg = res.json() ? res.json().message : 'You have successfully rejected payment';
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, 'info');
                    this.refreshList();
                },
                (err) => {
                    console.log(err);
                    this._uiService.hideSpinner();
                    this.paymentList[index].isDisapproveDisabled = false;
                    this._authService.errStatusCheckResponse(err);
                }
            );
        }
        else {
            this._uiService.hideSpinner();
            this.paymentList[index].isDisapproveDisabled = false;
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    editPayment(data) {
        console.log("data", data)
        if (this.updatePermission) {
            this._router.navigate(['/payment/p/update/', data.id]);
        }
        else {
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

}




