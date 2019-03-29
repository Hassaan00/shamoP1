import { Component, Input, OnInit, Inject, Output, EventEmitter, AfterViewInit, ViewChildren, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { User } from '../../../../core/models/user';
import { Message, MessageTypes } from '../../../../core/models/message';
import { Country } from '../../../../core/models/country';
import { Region } from '../../../../core/models/region';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { AdminSetupService } from '../../../../core/services/admin/admin.setup.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { UtilityService } from '../../../../core/services/general/utility.service';


@Component({
    selector: 'region-list',
    templateUrl: 'region.component.html',
    styleUrls: ['../setup.forms.css', '../../admin.component.css']
})
export class RegionComponent implements OnInit, OnChanges {

    isLogin: any;
    // getURL: string;
    // admins = new Array<any>();
    // region: Region = new Region();

    countries: Country[] = [];
    countryId: number;
    newCountryId: number;
    regions: Region[] = [];

    regionListPermission = true;
    addPermission = true;
    assignPermission = true;
    updatePermission = true;
    deletePermission = true;

    user: User = new User();

    displayedColumns = ['sNo', 'regionName', 'action'];
    dataSource = new MatTableDataSource<Region>(this.regions);
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
        private _locationService: LocationService,
    ) {

    }

    ngOnInit(): void {
        // Applying permission
        this.user = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();

        this.addPermission = this.utilityService.checkUserPermission(this.user, 'region_add');
        this.assignPermission = this.utilityService.checkUserPermission(this.user, 'region_add');
        this.updatePermission = this.utilityService.checkUserPermission(this.user, 'region_update');
        this.deletePermission = this.utilityService.checkUserPermission(this.user, 'region_delete');

        this.regionListPermission = this.utilityService.checkUserPermission(this.user, 'region_list');
        console.log('regionListPermission', this.regionListPermission);

        if (this.regionListPermission) {
            this.loadCountryList();
            // this.loadRegionList();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

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

        if (this.newCountryId) {
            this.pageIndex = 0;
            this.loadRegionViaId(this.newCountryId);
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
        if (this.regionListPermission) {
            this.isSpinner = true;
            this.filter = "";
            this.dataSource.filter = null;
            const msg = new Message();
            if (this.newCountryId) {
                this.loadRegionViaId(this.newCountryId);
            }
            else {
                msg.msg = 'Please, select country';
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, '');
                this.isSpinner = false;
            }
        }
    }

    loadCountryList() {
        // if (this.regionListPermission) {
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

    // on change or focusout
    onCountryFocusOut(countryId = null) {
        if (this.countryId !== +this.newCountryId) {
            const country = this.countries.filter(c => c.id === +this.newCountryId);
            this.regions = [];

            this.dataSource = new MatTableDataSource<Region>(this.regions);
            this.dataSource.paginator = this.paginator;

            if (country.length === 0) {
                this.newCountryId = null;
                this.countryId = this.newCountryId;
                // this.loadRegionViaId(0);
                return;
            }
            // this.isCountryValid = true;
            this.newCountryId = country[0].id;
            this.countryId = this.newCountryId;

            this.loadRegionViaId(this.newCountryId);
        }
    }

    loadRegionViaId(id) {
        if (this.regionListPermission) {

            this.regions = [];
            this.dataSource = new MatTableDataSource<Region>(this.regions);

            this.isSpinner = true;
            const msg = new Message();
            this._setupService.getRegionViaCountryIdListCount(id, this.filter).subscribe(
                (res1) => {
                    this.length = res1.json().data;
                    this._setupService.getRegionsWithPgno(id, this.pageIndex, this.pageSize, this.filter).subscribe(
                        (res) => {
                            this.regions = res.json().data;
                            this.dataSource = new MatTableDataSource<Region>(this.regions);
                            // this.dataSource.paginator = this.paginator;

                            if (this.regions.length === 0) {
                                msg.msg = 'No Regions Found';
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
                            this.regions = [];
                            this.dataSource = new MatTableDataSource<Region>(this.regions);
                        }
                    );
                },
                (err) => {
                    console.log(err);
                    this._authService.errStatusCheckResponse(err);
                    this.isSpinner = false;
                    this.regions = [];
                    this.dataSource = new MatTableDataSource<Region>(this.regions);
                }
            );
        } else {
            this.isSpinner = false;
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
        }
    }

    loadRegionList() {
        if (this.regionListPermission) {
            this.isSpinner = true;
            const msg = new Message();
            this._setupService.getRegions().subscribe(
                (res) => {
                    this.regions = res.json().data;
                    // console.log(this.regions);
                    this.dataSource = new MatTableDataSource<Region>(this.regions);
                    // this.dataSource.paginator = this.paginator;

                    if (this.regions.length == 0) {
                        msg.msg = 'No Regions Found';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiService.showToast(msg, 'info');
                    }
                    this.isSpinner = false;
                },
                (err) => {
                    console.log(err);
                    this._authService.errStatusCheckResponse(err);
                    this.dataSource = new MatTableDataSource<Region>(this.regions);
                    this.isSpinner = false;
                }
            );
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
        this.loadRegionViaId(this.newCountryId);

    }

    addField(field) {
        if (this.addPermission) {
            const dialogRef = this.dialog.open(AddRegionField, {
                width: '450px',
                data: { field, countries: this.countries }
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.loadRegionList();
                this.newCountryId = result && result.countryId ? result.countryId : this.newCountryId;
                if (this.newCountryId) {
                    this.filter = "";
                    this.dataSource.filter = null;
                    this.loadRegionViaId(this.newCountryId);
                }
                // else{
                //     this.refreshList();
                // }
            });
        }
    }

    onAssign(region, index = null) {
        // console.log('value', value, '---id', id);

    }

    onEdit(value, id, name, tooltip, placeholder, coId) {
        // console.log('value', value, '---id', id);
        if (this.updatePermission) {
            const dialogRef = this.dialog.open(EditRegionField, {
                width: '450px',
                data: { value, id, name, tooltip, placeholder, coId, countries: this.countries }
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.loadRegionList();
                this.newCountryId = result && result.countryId ? result.countryId : this.newCountryId;
                this.filter = "";
                this.dataSource.filter = null;
                this.loadRegionViaId(this.newCountryId);
            });
        }
    }

    onDelete(value, id, name) {
        if (this.deletePermission) {
            const dialogRef = this.dialog.open(DeleteRegionField, {
                width: '450px',
                data: { value, id, name }
            });
            // console.log('value', value, '---id', id);
            dialogRef.afterClosed().subscribe(result => {
                // this.loadRegionList();
                this.filter = "";
                this.dataSource.filter = null;
                this.loadRegionViaId(this.newCountryId);
            });
        }
    }
}


@Component({
    selector: 'add-region',
    templateUrl: '../../../../shared/dialogs/admin.add.field.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class AddRegionField {

    title = "Add New Region";
    region: Region = new Region();
    countries: Country[] = [];
    // country: Country = new Country();
    fieldType: string;
    form: FormGroup;
    // patternName = /^[A-Za-z ]+$/;

    constructor(
        public dialogRef: MatDialogRef<AddRegionField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
        private fb: FormBuilder
    ) {
        this.fieldType = data.field;
        this.countries = data.countries;

        // console.log('region', this.region);
        // console.log('data', this.fieldType);
        this.form = fb.group({
            'countryId': [this.region.countryId, Validators.required],
            // 'regionName': [this.region.regionName, Validators.compose([Validators.required, Validators.pattern(this.patternName)])],
            'regionName': [this.region.regionName, Validators.compose([Validators.required])],
        });

    }

    onRegionFocusOut() {
        this.region.regionName = (this.region.regionName && this.region.regionName.length > 0 ? this.region.regionName.trim() : this.region.regionName);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        const msg = new Message();
        this._setupService.addRegion(this.region).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully added an region';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close(this.region);
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }

}


@Component({
    selector: 'edit-region',
    templateUrl: '../../../../shared/dialogs/admin.add.field.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class EditRegionField {

    title = "Edit Region";
    region: Region = new Region();
    countries: Country[] = [];
    // country: Country = new Country();
    fieldType: string;
    form: FormGroup;
    // patternName = /^[A-Za-z ]+$/;

    constructor(
        public dialogRef: MatDialogRef<EditRegionField>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        // private _router: Router, 
        private _setupService: AdminSetupService,
        private fb: FormBuilder
    ) {
        this.fieldType = data.value;
        this.countries = data.countries;
        console.log('data', data);

        if (this.fieldType === 'region') {
            this.region.id = data.id;
            this.region.regionId = data.id;
            this.region.regionName = data.name;
            this.region.countryId = data.coId;
        }
        console.log('this.region', this.region);

        this.form = fb.group({
            'countryId': [this.region.countryId, Validators.required],
            // 'regionName': [this.region.regionName, Validators.compose([Validators.required, Validators.pattern(this.patternName)])],
            'regionName': [this.region.regionName, Validators.compose([Validators.required])],
        })
    }

    onRegionFocusOut() {
        this.region.regionName = (this.region.regionName && this.region.regionName.length > 0 ? this.region.regionName.trim() : this.region.regionName);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        const msg = new Message();
        this._setupService.updateRegion(this.region).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully updated an region';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
                this.dialogRef.close(this.region);
            },
            (err) => {
                console.log(err);
                this._authService.errStatusCheckResponse(err);
            });
    }

}



@Component({
    selector: 'delete-region',
    templateUrl: '../../../../shared/dialogs/admin.confirm.field.delete.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class DeleteRegionField {
    fieldType: string;
    id: number;
    name: string;
    constructor(
        public dialogRef: MatDialogRef<DeleteRegionField>,
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
        console.log('data', this.fieldType);

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(field) {
        const msg = new Message();
        this._setupService.deleteRegion(this.id).subscribe(
            (res) => {
                msg.msg = res.json().message ? res.json().message : 'You have successfully deleted an region';
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




