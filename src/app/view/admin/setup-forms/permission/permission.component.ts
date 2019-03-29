import { Component, Input, OnInit, Inject, Output, EventEmitter, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { UtilityService } from '../../../../core/services/general/utility.service';
import { AdminSetupService } from '../../../../core/services/admin/admin.setup.service';

import { Message, MessageTypes } from '../../../../core/models/message';
import { Permission } from '../../../../core/models/permission';
import { User } from '../../../../core/models/user';



@Component({
    selector: 'permission-list',
    templateUrl: 'permission.component.html',
    styleUrls: ['../setup.forms.css', '../../admin.component.css']
})
export class PermissionComponent implements OnInit {

    isLogin: any;
    // getURL: string;
    // admins = new Array<any>();
    // permission: Permission = new Permission();
    permissions: Permission[] = [];

    permissionListPermission = false;
    addPermission = false;
    updatePermission = false;
    deletePermission = false;

    user: User = new User();

    displayedColumns = ['sNo', 'permissionName', 'action'];
    dataSource = new MatTableDataSource<Permission>(this.permissions);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    isSpinner = false;
    filter: string = "";

    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 10; // by default
    length = 0;
    pageSizeOptions = [5, 10, 25, 50, 100];
    upperLimit = 0;

    constructor(@Inject('IAuthService')
    private _authService: IAuthService,
        private _uiService: UIService,
        private _router: Router,
        private utilityService: UtilityService,
        public dialog: MatDialog,
        private activateRoute: ActivatedRoute,
        private _setupService: AdminSetupService,
    ) {

    }

    ngOnInit(): void {
        // Applying permission
        this.user = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();

        this.addPermission = this.utilityService.checkUserPermission(this.user, 'permission_add');
        // this.addPermission = true;
        this.updatePermission = this.utilityService.checkUserPermission(this.user, 'permission_update');
        // this.updatePermission = true;
        this.deletePermission = this.utilityService.checkUserPermission(this.user, 'permission_delete');
        // this.deletePermission = true;

        this.permissionListPermission = this.utilityService.checkUserPermission(this.user, 'permission_list');
        // this.permissionListPermission = true;
        if (this.permissionListPermission) {
            this.loadPermissionList();
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        // console.log(this.dataSource);
    }

    refreshList() {
        // if (this.permissionListPermission) {
        this.isSpinner = true;
        this.filter = "";
        this.dataSource.filter = null;
        this.loadPermissionList();
        // }
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

    pageChangeEvent(event?: PageEvent) {

        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadPermissionList();

    }

    loadPermissionList_old() {
        if (this.permissionListPermission) {
            this.isSpinner = true;
            const msg = new Message();
            this._setupService.getPermissions().subscribe(
                (res) => {
                    this.permissions = res.json().data;
                    // console.log(this.permissions);
                    this.dataSource = new MatTableDataSource<Permission>(this.permissions);
                    this.dataSource.paginator = this.paginator;
                    // console.log(this.dataSource);
                    if (this.permissions.length == 0) {
                        msg.msg = 'No Permissions Found';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiService.showToast(msg, 'info');
                    }
                    this.isSpinner = false;

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

    loadPermissionList() {
        if (this.permissionListPermission) {
            this.isSpinner = true;
            const msg = new Message();
            this._setupService.getPermissionListCount().subscribe(
                (res1) => {
                    this.length = res1.json().data;
                    this._setupService.getPermissionsWithPgno(this.pageIndex, this.pageSize).subscribe(
                        (res) => {
                            this.permissions = res.json().data;
                            this.dataSource = new MatTableDataSource<Permission>(this.permissions);
                            // this.dataSource.paginator = this.paginator;

                            if (this.permissions.length == 0) {
                                msg.msg = 'No Permissions Found';
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiService.showToast(msg, 'info');
                            }
                            this.isSpinner = false;
                        },
                        (err) => {
                            console.log(err);
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
        } else {
            this.isSpinner = false;
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    addField(field) {
        if (this.addPermission) {
            const dialogRef = this.dialog.open(AddPermissionField, {
                width: '450px',
                data: { field }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.filter = "";
                this.dataSource.filter = null;
                this.loadPermissionList();
            });
        }
    }

    onEdit(value, id, name, tooltip, placeholder) {
        // console.log('value', value, '---id', id);
        if (this.updatePermission) {
            const dialogRef = this.dialog.open(EditPermissionField, {
                width: '450px',
                data: { value, id, name, tooltip, placeholder }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.filter = "";
                this.dataSource.filter = null;
                this.loadPermissionList();
            });
        }
    }

    onDelete(value, id, name) {
        if (this.deletePermission) {
            const dialogRef = this.dialog.open(DeletePermissionField, {
                width: '450px',
                data: { value, id, name }
            });
            // console.log('value', value, '---id', id);
            dialogRef.afterClosed().subscribe(result => {
                this.filter = "";
                this.dataSource.filter = null;
                this.loadPermissionList();
            });
        }
    }
}


@Component({
    selector: 'add-permission',
    templateUrl: '../../../../shared/dialogs/admin.add.field.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class AddPermissionField {

    title = "Add New Permission";
    permission: Permission = new Permission();
    fieldType: string;
    form: FormGroup;
    // patternName = /^[A-Za-z ]+$/;

    constructor(
        public dialogRef: MatDialogRef<AddPermissionField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
        private fb: FormBuilder
    ) {
        this.fieldType = data.field;
        // console.log('permission', this.permission);
        // console.log('data', this.fieldType);
        this.form = fb.group({
            // 'permissionName': [this.permission.permissionName, Validators.compose([Validators.required, Validators.pattern(this.patternName)])],
            'permissionName': [this.permission.permissionName, Validators.compose([Validators.required])],
        })

    }

    onPermissionFocusOut() {
        this.permission.permissionName = (this.permission.permissionName && this.permission.permissionName.length > 0 ? this.permission.permissionName.trim() : this.permission.permissionName);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        const msg = new Message();
        this._setupService.addPermission(this.permission).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully added an permission';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close();
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }

}



@Component({
    selector: 'edit-permission',
    templateUrl: '../../../../shared/dialogs/admin.add.field.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class EditPermissionField {

    title = "Edit Permission";
    permission: Permission = new Permission();
    fieldType: string;
    form: FormGroup;
    // patternName = /^[A-Za-z ]+$/;

    constructor(
        public dialogRef: MatDialogRef<EditPermissionField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
        private fb: FormBuilder
    ) {
        this.fieldType = data.value;
        console.log('data', data);

        if (this.fieldType === 'permission') {
            this.permission.id = data.id;
            this.permission.permissionId = data.id;
            this.permission.permissionName = data.name;
        }
        // console.log('this.permission', this.permission);

        this.form = fb.group({
            // 'permissionName': [this.permission.permissionName, Validators.compose([Validators.required, Validators.pattern(this.patternName)])],
            'permissionName': [this.permission.permissionName, Validators.compose([Validators.required])],
        })
    }

    onPermissionFocusOut() {
        this.permission.permissionName = (this.permission.permissionName && this.permission.permissionName.length > 0 ? this.permission.permissionName.trim() : this.permission.permissionName);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        const msg = new Message();
        this._setupService.updatePermission(this.permission).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully updated an industry';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close(this.permission);
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }

}



@Component({
    selector: 'delete-permission',
    templateUrl: '../../../../shared/dialogs/admin.confirm.field.delete.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class DeletePermissionField {
    fieldType: string;
    id: number;
    name: string;
    constructor(
        public dialogRef: MatDialogRef<DeletePermissionField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
    ) {
        this.fieldType = data.value;
        this.id = data.id;
        this.name = data.name;
        // console.log('data', this.fieldType);

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        const msg = new Message();
        this._setupService.deletePermission(this.id).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully deleted an permission';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close();
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }
}




