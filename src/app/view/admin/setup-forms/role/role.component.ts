import { Component, Input, OnInit, Inject, Output, EventEmitter, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { User } from '../../../../core/models/user';
import { Message, MessageTypes } from '../../../../core/models/message';
import { Department } from '../../../../core/models/department';
import { Role } from '../../../../core/models/role';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { AdminSetupService } from '../../../../core/services/admin/admin.setup.service';
import { UtilityService } from '../../../../core/services/general/utility.service';


import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
    selector: 'role-list',
    templateUrl: 'role.component.html',
    styleUrls: ['../setup.forms.css', '../../admin.component.css']
})
export class RoleComponent implements OnInit {

    isLogin: any;
    departments: Department[];
    departmentId: number;
    newDepartmentId: number = null;
    roles: Role[] = [];

    roleListPermission = true;
    addPermission = true;
    updatePermission = true;
    deletePermission = true;

    user: User = new User();

    displayedColumns = ['sNo', 'roleName', 'action'];
    dataSource = new MatTableDataSource<Role>(this.roles);
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

        this.addPermission = this.utilityService.checkUserPermission(this.user, 'role_add');
        this.updatePermission = this.utilityService.checkUserPermission(this.user, 'role_update');
        this.deletePermission = this.utilityService.checkUserPermission(this.user, 'role_delete');

        this.roleListPermission = this.utilityService.checkUserPermission(this.user, 'role_list');
        console.log('this.roleListPermission', this.roleListPermission);

        // if (this.roleListPermission) {
        // this.loadDepartmentList();
        this.loadRoleList();
        // this.loadRoleViaId(this.newDepartmentId);
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

    search() {

        // if(this.keyword){
        this.pageIndex = 0;
        this.loadRoleList();
        // }

    }

    refreshList() {
        if (this.roleListPermission) {
            this.isSpinner = true;
            this.filter = "";
            this.dataSource.filter = null;
            const msg = new Message();
            // if (this.newDepartmentId) {
            //     this.loadRoleViaId(this.newDepartmentId);
            // }
            // else {
            //     msg.msg = 'Please, select department';
            //     msg.msgType = MessageTypes.Error;
            //     msg.autoCloseAfter = 400;
            //     this._uiService.showToast(msg, '');
            //     this.isSpinner = false;
            // }
            this.loadRoleList();
        }
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
        // this.loadRoleViaId(this.newDepartmentId);
        this.loadRoleList();
    }

    loadDepartmentList() {
        // if (this.roleListPermission) {
        this._setupService.getDepartments().subscribe(
            (res) => {
                this.departments = res.json().data;
                // console.log(this.departments);
            },
            (err) => {
                console.log(err);
            }
        );
        // }
    }

    // on change or focusout
    onDepartmentFocusOut() {

        if (this.departmentId !== +this.newDepartmentId) {
            this.filter = "";
            this.dataSource.filter = null;

            const department = this.departments.filter(d => d.id === +this.newDepartmentId);
            this.roles = [];

            this.dataSource = new MatTableDataSource<Role>(this.roles);
            this.dataSource.paginator = this.paginator;

            if (department.length === 0) {
                // this.isCountryValid = false;
                this.newDepartmentId = null;
                this.departmentId = this.newDepartmentId;
                // this.loadRoleList();
                return;
            }
            // this.isCountryValid = true;
            this.newDepartmentId = department[0].id;
            this.departmentId = this.newDepartmentId;

            this.loadRoleViaId(this.newDepartmentId);
        }
    }

