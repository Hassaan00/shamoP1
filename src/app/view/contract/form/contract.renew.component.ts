import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { MatDialog, MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
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
    selector: 'contract-renew-form',
    templateUrl: 'contract.renew.component.html',
    providers: [
        DatePipe // this pipe is used to change date format
    ],
})
export class ContractRenewComponent implements OnInit {

    isLogin: any;
    user: User = new User();

    isSubmitted = false;
    isAddNewTag = false;

    contract: Contract = new Contract();
    employees = new Array<ExternalEmployee>();
    contractId: number;

    currencies: Currency[] = [];

    contractFormGroup: FormGroup;
    contractTypes: ContractType[] = [];

    contractTagList: Tag[] = [];
    contractTag: Tag = new Tag();

    pageEvent: PageEvent;
    pageIndex: number = 0;
    pageSize: number = 10; // by default
    length: number = 0;
    pageSizeOptions = [5, 10, 25, 50, 100];

    clubbedContractList: Contract[] = [];
    isSpinnerCC = false;
    displayedColumnsCC = ['sNo', 'title', 'type', 'action'];
    dataSourceCC = new MatTableDataSource<Contract>(this.clubbedContractList);
    selectionCC = new SelectionModel<Contract>(true, []);
    @ViewChild("paginatorCC") paginatorCC: MatPaginator;

    private ngUnsubscribe: Subject<any> = new Subject();

    createPagePermission = false;
    updatePermission = false;
    addTagPermission = false;
    renewPermission = false;
    minStartDate: string = "";

    constructor(@Inject('IAuthService') private _authService: IAuthService,
        private _router: Router, private route: ActivatedRoute,
        public _uiService: UIService, public _contractService: ContractService,
        private _setupService: AdminSetupService, public _fileService: FileService,
        private utilityService: UtilityService,
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe,
    ) {

        this.contractFormGroup = _formBuilder.group({
            'contractTitle': ["", Validators.compose([Validators.required])],
            'contractType': ["", Validators.compose([Validators.required])],
            'contractPrice': ["", Validators.compose([Validators.required, Validators.min(1)])],
            'currency': ["", Validators.compose([Validators.required])],
            'contractDescription': ["", Validators.compose([])],
            'party': ["", Validators.compose([Validators.required])],
            'contractStartDate': ["", Validators.compose([Validators.required])],
            'contractExpiryDate': ["", Validators.compose([Validators.required])],

            'contractRenewalIntimation': ["", Validators.compose([])],
            'contractRenewalPricePercentage': ["", Validators.compose([])],
        }, {
                // validator: this.DateCheck, // your validation method
                validator: [this.DateCheck, this.IntimationCheck], // your validation method
                // validators: this.IntimationCheck, // your validation method
                // Validators: [this.DateCheck, this.IntimationCheck] // your multiple validation method
            }
        );


    }

    DateCheck(AC: AbstractControl) {
        console.log('DateCheck');
        const startDate = AC.get('contractStartDate').value; // to get value in input tag
        const endDate = AC.get('contractExpiryDate').value; // to get value in input tag

        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        var days = 0;

        var date1 = new Date(startDate);
        var date2 = new Date(endDate);
        console.log('date1', date1);
        console.log('date2', date2);
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        console.log('date1_ms', date1_ms);
        console.log('date2_ms', date2_ms);

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        days = Math.round(difference_ms / one_day);
        console.log('days', days);
        if (startDate && endDate) {
            if (days < 1) {
                console.log('false');
                AC.get('contractExpiryDate').setErrors({ minDate: true });
            } else {
                console.log('true');
                AC.get('contractExpiryDate').setErrors(null);
                return null;
            }
        }
    }

