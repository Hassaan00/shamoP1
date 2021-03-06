import { Component, Input, OnInit, Inject, Output, EventEmitter, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { User } from '../../../../core/models/user';
import { Message, MessageTypes } from '../../../../core/models/message';
import { Country } from '../../../../core/models/country';
import { Region } from '../../../../core/models/region';
import { City } from '../../../../core/models/city';
import { Branch } from '../../../../core/models/branch';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { AdminSetupService } from '../../../../core/services/admin/admin.setup.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { UtilityService } from '../../../../core/services/general/utility.service';

@Component({
    selector: 'branch-list',
    templateUrl: 'branch.component.html',
    styleUrls: ['../setup.forms.css', '../../admin.component.css']
})
export class BranchComponent implements OnInit {

    isLogin: any;
    // getURL: string;
    // admins = new Array<any>();
    // branch: Branch = new Branch();
    countries: Country[] = [];
    countryId: number;
    newCountryId: number;

    regions: Region[] = [];
    regionId: number;
    newRegionId: number;

    cities: City[] = [];
    cityId: number;
    newCityId: number;

    branchs: Branch[] = [];

    branchListPermission = false;
    addPermission = false;
    updatePermission = false;
    deletePermission = false;

    user: User = new User();

    displayedColumns = ['sNo', 'branchName', 'branchCode', 'action'];
    dataSource = new MatTableDataSource<Branch>(this.branchs);
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
        private _locationService: LocationService
    ) {

    }

    ngOnInit(): void {
        // Applying permission
        this.user = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();

        this.addPermission = this.utilityService.checkUserPermission(this.user, 'branch_add');
        this.updatePermission = this.utilityService.checkUserPermission(this.user, 'branch_update');
        this.deletePermission = this.utilityService.checkUserPermission(this.user, 'branch_delete');

        this.branchListPermission = this.utilityService.checkUserPermission(this.user, 'branch_list');
        console.log('branchListPermission', this.branchListPermission);

        // if (this.branchListPermission) {
        // this.loadCityList();
        this.loadCountryList();
        // this.loadBranchList();
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
        const msg = new Message();
        // if(this.keyword){

        this.filter = this.filter ? this.filter.trim() : this.filter;
        if (this.newCityId) {
            this.pageIndex = 0;
            this.loadBranchViaId(this.newCityId);
        }
        else {
            msg.msg = 'Please, select country';
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.showToast(msg, '');
            this.isSpinner = false;
        }
        // }

    }

    refreshList() {
        if (this.branchListPermission) {
            this.isSpinner = true;
            this.filter = "";
            this.dataSource.filter = null;
            const msg = new Message();
            if (this.newCityId) {
                this.loadBranchViaId(this.newCityId);
            }
            else {
                msg.msg = 'Please, select city';
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, '');
                this.isSpinner = false;
            }
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
        this.loadBranchViaId(this.newCityId);

    }

    loadCountryList() {
        // if (this.branchListPermission) {
        this._locationService.getCountries().subscribe(
            (res) => {
                this.countries = res.json().data;
                // console.log(this.countries);
            },
            (err) => {
                console.log(err);
            }
        );
        // }
    }

    loadRegionViaId(id) {
        // if (this.branchListPermission) {
        this._locationService.getRegionsViaCountryId(id).subscribe(
            (res) => {
                this.regions = res.json().data;
                // console.log(this.regions);
            },
            (err) => {
                console.log(err);
            }
        );
        // }
    }

    loadCityViaRId(id) {
        // if (this.branchListPermission) {
        this._locationService.getCitiesViaRegionId(id).subscribe(
            (res) => {
                this.cities = res.json().data;
                // console.log(this.cities);
            },
            (err) => {
                console.log(err);
            }
        );
        // }
    }

    loadCityList() {
        // if (this.branchListPermission) {
        // this._setupService.getCities().subscribe(
        this._locationService.getCities().subscribe(
            (res) => {
                this.cities = res.json().data;
                console.log(this.cities);
            },
            (err) => {
                console.log(err);
            }
        );
        // }
    }

    loadBranchViaId_old(id) {
        if (this.branchListPermission) {
            this.isSpinner = true;
            const msg = new Message();

            this._locationService.getBranchesViaCityId(id).subscribe(
                (res) => {
                    this.branchs = res.json().data;
                    // console.log(this.branchs);
                    this.dataSource = new MatTableDataSource<Branch>(this.branchs);
                    this.dataSource.paginator = this.paginator;

                    if (this.branchs.length == 0) {
                        msg.msg = 'No Branchs Found';
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
    }

    loadBranchViaId(id) {
        if (this.branchListPermission) {
            this.branchs = [];
            this.dataSource = new MatTableDataSource<Branch>(this.branchs);

            this.isSpinner = true;
            const msg = new Message();
            this._setupService.getBranchViaCityIdListCount(id, this.filter).subscribe(
                (res1) => {
                    this.length = res1.json().data;
                    this._setupService.getBranchsWithPgno(id, this.pageIndex, this.pageSize, this.filter).subscribe(
                        (res) => {
                            this.branchs = res.json().data;
                            this.dataSource = new MatTableDataSource<Branch>(this.branchs);
                            // this.dataSource.paginator = this.paginator;

                            if (this.branchs.length == 0) {
                                msg.msg = 'No Branchs Found';
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

                            this.branchs = [];
                            this.dataSource = new MatTableDataSource<Branch>(this.branchs);
                        }
                    );
                },
                (err) => {
                    console.log(err);
                    this._authService.errStatusCheckResponse(err);
                    this.isSpinner = false;

                    this.branchs = [];
                    this.dataSource = new MatTableDataSource<Branch>(this.branchs);
                }
            );
        } else {
            this.isSpinner = false;
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    loadBranchList() {
        if (this.branchListPermission) {
            this._setupService.getBranchs().subscribe(
                (res) => {
                    this.branchs = res.json().data;
                    // console.log(this.branchs);
                    this.dataSource = new MatTableDataSource<Branch>(this.branchs);
                    this.dataSource.paginator = this.paginator;
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    onCountryFocusOut(countryId = null) {

        if (this.countryId !== +this.newCountryId) {
            const country = this.countries.filter(c => c.id === +this.newCountryId);
            this.regions = [];
            this.cities = [];
            this.branchs = [];

            this.filter = "";
            this.dataSource.filter = null;

            this.dataSource = new MatTableDataSource<Branch>(this.branchs);
            this.dataSource.paginator = this.paginator;

            this.newRegionId = null;
            this.regionId = this.newRegionId;

            this.newCityId = null;
            this.cityId = this.newCityId;

            if (country.length === 0) {
                // this.isCountryValid = false;
                this.newCountryId = null;
                this.countryId = this.newCountryId;
                return;
            }
            // this.isCountryValid = true;
            this.newCountryId = country[0].id;
            this.countryId = this.newCountryId;

            this.loadRegionViaId(this.newCountryId);
        }
    }

    onRegionFocusOut(regionId = null) {

        if (this.regionId !== +this.newRegionId) {
            const region = this.regions.filter(r => r.id === +this.newRegionId);
            this.cities = [];
            this.branchs = [];

            this.filter = "";
            this.dataSource.filter = null;

            this.dataSource = new MatTableDataSource<Branch>(this.branchs);
            this.dataSource.paginator = this.paginator;

            this.newCityId = null;
            this.cityId = this.newCityId;

            if (region.length === 0) {
                // this.isCountryValid = false;
                this.newRegionId = null;
                this.regionId = this.newRegionId;
                return;
            }
            // this.isCountryValid = true;
            this.newRegionId = region[0].id;
            this.regionId = this.newRegionId;

            this.loadCityViaRId(this.newRegionId);
        }
    }

    onCityFocusOut(cityId = null) {

        if (this.cityId !== +this.newCityId) {
            const city = this.cities.filter(d => d.id === +this.newCityId);
            this.branchs = [];

            this.filter = "";
            this.dataSource.filter = null;

            this.dataSource = new MatTableDataSource<Branch>(this.branchs);
            this.dataSource.paginator = this.paginator;

            if (city.length === 0) {
                // this.isCountryValid = false;
                this.newCityId = null;
                this.cityId = this.newCityId;
                return;
            }
            // this.isCountryValid = true;
            this.newCityId = city[0].id;
            this.cityId = this.newCityId;

            this.loadBranchViaId(this.newCityId);
        }
    }

    addField(field) {
        if (this.addPermission) {
            const dialogRef = this.dialog.open(AddBranchField, {
                width: '450px',
                data: { field, countries: this.countries }
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.loadBranchList();

                this.newCountryId = result && result.countryId ? result.countryId : this.newCountryId;
                this.countryId = this.newCountryId;
                this.filter = "";
                this.dataSource.filter = null;
                if (this.newCountryId) {
                    this.loadRegionViaId(this.newCountryId);
                }

                this.newRegionId = result && result.regionId ? result.regionId : this.newRegionId;
                this.regionId = this.newRegionId;
                if (this.newRegionId) {
                    this.loadCityViaRId(this.newRegionId);
                }

                this.newCityId = result && result.cityId ? result.cityId : this.newCityId;
                this.cityId = this.newCityId;
                if (this.newCityId) {
                    this.loadBranchViaId(this.newCityId);
                }
                // else{
                //     this.refreshList();
                // }
            });
        }
    }

    onEdit_old(value, id, name, tooltip, placeholder) {
        // console.log('value', value, '---id', id);
        if (this.updatePermission) {
            const dialogRef = this.dialog.open(EditBranchField, {
                width: '450px',
                data: {
                    value,
                    id,
                    name,
                    tooltip,
                    placeholder,
                    coId: this.newCountryId,
                    countries: this.countries,
                    rId: this.newRegionId,
                    regions: this.regions,
                    cId: this.newCityId,
                    cities: this.cities
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.loadBranchList();
                this.filter = "";
                this.dataSource.filter = null;

                this.newCountryId = result && result.countryId ? result.countryId : this.newCountryId;
                this.countryId = this.newCountryId;
                this.loadRegionViaId(this.newCountryId);

                this.newRegionId = result && result.regionId ? result.regionId : this.newRegionId;
                this.regionId = this.newRegionId;
                this.loadCityViaRId(this.newRegionId);

                this.newCityId = result && result.cityId ? result.cityId : this.newCityId;
                this.cityId = this.newCityId;
                this.loadBranchViaId(this.newCityId);
            });
        }
    }

    onEdit(field, branch) {
        // console.log('value', value, '---id', id);
        if (this.updatePermission) {
            const dialogRef = this.dialog.open(EditBranchField, {
                width: '450px',
                data: {
                    field: field,
                    branch: branch,
                    coId: this.newCountryId,
                    countries: this.countries,
                    rId: this.newRegionId,
                    regions: this.regions,
                    cId: this.newCityId,
                    cities: this.cities
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.loadBranchList();
                this.filter = "";
                this.dataSource.filter = null;

                this.newCountryId = result && result.countryId ? result.countryId : this.newCountryId;
                this.countryId = this.newCountryId;
                this.loadRegionViaId(this.newCountryId);

                this.newRegionId = result && result.regionId ? result.regionId : this.newRegionId;
                this.regionId = this.newRegionId;
                this.loadCityViaRId(this.newRegionId);

                this.newCityId = result && result.cityId ? result.cityId : this.newCityId;
                this.cityId = this.newCityId;
                this.loadBranchViaId(this.newCityId);
            });
        }
    }

    onDelete(value, id, name) {
        if (this.deletePermission) {
            const dialogRef = this.dialog.open(DeleteBranchField, {
                width: '450px',
                data: { value, id, name }
            });
            // console.log('value', value, '---id', id);
            dialogRef.afterClosed().subscribe(result => {
                // this.loadBranchList();
                this.filter = "";
                this.dataSource.filter = null;

                this.loadBranchViaId(this.newCityId);
            });
        }
    }
}


@Component({
    selector: 'add-branch',
    templateUrl: '../../../../shared/dialogs/admin.add.field.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class AddBranchField {

    title = "Add New Branch";
    countries: Country[] = [];
    countryId: number;
    newCountryId: number;

    regions: Region[];
    regionId: number;
    newRegionId: number;

    cities: City[];
    cityId: number;
    newCityId: number;

    branch: Branch = new Branch();

    // city: City = new City();
    fieldType: string;
    form: FormGroup;
    // patternName = /^[A-Za-z ]+$/;

    constructor(
        public dialogRef: MatDialogRef<AddBranchField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
        private _locationService: LocationService,
        private fb: FormBuilder
    ) {
        this.fieldType = data.field;
        this.countries = data.countries;
        // this.cities = data.cities;

        // console.log('branch', this.branch);
        // console.log('data', this.fieldType);
        this.form = fb.group({
            'cityId': [this.branch.cityId, Validators.required],
            // 'branchName': [this.branch.branchName, Validators.compose([Validators.required, Validators.pattern(this.patternName)])],
            'branchName': [this.branch.branchName, Validators.compose([Validators.required])],
            'branchCode': [this.branch.branchCode, Validators.compose([Validators.required])],
        });

    }

    loadRegionViaId(id) {

        this._locationService.getRegionsViaCountryId(id).subscribe(
            (res) => {
                this.regions = res.json().data;
                // console.log(this.regions);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    loadCityViaRId(id) {

        this._locationService.getCitiesViaRegionId(id).subscribe(
            (res) => {
                this.cities = res.json().data;
                // console.log(this.cities);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    onBranchFocusOut() {

        this.branch.branchName = (this.branch.branchName && this.branch.branchName.length > 0 ? this.branch.branchName.trim() : this.branch.branchName);
    }

    onCountryFocusOut(countryId = null) {

        if (this.countryId !== +this.newCountryId) {
            const country = this.countries.filter(c => c.id === +this.newCountryId);
            this.regions = [];
            this.cities = [];

            this.newRegionId = null;
            this.regionId = this.newRegionId;

            this.newCityId = null;
            this.cityId = this.newCityId;
            this.branch.cityId = this.newCityId;

            if (country.length === 0) {
                // this.isCountryValid = false;
                this.newCountryId = null;
                this.countryId = this.newCountryId;
                return;
            }
            // this.isCountryValid = true;
            this.newCountryId = country[0].id;
            this.countryId = this.newCountryId;

            this.loadRegionViaId(this.newCountryId);
        }
    }

    onRegionFocusOut(regionId = null) {

        if (this.regionId !== +this.newRegionId) {
            const region = this.regions.filter(r => r.id === +this.newRegionId);
            this.cities = [];

            this.newCityId = null;
            this.cityId = this.newCityId;
            this.branch.cityId = this.newCityId;

            if (region.length === 0) {
                // this.isCountryValid = false;
                this.newRegionId = null;
                this.regionId = this.newRegionId;
                return;
            }
            // this.isCountryValid = true;
            this.newRegionId = region[0].id;
            this.regionId = this.newRegionId;

            this.loadCityViaRId(this.newRegionId);
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {

        let result = {
            countryId: this.newCountryId,
            regionId: this.newRegionId,
            cityId: this.branch.cityId
        }

        const msg = new Message();
        this._setupService.addBranch(this.branch).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully added an branch';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close(result);
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }

}


@Component({
    selector: 'edit-branch',
    templateUrl: '../../../../shared/dialogs/admin.add.field.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class EditBranchField {

    title = "Edit Branch";
    countries: Country[] = [];
    countryId: number;
    newCountryId: number;

    regions: Region[];
    regionId: number;
    newRegionId: number;

    cities: City[];
    cityId: number;
    newCityId: number;

    branch: Branch = new Branch();
    fieldType: string;
    form: FormGroup;
    // patternName = /^[A-Za-z ]+$/;

    constructor(
        public dialogRef: MatDialogRef<EditBranchField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
        private _locationService: LocationService,
        private fb: FormBuilder
    ) {
        this.fieldType = data.field;
        this.countries = data.countries;
        this.newCountryId = this.countryId = data.coId;

        this.regions = data.regions;
        this.newRegionId = this.regionId = data.rId;

        this.cities = data.cities;
        this.newCityId = this.cityId = data.cId;
        console.log('data', data);

        if (this.fieldType === 'branch') {
            // this.branch.id = data.branch.id;
            // this.branch.branchId = data.branch.id;
            // this.branch.branchName = data.branch.branchName;
            // this.branch.branchCode = data.branch.branchCode;
            this.branch = data.branch;
            this.branch.cityId = data.cId;
        }
        console.log('this.branch', this.branch);

        this.form = fb.group({
            'cityId': [this.branch.cityId, Validators.required],
            // 'branchName': [this.branch.branchName, Validators.compose([Validators.required, Validators.pattern(this.patternName)])],
            'branchName': [this.branch.branchName, Validators.compose([Validators.required])],
            'branchCode': [this.branch.branchCode, Validators.compose([Validators.required])],
        })
    }

    loadRegionViaId(id) {

        this._locationService.getRegionsViaCountryId(id).subscribe(
            (res) => {
                this.regions = res.json().data;
                // console.log(this.regions);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    loadCityViaRId(id) {

        this._locationService.getCitiesViaRegionId(id).subscribe(
            (res) => {
                this.cities = res.json().data;
                // console.log(this.cities);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    onBranchFocusOut() {
        this.branch.branchName = (this.branch.branchName && this.branch.branchName.length > 0 ? this.branch.branchName.trim() : this.branch.branchName);
    }

    onCountryFocusOut(countryId = null) {

        if (this.countryId !== +this.newCountryId) {
            const country = this.countries.filter(c => c.id === +this.newCountryId);
            this.regions = [];
            this.cities = [];

            this.newRegionId = null;
            this.regionId = this.newRegionId;

            this.newCityId = null;
            this.cityId = this.newCityId;
            this.branch.cityId = this.newCityId;

            if (country.length === 0) {
                // this.isCountryValid = false;
                this.newCountryId = null;
                this.countryId = this.newCountryId;
                return;
            }
            // this.isCountryValid = true;
            this.newCountryId = country[0].id;
            this.countryId = this.newCountryId;

            this.loadRegionViaId(this.newCountryId);
        }
    }

    onRegionFocusOut(regionId = null) {

        if (this.regionId !== +this.newRegionId) {
            const region = this.regions.filter(r => r.id === +this.newRegionId);
            this.cities = [];

            this.newCityId = null;
            this.cityId = this.newCityId;
            this.branch.cityId = this.newCityId;

            if (region.length === 0) {
                // this.isCountryValid = false;
                this.newRegionId = null;
                this.regionId = this.newRegionId;
                return;
            }
            // this.isCountryValid = true;
            this.newRegionId = region[0].id;
            this.regionId = this.newRegionId;

            this.loadCityViaRId(this.newRegionId);
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        let result = {
            countryId: this.newCountryId,
            regionId: this.newRegionId,
            cityId: this.branch.cityId
        }
        const msg = new Message();
        this._setupService.updateBranch(this.branch).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully updated an branch';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');

                // this.dialogRef.close(this.branch);
                this.dialogRef.close(result);
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }

}



@Component({
    selector: 'delete-branch',
    templateUrl: '../../../../shared/dialogs/admin.confirm.field.delete.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class DeleteBranchField {
    fieldType: string;
    id: number;
    name: string;
    constructor(
        public dialogRef: MatDialogRef<DeleteBranchField>,
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
        this._setupService.deleteBranch(this.id).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully deleted an branch';
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