    loadRoleViaId(id) {
        if (this.roleListPermission) {
            this.isSpinner = true;
            const msg = new Message();
            this._setupService.getRoleViaIdListCount(id).subscribe(
                (res1) => {
                    this.length = res1.json().data;
                    this._setupService.getRolesViaId(id, this.pageIndex, this.pageSize).subscribe(
                        (res) => {
                            this.roles = res.json().data;
                            // console.log(this.roles);
                            this.dataSource = new MatTableDataSource<Role>(this.roles);
                            // this.dataSource.paginator = this.paginator;

                            if (this.roles.length == 0) {
                                msg.msg = 'No Roles Found';
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiService.showToast(msg, 'info');
                            }
                            this.isSpinner = false;

                        },
                        (err) => {
                            console.log(err);
                            this._authService.errStatusCheckResponse(err);
                            this.dataSource = new MatTableDataSource<Role>(this.roles);
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

    loadRoleList_old() {
        if (this.roleListPermission) {
            this._setupService.getRoles().subscribe(
                (res) => {
                    this.roles = res.json().data;
                    // console.log(this.roles);
                    this.dataSource = new MatTableDataSource<Role>(this.roles);
                    // this.dataSource.paginator = this.paginator;
                },
                (err) => {
                    console.log(err);
                    this.dataSource = new MatTableDataSource<Role>(this.roles);
                }
            );
        }
    }

    loadRoleList() {
        if (this.roleListPermission) {
            this.isSpinner = true;
            const msg = new Message();
            this._setupService.getRolesWithCount(this.filter).subscribe(
                (res1) => {
                    this.length = res1.json().data;
                    this._setupService.getRolesWithPgno(this.filter, this.pageIndex, this.pageSize).subscribe(
                        (res) => {
                            this.roles = res.json().data;
                            // console.log(this.roles);
                            this.dataSource = new MatTableDataSource<Role>(this.roles);
                            // this.dataSource.paginator = this.paginator;

                            if (this.roles.length == 0) {
                                msg.msg = 'No Roles Found';
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiService.showToast(msg, 'info');
                            }
                            this.isSpinner = false;

                        },
                        (err) => {
                            console.log(err);
                            this._authService.errStatusCheckResponse(err);
                            this.dataSource = new MatTableDataSource<Role>(this.roles);
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
            const dialogRef = this.dialog.open(AddRoleField, {
                width: '450px',
                data: { field, departments: this.departments }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.newDepartmentId = result ? result.departmentId : this.newDepartmentId;
                this.filter = "";
                this.dataSource.filter = null;
                // this.newDepartmentId ? this.loadRoleViaId(this.newDepartmentId) : "";
                this.loadRoleList();

            });
        }
    }

    onEdit(field, id, name, tooltip, placeholder, dId) {
        // console.log('field', field, '---id', id);
        if (this.updatePermission) {
            const dialogRef = this.dialog.open(EditRoleField, {
                width: '450px',
                data: { field, id, name, tooltip, placeholder, dId, departments: this.departments }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.newDepartmentId = result ? result.departmentId : this.newDepartmentId;
                this.filter = "";
                this.dataSource.filter = null;
                // this.loadRoleViaId(this.newDepartmentId);
                this.loadRoleList();
            });
        }
    }

    onDelete(value, id, name) {
        if (this.deletePermission) {
            const dialogRef = this.dialog.open(DeleteRoleField, {
                width: '450px',
                data: { value, id, name }
            });
            // console.log('value', value, '---id', id);
            dialogRef.afterClosed().subscribe(result => {
                // this.loadRoleList();
                this.filter = "";
                this.dataSource.filter = null;
                this.loadRoleViaId(this.newDepartmentId);
            });
        }
    }
}


@Component({
    selector: 'add-role',
    templateUrl: '../../../../shared/dialogs/admin.add.field.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class AddRoleField {

    title = "Add New Role";
    role: Role = new Role();
    departments: Department[];
    // department: Department = new Department();
    fieldType: string;
    form: FormGroup;
    // patternName = /^[A-Za-z ]+$/;

    constructor(
        public dialogRef: MatDialogRef<AddRoleField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
        private fb: FormBuilder
    ) {
        this.fieldType = data.field;
        this.departments = data.departments;
        // console.log('role', this.role);
        // console.log('data', this.fieldType);
        this.form = fb.group({
            // 'departmentId': [this.role.departmentId, Validators.required],
            // 'roleName': [this.role.roleName, Validators.compose([Validators.required, Validators.pattern(this.patternName)])],
            'roleName': [this.role.roleName, Validators.compose([Validators.required])],
        });

    }

    onRoleFocusOut() {
        this.role.roleName = (this.role.roleName && this.role.roleName.length > 0 ? this.role.roleName.trim() : this.role.roleName);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        const msg = new Message();
        this._setupService.addRole(this.role).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully added an role';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close(this.role);
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }

}


@Component({
    selector: 'edit-role',
    templateUrl: '../../../../shared/dialogs/admin.add.field.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class EditRoleField {

    title = "Edit Role";
    role: Role = new Role();
    departments: Department[];
    // department: Department = new Department();
    fieldType: string;
    form: FormGroup;
    // patternName = /^[A-Za-z ]+$/;

    constructor(
        public dialogRef: MatDialogRef<EditRoleField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
        private fb: FormBuilder
    ) {
        this.fieldType = data.field;
        this.departments = data.departments;
        console.log('data', data);

        if (this.fieldType === 'role') {
            this.role.id = data.id;
            this.role.roleId = data.id;
            this.role.roleName = data.name;
            this.role.departmentId = data.dId;
        }
        console.log('this.role', this.role);

        this.form = fb.group({
            // 'departmentId': [this.role.departmentId, Validators.required],
            // 'roleName': [this.role.roleName, Validators.compose([Validators.required, Validators.pattern(this.patternName)])],
            'roleName': [this.role.roleName, Validators.compose([Validators.required])],
        })
    }

    onRoleFocusOut() {
        this.role.roleName = (this.role.roleName && this.role.roleName.length > 0 ? this.role.roleName.trim() : this.role.roleName);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        const msg = new Message();
        this._setupService.updateRole(this.role).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully updated an role';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close(this.role);
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }

}



@Component({
    selector: 'delete-role',
    templateUrl: '../../../../shared/dialogs/admin.confirm.field.delete.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class DeleteRoleField {
    fieldType: string;
    id: number;
    name: string;
    constructor(
        public dialogRef: MatDialogRef<DeleteRoleField>,
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
        this._setupService.deleteRole(this.id).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully deleted an role';
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