    IntimationCheck(AC: AbstractControl) {
        console.log('IntimationCheck');
        const startDate = AC.get('contractStartDate').value; // to get value in input tag
        const endDate = AC.get('contractExpiryDate').value; // to get value in input tag
        const intimation = AC.get('contractRenewalIntimation').value; // to get value in input tag

        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        var days = 0;

        var date1 = new Date(startDate);
        var date2 = new Date(endDate);
        console.log('date1', date1);
        console.log('date2', date2);
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        console.log('date1_ms', date1_ms);
        console.log('date2_ms', date2_ms);

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        days = Math.round(difference_ms / one_day);
        console.log('days', days);
        console.log('intimation', intimation);
        // if (startDate && endDate) {
        if (days < intimation) {
            console.log('false');
            AC.get('contractRenewalIntimation').setErrors({ minIntimation: true });
        } else {
            console.log('true');
            AC.get('contractRenewalIntimation').setErrors(null);
            return null;
        }
        // }
    }

    ngOnInit(): void {
        this.user = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();
        const id = this.route.snapshot.params['id'];

        // this.createPagePermission = this.utilityService.checkUserPermission(this.user, 'contract_create_page');
        // this.createPagePermission = true;

        this.renewPermission = this.utilityService.checkUserPermission(this.user, 'contract_renew');
        // this.renewPermission = true;
        if (this.renewPermission) {

            // this.addTagPermission = this.utilityService.checkUserPermission(this.user, 'contract_tag_add');
            this.addTagPermission = true;

            let id = this.route.snapshot.params['id'];
            if (id) {
                this.contractId = id;
                this.loadContractById();
            }
            if (!id || id == null || id == "") {
                // this.advisoryForm.initiateDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
                // this.advisoryForm.receivingDateLegal = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
            }


            this.loadContractTypes();
            this.loadCurrencyList();
            this.loadEmployeeList();
            this.loadContractTags();



        }
        else {
            this._router.navigate(['/permission']);
        }


    }

    ngAfterViewInit() {
        this.dataSourceCC.paginator = this.paginatorCC;
    }

    pageChangeEvent(event?: PageEvent) {

        console.log("getServerData event", event);

        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadClubbedContractList(true);

    }

    refreshList(type, existData = null) {

        if (type == "cc") {
            console.log("cc");
            // this.isSpinnerCC = true;
            // this.filterCC = "";
            this.dataSourceCC.filter = null;
            this.changeClubbedContract();

        }


    }

    changeClubbedContract() {
        if (this.contract.isClubbedContract) {
            this.loadClubbedContractList();
        }
        else {
            this.selectionCC = new SelectionModel<Contract>(true, []);
            this.selectionCC.clear();
            this.dataSourceCC = new MatTableDataSource<Contract>([]);
        }
    }

    loadClubbedContractList(pagination = false) {
        const msg = new Message();
        this.clubbedContractList = [];
        this.isSpinnerCC = true;

        this._contractService.getAllContractsCount().subscribe(
            (res) => {

                // this.length = res.json().data;
                this.length = res.data;

                this._contractService.getAllContractsPagination(this.pageIndex, this.pageSize).subscribe(
                    (res) => {
                        console.log("res", res);
                        this.isSpinnerCC = false;
                        // this.clubbedContractList = res.json().data;

                        // let array = res.json().data;
                        let array = res.data;
                        // let array = res;
                        // console.log('res list:', array);
                        var ccList = [];
                        for (let i = 0; i < array.length; i++) {
                            let u = this._contractService.mapContract(array[i]);
                            ccList.push(u);
                        }
                        this.clubbedContractList = ccList;
                        this.dataSourceCC = new MatTableDataSource<Contract>(this.clubbedContractList);
                        // this.dataSourceCC.paginator = this.paginatorCC;


                        if (this.selectionCC.selected.length > 0) {
                            console.log("this.selectionCC.selected", this.selectionCC.selected);
                            this.dataSourceCC.data.forEach(row => {
                                this.selectionCC.selected.forEach((row1, index) => {
                                    if (row1.id == row.id) {
                                        // this.selectionCC.selected.splice(index, 1);
                                        this.selectionCC.toggle(row1);
                                        this.selectionCC.select(row);
                                    }
                                }
                                )
                            });

                        }
                        else {
                            if (!pagination) {
                                this.dataSourceCC.data.forEach(row => {
                                    this.contract.clubbedContract.forEach(row1 => {
                                        if (row1.id == row.id) {
                                            this.selectionCC.select(row);
                                        }
                                    }
                                    )
                                });
                            }

                        }



                        if (this.clubbedContractList.length == 0) {
                            msg.msg = 'No Clubbed Contract Found';
                            msg.msgType = MessageTypes.Information;
                            msg.autoCloseAfter = 400;
                            this._uiService.showToast(msg, 'info');
                        }
                    },
                    (err) => {
                        console.log(err);
                        // this.clubbedContractList = [];
                        this.dataSourceCC = new MatTableDataSource<Contract>(this.clubbedContractList);
                        this.isSpinnerCC = false;
                        this._authService.errStatusCheckResponse(err);

                    }
                );
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
                this.isSpinnerCC = false;
            }
        );


    }

