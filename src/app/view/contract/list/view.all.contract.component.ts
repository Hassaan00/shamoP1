import { Component, Input, OnInit, Inject, OnChanges, Output, EventEmitter, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Message, MessageTypes } from '../../../core/models/message';
import { User } from '../../../core/models/user';

import { UIService } from '../../../core/services/ui/ui.service';
import { UtilityService } from '../../../core/services/general/utility.service';
import { IAuthService } from '../../../core/services/auth/iauth.service';
import { Contract, ContractType } from '../../../core/models/contract.model';
import { ContractService } from '../../../core/services/contract/contract.service';


@Component({
    selector: 'view-all-contract',
    templateUrl: 'view.all.contract.component.html',
})
export class ContractListComponent implements OnInit, OnChanges, OnDestroy {

    user: User;
    isLogin: boolean;
    contracts = new Array<Contract>();
    private ngUnsubscribe: Subject<any> = new Subject();

    listPermission = false;
    createPagePermission = false;
    detailPagePermission = false;
    renewContractPermission = false;
    terminatePermission = false;
    addPermission = false;
    updatePermission = false;
    deletePermission = false;

    listFilter: string;

    displayedColumns = ['sNo', 'title', 'party', 'type', 'start', 'expiry', 'cAction'];
    dataSource = new MatTableDataSource<Contract>(this.contracts);
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

    constructor(
        private _uiService: UIService,
        private utilityService: UtilityService,
        private _router: Router,
        @Inject('IAuthService') private _authService: IAuthService,
        private _contractService: ContractService,
        public dialog: MatDialog,
    ) {

    }

    ngOnInit(): void {

        this.user = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();

        this.listPermission = this.utilityService.checkUserPermission(this.user, 'contract_list');
        if (this.listPermission) {

            // this.createPagePermission = this.utilityService.checkUserPermission(this.user, 'contract_create_page');
            this.createPagePermission = true;

            this.addPermission = this.utilityService.checkUserPermission(this.user, 'contract_add');
            // this.addPermission = true;

            this.updatePermission = this.utilityService.checkUserPermission(this.user, 'contract_edit');
            // this.updatePermission = true;

            // this.detailPagePermission = this.utilityService.checkUserPermission(this.user, 'contract_create_page');
            this.detailPagePermission = true;

            this.renewContractPermission = this.utilityService.checkUserPermission(this.user, 'contract_renew');
            // this.renewContractPermission = true;

            // this.terminatePermission = this.utilityService.checkUserPermission(this.user, 'contract_create_page');
            this.terminatePermission = true;

            this.loadContractList();
        }
        // else {
        //     this._router.navigate(['/permission']);
        // }
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
        // if (this.preFileListPermission) {
        this.isSpinner = true;
        this.filter = "";
        this.dataSource.filter = null;
        this.loadContractList();
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
    }

    nevigate(id, type) {
        if (type == 'edit') {
            this._router.navigate(['/contract/edit/', id]);
        }
        else if (type == 'renew') {
            this._router.navigate(['/contract/renew/', id]);
        }
        else if (type == 'view') {
            this._router.navigate(['/contract/detail/', id]);
        }

    }


    loadContractList_old() {
        this.isSpinner = true;

        const msg = new Message();
        this._contractService.getAllContracts().subscribe(
            (res) => {
                this.isSpinner = false;
                this.contracts = res.data;
                console.log('res list:', this.contracts);

                this.dataSource = new MatTableDataSource<Contract>(this.contracts);
                this.dataSource.paginator = this.paginator;

                if (this.contracts.length === 0) {
                    msg.msg = 'No Contract Data Found';
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

    pageChangeEvent(event?: PageEvent) {

        console.log("getServerData event", event);

        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadContractList();

    }

    loadContractList() {
        const msg = new Message();
        this.contracts = [];
        this.dataSource = new MatTableDataSource<Contract>(this.contracts);

        if (this.listPermission) {
            this.isSpinner = true;

            this._contractService.getAllContractsCount().subscribe(
                (res) => {

                    this.length = res.data;

                    this._contractService.getAllContractsPagination(this.pageIndex, this.pageSize).subscribe(
                        (res) => {
                            this.isSpinner = false;
                            // this.contracts = res.data;
                            console.log('res list:', res.data);

                            // let array = res.json().data;
                            let array = res.data;
                            // let array = res;
                            // console.log('res list:', array);
                            var ccList = [];
                            for (let i = 0; i < array.length; i++) {
                                let u = this._contractService.mapContract(array[i]);
                                ccList.push(u);
                            }
                            this.contracts = ccList;
                            console.log('this.contracts:', this.contracts);

                            this.dataSource = new MatTableDataSource<Contract>(this.contracts);
                            // this.dataSource.paginator = this.paginator;

                            if (this.contracts.length === 0) {
                                msg.msg = 'No Contract Data Found';
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiService.showToast(msg, 'info');
                            }
                        },
                        (err) => {
                            console.log(err);
                            this.dataSource = new MatTableDataSource<Contract>(this.contracts);
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

    // openRenewContract(contract) {
    //     const dialogRef = this.dialog.open(ContractRenew, {
    //         width: '600px',
    //         height: '500px',
    //         // maxHeight: '500px',
    //         data: { contract: contract }
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //         this.loadContractList();
    //     });
    // }

    terminateContract(contract, index = null) {

        this.contracts[index].isTerminateDisabled = true;

        const dialogRef = this.dialog.open(ContractTerminate, {
            width: '600px',
            // height: '400px',
            data: { contract: contract }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.loadContractList();
        });
    }

}

@Component({
    selector: 'contract-terminate',
    templateUrl: 'contract.terminate.dialog.html',
})

export class ContractTerminate {

    isSubmited = false;

    contractTerminateForm: FormGroup;
    contract: Contract = new Contract();
    reason: string = "";

    constructor(
        @Inject('IAuthService') private _authService: IAuthService,
        public dialogRef: MatDialogRef<ContractTerminate>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _uiService: UIService,
        private _contractService: ContractService,
        private _formBuilder: FormBuilder,
    ) {
        console.log("data", data);
        this.contract = data.contract;

        this.contractTerminateForm = _formBuilder.group({
            'reason': ["", Validators.compose([Validators.required])],
        });
    }

    onSubmit() {
        // const obj = {
        //     Id: this.contract.id,
        //     ContractExpiryDate: this.newExpiryDate
        // };
        console.log(this.contract);
        this.isSubmited = true;
        const msg = new Message;
        this._uiService.showSpinner();
        this._contractService.terminateContract(this.contract, this.reason).subscribe(
            (res) => {
                console.log(res);
                this._uiService.hideSpinner();
                msg.msg = res ? res.message : 'Contract updated successfully.';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close();
            },
            (err) => {
                console.log(err);
                this.isSubmited = false;
                this._uiService.hideSpinner();
                this._authService.errStatusCheckResponse(err);
            }
        );
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}

