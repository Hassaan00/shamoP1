import { Component, Input, OnInit, Inject, Output, EventEmitter, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';

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


@Component({
    selector: 'manage-role',
    templateUrl: 'manage.role.component.html',
    styleUrls: ['../setup.forms.css', '../../admin.component.css']
})
export class ManageRoleComponent implements OnInit {

    isLogin: any;
    user: User = new User();

    step = [
        {
            id: 0,
            selected: true
        },
        {
            id: 1,
            selected: true
        },
        {
            id: 2,
            selected: true
        }
    ];

    designationListPermission = false;
    addDesignationPermission = false;
    roleListPermission = false;
    addRolePermission = false;
    permissionListPermission = false;
    addPermissionPermission = false;

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

        // this.designationListPermission = this.utilityService.checkUserPermission(this.user, 'designation_list');
        // this.addDesignationPermission = this.utilityService.checkUserPermission(this.user, 'add_designation');
        this.designationListPermission = true;
        this.addDesignationPermission = true;

        // this.roleListPermission = this.utilityService.checkUserPermission(this.user, 'region_list');
        // this.addRolePermission = this.utilityService.checkUserPermission(this.user, 'add_region');
        this.roleListPermission = true;
        this.addRolePermission = true;

        // this.permissionListPermission = this.utilityService.checkUserPermission(this.user, 'branch_list');
        // this.addPermissionPermission = this.utilityService.checkUserPermission(this.user, 'add_branch');
        this.permissionListPermission = true;
        this.addPermissionPermission = true;

    }

}