    loadContractTypes() {
        this._contractService.getContractTypes().subscribe(
            (res) => {
                this.contractTypes = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    loadCurrencyList() {
        // if (this.departmentListPermission) {

        this._setupService.getCurrencies().subscribe(
            (res) => {
                this.currencies = res.json().data;
                // console.log(this.departments);
            },
            (err) => {
                console.log(err);
            }
        );
        // }
    }

    loadEmployeeList() {

        this._setupService.getAllExternalParties().subscribe(
            (res) => {
                this.employees = res.json().data;
                console.log('this.employees', this.employees);
            },
            (err) => {
                console.log(err);
            }
        );
    }


    docUploaded(data) {
        console.log("data", data);

        let docsId = [];
        let docs = [];
        if (data && data.docs && data.docs.length > 0) {
            data.docs.forEach(element => {
                // this.newPayment.documents.push(this._fileService.mapDocument(element));
                docsId.push({ DocumentUploadId: element.documentUploadId });
                docs.push(this._fileService.mapDocument(element));
            });
        }

        this.contract.contractDocs = docsId;
        this.contract.contractDocuments = docs;

        // if (data && data.docs.length > 0) {
        //     const len = data.docs.length - 1;
        //     console.log('data.docs[len-1]', data.docs[len]);

        //     const uploadId = {
        //         DocumentUploadId: data.docs[len].documentUploadId
        //     };
        //     this.contract.contractDocs.push(uploadId);
        //     data.docs.forEach(element => {
        //         this.contract.contractDocuments.push(this._fileService.mapDocument(element));
        //         console.log(this.contract.contractDocuments);
        //     });
        //     console.log('this.contract.contractDocs', this.contract.contractDocs);

        // }
    }


    remove(index) {
        console.log("index", index);
        this.contract.contractDocuments.splice(index, 1);
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

                // this.contractFormGroup.controls['contractStartDate'].disable();
                // this.contractFormGroup.controls['contractExpiryDate'].disable();
                // for (var key in this.contract)
                //     this.minStartDate = this.contract[key].contractExpiryDate;

                // this.minStartDate = res.data.contractExpiryDate || null;
                this.minStartDate = this.contract.contractExpiryDate || null;

                console.log('minStartDate', this.minStartDate)
                this.contract.contractStartDate = null;
                this.contract.contractExpiryDate = null;
                console.log('minStartDate', this.minStartDate)
                this.changeClubbedContract();
                console.log('this.contract', this.contract);
                setTimeout(() => {
                    this.checkTagSelect();
                }, 10);

                if (this.contract.contractType && this.contract.contractType.contractTypeCode == "recurring") {

                    this.contractFormGroup.get('contractRenewalIntimation').setValidators([Validators.required, Validators.min(1)]);
                    // this.contractFormGroup.get('contractRenewalPricePercentage').setValidators([Validators.required]);

                    this.contractFormGroup.get('contractRenewalIntimation').updateValueAndValidity();
                    // this.contractFormGroup.get('contractRenewalPricePercentage').updateValueAndValidity();

                }
                // if (this.contract.contractType) {
                //     this.contract.contractTypeId = this.contract.contractType.id;
                // }
                // if (this.contract.externalParty) {
                //     this.contract.externalPartyId = this.contract.externalParty.id;
                // }
                // if (res.data.contractDocument) {
                //     this.contract.contractDocs = [];
                //     this.contract.contractDocuments = res.data.contractDocument;
                //     this.contract.contractDocuments.forEach(e => {
                //         const uploadId = {
                //             DocumentUploadId: e.documentUploadId
                //         };
                //         this.contract.contractDocs.push(uploadId);
                //     });
                // }
            },
            (err) => {
                console.log(err);
                this._uiService.hideSpinner();
                this._authService.errStatusCheckResponse(err);
            }
        );
    }

    loadContractTags() {
        // console.log("loadLC");
        // if (this.branchListPermission) {

        this._setupService.getContractTags().subscribe(
            (res) => {
                console.log("res", res);

                this.contractTagList = [];


                let array = res.json().data;
                // console.log('res list:', array);

                var rtList = [];

                for (let i = 0; i < array.length; i++) {
                    let u = this._setupService.mapTag(array[i]);
                    rtList.push(u);
                }
                this.contractTagList = rtList;
                setTimeout(() => {
                    this.checkTagSelect();
                }, 10);



                // if (this.lcUsers.length == 0) {
                //     msg.msg = 'No Branchs Found';
                //     msg.msgType = MessageTypes.Information;
                //     msg.autoCloseAfter = 400;
                //     this._uiService.showToast(msg, 'info');
                // }
                // this.isSpinner = false;
            },
            (err) => {
                console.log(err);
            }
        );
        // }
    }

    checkTagSelect() {
        console.log("checkTagSelect");
        console.log("this.contract.contractTagIds", this.contract.contractTagIds);
        console.log("this.contractTagList", this.contractTagList);


        this.contract.contractTagIds.forEach(element => {
            this.contractTagList.forEach((element1, index) => {
                if (element == element1.id) {
                    console.log("match");
                    this.contractTagList[index].selected = true;
                }

            });
        });
        console.log("this.contractTagList", this.contractTagList);
    }

    onContractTypeFocusOut() {

        const contractType = this.contractTypes.filter(c => c.id === +this.contract.contractTypeId);

        if (contractType.length === 0) {
            this.contract.contractTypeId = null;
            this.contract.contractType = new ContractType();

            this.contractFormGroup.get('contractRenewalIntimation').setValidators([]);
            // this.contractFormGroup.get('contractRenewalPricePercentage').setValidators([]);

            this.contractFormGroup.get('contractRenewalIntimation').updateValueAndValidity();
            // this.contractFormGroup.get('contractRenewalPricePercentage').updateValueAndValidity();

            return;
        }
        else {
            this.contract.contractTypeId = contractType[0].id;
            this.contract.contractType = contractType[0];

            if (this.contract.contractType && this.contract.contractType.contractTypeCode == "recurring") {

                this.contractFormGroup.get('contractRenewalIntimation').setValidators([Validators.required, Validators.min(1)]);
                // this.contractFormGroup.get('contractRenewalPricePercentage').setValidators([Validators.required]);

                this.contractFormGroup.get('contractRenewalIntimation').updateValueAndValidity();
                // this.contractFormGroup.get('contractRenewalPricePercentage').updateValueAndValidity();

            }
            else {
                this.contractFormGroup.get('contractRenewalIntimation').setValidators([]);
                // this.contractFormGroup.get('contractRenewalPricePercentage').setValidators([]);

                this.contractFormGroup.get('contractRenewalIntimation').updateValueAndValidity();
                // this.contractFormGroup.get('contractRenewalPricePercentage').updateValueAndValidity();
            }

        }

        console.log("this.contract.contractType", this.contract.contractType);

    }

    onCurrencyFocusOut() {
        console.log("test")
    }

    onClickTag(contractTag: Tag) {

        // if (!this.isAssignQueryFormDisabled) {
        contractTag.selected = !contractTag.selected;
        if (contractTag.selected) {
            this.contract.contractTagIds.push(contractTag.id);
            this.contract.contractTags.push(contractTag);
        }
        else {
            let indexId = this.contract.contractTagIds.findIndex(rtId => rtId === contractTag.id);
            let index = this.contract.contractTags.findIndex(rt => rt.id === contractTag.id);
            // console.log("indexId", indexId);
            // console.log("index", index);

            this.contract.contractTagIds.splice(indexId, 1);
            this.contract.contractTags.splice(index, 1);
        }
        // }


    }

    dateChanged(event, type) {
        console.log('event', event.value);
        console.log('type', type);
        if (type == 'startDate') {
            this.contract.contractStartDate = this.datePipe.transform(this.contract.contractStartDate, 'yyyy-MM-dd');
            // console.log('event', this.contract.contractStartDate);
        }
        if (type == 'expiryDate') {
            this.contract.contractExpiryDate = this.datePipe.transform(this.contract.contractExpiryDate, 'yyyy-MM-dd');
            // console.log('event', this.contract.contractExpiryDate);
        }
    }

    addContractTag() {
        console.log("addContractTag");
        const msg = new Message();

        // if (this.isAddNewTag == true) {

        if (this.addTagPermission) {

            if (this.contractTag.tagName && this.contractTag.tagName != "" && this.contractTag.tagName != null) {
                this.isAddNewTag = true;

                this._setupService.addContractTag(this.contractTag).subscribe(
                    (res) => {
                        console.log("res", res);
                        this.isAddNewTag = false;
                        this.contractTag = new Tag();

                        console.log("success");
                        // this._router.navigate(['/verification']);
                        msg.msg = res.json() ? res.json().message : "Tag successfully Submitted.";

                        // this.advisoryForm.id = res.json() ? res.json().data : 0;
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiService.showToast(msg, 'info');
                        this.loadContractTags();
                        // this._router.navigate(['/advisory/ad/list']);
                    },
                    (err) => {
                        this.isAddNewTag = false;
                        console.log("err", err);
                        this._authService.errStatusCheckResponse(err);
                    }
                );
            }
            else {
                msg.msg = "Field is empty.";

                // this.advisoryForm.id = res.json() ? res.json().data : 0;
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, '');
            }
        }
        else {
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }

        // } else {
        //     this.loadTags();
        // }
    }

