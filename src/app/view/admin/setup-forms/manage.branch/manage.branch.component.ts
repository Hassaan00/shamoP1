import { Component, Input, OnInit, Inject, Output, EventEmitter, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { User } from '../../../../core/models/user';
import { Message, MessageTypes } from '../../../../core/models/message';
import { Country } from '../../../../core/models/country';
import { Region } from '../../../../core/models/region';
import { City } from '../../../../core/models/city';
import { Department } from '../../../../core/models/department';
import { Branch } from '../../../../core/models/branch';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { AdminSetupService } from '../../../../core/services/admin/admin.setup.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { UtilityService } from '../../../../core/services/general/utility.service';


@Component({
    selector: 'manage-branch',
    templateUrl: 'manage.branch.component.html',
    styleUrls: ['../setup.forms.css', '../../admin.component.css']
})
export class ManageBranchComponent implements OnInit {

    isLogin: any;

    user: User = new User();

    departmentListPermission = false;
    addDepartmentPermission = false;
    regionListPermission = false;
    addRegionPermission = false;
    branchListPermission = false;
    addBranchPermission = false;

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

    constructor(@Inject('IAuthService')
    private _authService: IAuthService,
        private _uiService: UIService,
        private _router: Router,
        private utilityService: UtilityService,
        public dialog: MatDialog,
        private activateRoute: ActivatedRoute,
        private _setupService: AdminSetupService,
        private _locationService: LocationService
    ) {

    }

    ngOnInit(): void {
        // Applying permission
        this.user = this._authService.getUser();

        this.isLogin = this._authService.isLoggedIn();

        // if(!this.isLogin){

        // }

        // this.departmentListPermission = this.utilityService.checkUserPermission(this.user, 'department_list');
        // this.addDepartmentPermission = this.utilityService.checkUserPermission(this.user, 'add_department');
        this.departmentListPermission = true;
        this.addDepartmentPermission = true;

        // this.regionListPermission = this.utilityService.checkUserPermission(this.user, 'region_list');
        // this.addRegionPermission = this.utilityService.checkUserPermission(this.user, 'add_region');
        this.regionListPermission = true;
        this.addRegionPermission = true;

        // this.branchListPermission = this.utilityService.checkUserPermission(this.user, 'branch_list');
        // this.addBranchPermission = this.utilityService.checkUserPermission(this.user, 'add_branch');
        this.branchListPermission = true;
        this.addBranchPermission = true;

    }

}


