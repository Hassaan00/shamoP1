import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
// import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { MatDialog, MatTableDataSource, MatPaginator, PageEvent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';

// models
import { User } from '../../../core/models/user';
import { Currency } from '../../../core/models/currency';
import { Message, MessageTypes } from '../../../core/models/message';
import { ExternalEmployee } from '../../../core/models/employee';
import { Contract, ContractType } from '../../../core/models/contract.model';
import { Tag } from '../../../core/models/tag';

// services
import { IAuthService } from '../../../core/services/auth/iauth.service';
import { UIService } from '../../../core/services/ui/ui.service';
import { AdminSetupService } from '../../../core/services/admin/admin.setup.service';
import { FileService } from '../../../core/services/file/file.service';
import { UtilityService } from '../../../core/services/general/utility.service';
import { ContractService } from '../../../core/services/contract/contract.service';

// components
import { ConfirmationDialogComponent } from '../../../shared/dialog-box/confirmation.dialog.component';


@Component({
    selector: 'contract-detail-form',
    templateUrl: 'contract.detail.component.html',
    providers: [
        DatePipe // this pipe is used to change date format
    ],
})
export class ContractDetailComponent implements OnInit {

    isLogin: any;
    user: User = new User();

    contract: Contract = new Contract();
    employees = new Array<ExternalEmployee>();
    contractId: number;

    clubbedContractList: Contract[] = [];
    isSpinnerCC = false;
    // displayedColumnsCC = ['sNo', 'title', 'party', 'type', 'start', 'expiry', 'action'];
    displayedColumnsCC = ['sNo', 'title', 'party', 'type', 'start', 'expiry'];
    dataSourceCC = new MatTableDataSource<Contract>(this.clubbedContractList);
    selectionCC = new SelectionModel<Contract>(true, []);
    @ViewChild("paginatorCC") paginatorCC: MatPaginator;

    contractHistoryList: Contract[] = [];
    displayedColumnsCH = ['sNo', 'title', 'party', 'type', 'start', 'expiry', 'action'];
    // displayedColumnsCH = ['sNo', 'title', 'party', 'type', 'start', 'expiry'];
    dataSourceCH = new MatTableDataSource<Contract>(this.contractHistoryList);
    @ViewChild('paginatorCH') paginatorCH: MatPaginator;

    private ngUnsubscribe: Subject<any> = new Subject();

    detailPagePermission = false;

    constructor(@Inject('IAuthService') private _authService: IAuthService,
        private _router: Router, private route: ActivatedRoute,
        public _uiService: UIService, public _contractService: ContractService,
        private _setupService: AdminSetupService, public _fileService: FileService,
        private utilityService: UtilityService,
        private dialog: MatDialog,
        private datePipe: DatePipe,
    ) { }


    ngOnInit(): void {
        this.user = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();
        const id = this.route.snapshot.params['id'];

        // this.createPagePermission = this.utilityService.checkUserPermission(this.user, 'contract_create_page');
        // this.createPagePermission = true;

        // this.detailPagePermission = this.utilityService.checkUserPermission(this.user, 'contract_create_page');
        this.detailPagePermission = true;
        if (this.detailPagePermission) {

            let id = this.route.snapshot.params['id'];
            if (id) {
                this.contractId = id;
                this.loadContractById();
            }
            if (!id || id == null || id == "") {
                this._router.navigate(['/contract/list']);
            }

        }
        else {
            this._router.navigate(['/permission']);
        }


    }

    ngAfterViewInit() {
        this.dataSourceCC.paginator = this.paginatorCC;
        this.dataSourceCH.paginator = this.paginatorCH;
    }

    loadContractById() {
        this._uiService.showSpinner();

        this._contractService.getContractById(this.contractId).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                this._uiService.hideSpinner();
                // this.contract = res.data;
                console.log('contract res', res.data);

                // this.contract = this._contractService.mapContract(res.json().data);
                this.contract = this._contractService.mapContract(res.data);

                this.clubbedContractList = this.contract.clubbedContract ? this.contract.clubbedContract : [];
                this.dataSourceCC = new MatTableDataSource<Contract>(this.clubbedContractList);
                this.dataSourceCC.paginator = this.paginatorCC;

                this.contractHistoryList = this.contract.contractInformationHistory ? this.contract.contractInformationHistory : [];
                this.dataSourceCH = new MatTableDataSource<Contract>(this.contractHistoryList);
                this.dataSourceCH.paginator = this.paginatorCH;

                console.log('this.contract', this.contract);
                console.log('this.clubbedContractList', this.clubbedContractList);

            },
            (err) => {
                console.log(err);
                this._uiService.hideSpinner();
                this._authService.errStatusCheckResponse(err);
            }
        );
    }

    viewHistory(contract) {

        console.log('viewHistory');
        console.log('contract', contract);

        const dialogRef = this.dialog.open(ContractHistoryDetail, {
            width: '900px',
            height: '500px',
            data: { contract: contract }
        });
        dialogRef.afterClosed().subscribe(result => {

        });
    }

}


@Component({
    selector: 'contract-history-detail',
    templateUrl: 'contract.history.detail.dialog.html',
})

export class ContractHistoryDetail {

    isLogin: any;
    user: User = new User();

    contract: Contract = new Contract();

    clubbedContractList: Contract[] = [];
    isSpinnerCC = false;

    displayedColumnsCC = ['sNo', 'title', 'party', 'type', 'start', 'expiry'];
    dataSourceCC = new MatTableDataSource<Contract>(this.clubbedContractList);
    selectionCC = new SelectionModel<Contract>(true, []);
    @ViewChild("paginatorCC") paginatorCC: MatPaginator;

    renewPermission = false;

    constructor(
        @Inject('IAuthService') private _authService: IAuthService,
        public dialogRef: MatDialogRef<ContractHistoryDetail>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _uiService: UIService,
    ) {
        console.log("data", data);
        this.contract = data.contract;

        this.clubbedContractList = this.contract.clubbedContract ? this.contract.clubbedContract : [];
        this.dataSourceCC = new MatTableDataSource<Contract>(this.clubbedContractList);
        this.dataSourceCC.paginator = this.paginatorCC;
    }

    ngOnInit(): void {

        this.user = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();

        // this.renewPermission = this.utilityService.checkUserPermission(this.user, 'contract_create_page');
        this.renewPermission = true;
        // if (this.renewPermission) {

        if (this.contract.id) {

        }
        if (!this.contract.id || this.contract.id == null || this.contract.id == 0) {
            // this.advisoryForm.initiateDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
            // this.advisoryForm.receivingDateLegal = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
        }
        console.log('this.contract', this.contract);


    }

    ngAfterViewInit() {
        this.dataSourceCC.paginator = this.paginatorCC;
    }

    refreshList(type, existData = null) {

    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
