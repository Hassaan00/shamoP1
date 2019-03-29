import { Component, Input, OnInit, Inject, OnChanges, Output, EventEmitter, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';


import { Message, MessageTypes } from '../../../../core/models/message';
import { User } from '../../../../core/models/user';
import { Flag } from '../../../../core/models/flag';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { UtilityService } from '../../../../core/services/general/utility.service';
import { AdminSetupService } from '../../../../core/services/admin/admin.setup.service';

import { ConfirmationDialogComponent } from '../../../../shared/dialog-box/confirmation.dialog.component';

@Component({
    selector: 'user-list',
    moduleId: module.id,
    templateUrl: 'user.list.component.html',
    styleUrls: ['./../users.css'],
})
export class UserListComponent implements OnInit, OnChanges, OnDestroy {

    user: User;
    isLogin: boolean;
    userList: User[] = [];
    private ngUnsubscribe: Subject<any> = new Subject();

    userListPermission = false;
    addPermission = false;
    updatePermission = false;
    deletePermission = false;
    blockUserPermission = false;
    unBlockUserPermission = false;
    activateUserPermission = false;
    deactivateUserPermission = false;
    addFlagPermission = false;
    removeFlagPermission = false;

    listFilter: string;

    displayedColumns = ['sNo', 'firstName', 'lastName', 'loginEmail', 'action'];
    dataSource = new MatTableDataSource<User>(this.userList);
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

    flags = new Array<Flag>();

    constructor(
        @Inject('IAuthService') private _authService: IAuthService,
        private _uiService: UIService,
        private _router: Router,
        private utilityService: UtilityService,
        public dialog: MatDialog,
        private _adminService: AdminService,
        private _adminSetupService: AdminSetupService,
    ) {

    }

    ngOnInit(): void {

        this.user = this._authService.getUser();
        // check if a user is logged in
        this.isLogin = this._authService.isLoggedIn();
        // if (!this._authService.isLoggedIn()) {
        //     this._router.navigateByUrl('login');
        // }

        this.userListPermission = this.utilityService.checkUserPermission(this.user, 'user_list');

        // this.userListPermission = true;
        if (this.userListPermission) {

            this.addPermission = this.utilityService.checkUserPermission(this.user, 'user_add');
            this.updatePermission = this.utilityService.checkUserPermission(this.user, 'user_edit');
            this.deletePermission = this.utilityService.checkUserPermission(this.user, 'user_delete');

            this.activateUserPermission = this.utilityService.checkUserPermission(this.user, 'user_activate');
            this.deactivateUserPermission = this.utilityService.checkUserPermission(this.user, 'user_deactivate');

            this.blockUserPermission = this.utilityService.checkUserPermission(this.user, 'user_block');
            this.unBlockUserPermission = this.utilityService.checkUserPermission(this.user, 'user_unblock');

            this.addFlagPermission = this.utilityService.checkUserPermission(this.user, 'flag_add');
            this.removeFlagPermission = this.utilityService.checkUserPermission(this.user, 'flag_remove');

            // console.log('this is a userList page');
            this.loadUserList();
            this.loadFlags();
        }
        else {
            this._router.navigate(['/permission']);
        }

    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    loadFlags() {
        this._adminSetupService.getAllFlags().takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                this.flags = res.json().data;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    refreshList() {
        // if (this.userListPermission) {
        this.isSpinner = true;
        this.filter = "";
        this.dataSource.filter = null;
        this.loadUserList();
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


    loadUserList_old() {
        if (this.userListPermission) {
            this.isSpinner = true;

            // this._brandService.getBrandUserList().takeUntil(this.ngUnsubscribe).subscribe(
            //     (res) => {
            //         this.userList = res.brandUsers;
            //         console.log('brand list:', this.userList);
            //     },
            //     (err) => {
            //         console.log(err);
            //     }
            // );
            const msg = new Message();
            this._adminService.getUsersList().subscribe(
                (res) => {
                    // this.userList = res.json();
                    let array = res.json().data;
                    // console.log('res list:', array);
                    var uList = [];
                    for (let i = 0; i < array.length; i++) {
                        let u = this._adminService.mapUser(array[i]);
                        uList.push(u);
                    }
                    this.userList = uList;

                    this.dataSource = new MatTableDataSource<User>(this.userList);
                    this.dataSource.paginator = this.paginator;
                    // console.log('user list:', this.userList);

                    if (this.userList.length == 0) {
                        msg.msg = 'No Users Found';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiService.showToast(msg, 'info');
                    }
                    this.isSpinner = false;
                },
                (err) => {
                    console.log(err);
                    this._authService.errStatusCheck(err);
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
        this.loadUserList();

    }

    loadUserList() {
        const msg = new Message();
        this.userList = [];
        this.dataSource = new MatTableDataSource<User>(this.userList);
        if (this.userListPermission) {
            this.isSpinner = true;

            // this._uiService.showSpinner();

            this._adminService.getUsersListCount().subscribe(
                (res) => {
                    // this._uiService.hideSpinner();
                    this.length = res.json().data;

                    this._adminService.getUsersListPagination(this.pageIndex, this.pageSize).subscribe(
                        (res) => {
                            // this.userList = res.json();
                            // this._uiService.hideSpinner();
                            let array = res.json().data;
                            // console.log('res list:', array);
                            var uList = [];
                            for (let i = 0; i < array.length; i++) {
                                let u = this._adminService.mapUser(array[i]);
                                uList.push(u);
                            }
                            this.userList = uList;

                            this.dataSource = new MatTableDataSource<User>(this.userList);
                            // this.dataSource.paginator = this.paginator;
                            // console.log('user list:', this.userList);

                            if (this.userList.length == 0) {
                                msg.msg = 'No Users Found';
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiService.showToast(msg, 'info');
                            }
                            this.isSpinner = false;
                        },
                        (err) => {
                            console.log(err);
                            // this._uiService.hideSpinner();
                            this.dataSource = new MatTableDataSource<User>(this.userList);
                            this._authService.errStatusCheck(err);
                            this.isSpinner = false;
                        }
                    );

                },
                (err) => {
                    console.log(err);
                    this._uiService.hideSpinner();
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

    deActivateUser(user) {
        if (this.deactivateUserPermission) {

        }
    }

    confirmDialog(user, btn, index) {
        let msg;
        let obj;
        if (btn === 'activate') {
            obj = 'Activate User';
            msg = 'Are you sure you want to activate ' + user.firstName + ' ?';
        } else if (btn === 'deactivate') {
            obj = 'Deactivate User';
            msg = 'Are you sure you want to deactivate ' + user.firstName + ' ?';
        }
        else if (btn === 'block') {
            obj = 'Block User';
            msg = 'Are you sure you want to block ' + user.firstName + ' ?';
        }
        else if (btn === 'unblock') {
            obj = 'Unblock User';
            msg = 'Are you sure you want to unblock ' + user.firstName + ' ?';
        }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: { message: msg, obj: obj }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close', result);
            if (result && btn === 'activate') {
                this.activateUser(user);
            }
            if (result && btn === 'deactivate') {
                this.deActivateUser(user);
            }
            if (result && btn === 'block') {
                this.blockUser(user, index);
            }
            if (result && btn === 'unblock') {
                this.unBlockUser(user, index);
            }
        });
    }

    activateUser(user) {
        if (this.activateUserPermission) {

        }
    }

    unBlockUser(user, index) {
        const msg = new Message();

        this.userList[index].isUnBlockDisabled = true;
        this._uiService.showSpinner();
        if (this.unBlockUserPermission) {

            this._adminService.unBlockUser(user.id).subscribe(
                (res) => {
                    this._uiService.hideSpinner();
                    // this.userList = res.json();
                    // console.log('user list:', this.userList);
                    this.userList[index].isUnBlockDisabled = false;
                    msg.msg = res.json() ? res.json().message : 'You have successfully unblock user';
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, 'info');
                    // this.loadUserList();
                    this.refreshList();
                },
                (err) => {
                    this.userList[index].isUnBlockDisabled = false;
                    console.log(err);
                    this._uiService.hideSpinner();
                    this._authService.errStatusCheck(err);
                }
            );
        }
        else {
            this.userList[index].isUnBlockDisabled = false;

            this._uiService.hideSpinner();
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    blockUser(user, index) {
        const msg = new Message();
        this._uiService.showSpinner();
        this.userList[index].isBlockDisabled = true;
        if (this.blockUserPermission) {

            this._adminService.blockUser(user.id).subscribe(
                (res) => {
                    this._uiService.hideSpinner();
                    // this.userList = res.json();
                    // console.log('user list:', this.userList);
                    this.userList[index].isBlockDisabled = false
                    msg.msg = res.json() ? res.json().message : 'You have successfully block user';
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, 'info');
                    // this.loadUserList();
                    this.refreshList();
                },
                (err) => {
                    this.userList[index].isBlockDisabled = false
                    console.log(err);
                    this._uiService.hideSpinner();
                    this._authService.errStatusCheck(err);
                }
            );
        }
        else {
            this.userList[index].isBlockDisabled = false;
            this._uiService.hideSpinner();
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    markFlag(flag, userId, index) {
        this._uiService.showSpinner();
        const msg = new Message();
        const flagObj = {
            UserId: userId,
            FlagId: flag.id
        };

        this.userList[index].isAddFlagDisabled = true;
        this.userList[index].isRemoveFlagDisabled = true;
        if ((this.addFlagPermission && flag.flagCode === 'red') || (this.removeFlagPermission && flag.flagCode === 'green')) {

            this._adminSetupService.markUserFlag(flagObj).subscribe(
                (res) => {
                    this._uiService.hideSpinner();
                    this.userList[index].isAddFlagDisabled = false;
                    this.userList[index].isRemoveFlagDisabled = false;
                    msg.msg = res.json().message ? res.json().message : 'Flag generated against the user';
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, 'info');
                    this.refreshList();
                },
                (err) => {
                    this.userList[index].isAddFlagDisabled = false;
                    this.userList[index].isRemoveFlagDisabled = false;
                    console.log(err);
                    this._uiService.hideSpinner();
                    this._authService.errStatusCheckResponse(err);
                }
            );

        }
        else {

            this.userList[index].isAddFlagDisabled = false;
            this.userList[index].isRemoveFlagDisabled = false;
            this._uiService.hideSpinner();
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }


    }

    editUser(id) {
        console.log('id', id);
        if (this.updatePermission) {
            // this._router.navigate(['/user/edit/profile', id]);
            this._router.navigate(['/admin/users/edit', id]);
        }
        else {

            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }

    }

}