    openConfirmDialog(btn) {
        let msg;
        let obj;
        obj = 'Contract Submission Details';
        msg = 'Are you sure you want to submit these details?';

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: { message: msg, obj: obj }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close', result);
            if (result && btn === 'renew') {
                this.onRenew();
            }
        });
    }

    onRenew() {
        console.log("onRenew");
        console.log('contarct', this.contract);
        const msg = new Message;
        this._uiService.showSpinner();

        // var test = false;
        // if (test) {
        if (this.renewPermission) {

            this.contract.clubbedContract = this.selectionCC.selected;

            if (this.contractFormGroup.valid) {

                this.isSubmitted = true;
                // this._contractService.updateContract(obj).takeUntil(this.ngUnsubscribe).subscribe(
                this._contractService.renewContract(this.contract).takeUntil(this.ngUnsubscribe).subscribe(
                    (res) => {
                        console.log(res);
                        this.isSubmitted = false;
                        this._uiService.hideSpinner();
                        msg.msg = res.json() ? res.json().message : 'Contract updated successfully.';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiService.showToast(msg, 'info');
                        this._router.navigate(['/contract/list']);
                    },
                    (err) => {
                        console.log(err);
                        this.isSubmitted = false;
                        this._uiService.hideSpinner();
                        this._authService.errStatusCheckResponse(err);
                    }
                );

            }
            else {
                console.log("test2", this.contractFormGroup);
                this._uiService.hideSpinner();
                this.utilityService.validateAllFormFields(this.contractFormGroup);
                return;
            }

        }
        else {
            this._uiService.hideSpinner();
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }



}
