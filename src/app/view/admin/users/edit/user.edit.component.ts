import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

// models
import { User } from '../../../../core/models/user';
import { Message, MessageTypes } from '../../../../core/models/message';
import { Designation } from '../../../../core/models/designation';
import { Department } from '../../../../core/models/department';
import { Region } from '../../../../core/models/region';
import { Country } from '../../../../core/models/country';
import { City } from '../../../../core/models/city';
import { Branch } from '../../../../core/models/branch';
// services
import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { AdminSetupService } from '../../../../core/services/admin/admin.setup.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { UserService } from '../../../../core/services/user/user.service';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { UtilityService } from '../../../../core/services/general/utility.service';
import { FormService } from '../../../../core/services/form/form.service';

import { Config } from '../../../../config/config';

@Component({
    selector: 'user-edit',
    templateUrl: 'user.edit.component.html',
})
export class UserEditComponent implements OnInit {

    @Input() childForPermission: boolean = true;

    isLogin: any;
    user: User = new User();
    isSubmitted = false;
    userId: number;
    tooltipSapId = Config.pattern.sapId.tooltip;
    patternSapId = Config.pattern.sapId.regex;
    maxLengthSapId = Config.pattern.sapId.maxLength;

    maxLengthEmail = Config.pattern.email.maxLength;

    maxLengthFName = Config.pattern.fName.maxLength;

    maxLengthLName = Config.pattern.lName.maxLength;

    tooltipCNIC = Config.pattern.cnic.tooltip;
    patternCNIC = Config.pattern.cnic.regex;   // 42101-1234567-1
    maxLengthCNIC = Config.pattern.cnic.maxLength;

    // phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;   // 123-123-1234

    tooltipMobile = Config.pattern.mobileNo.tooltip;
    patternMobile = Config.pattern.mobileNo.regex;    // 0347-1234567
    maxLengthMobile = Config.pattern.mobileNo.maxLength;

    tooltipPhone = Config.pattern.phoneNo.tooltip;
    patternPhone = Config.pattern.phoneNo.regex;   // 021-12345678
    maxLengthPhone = Config.pattern.phoneNo.maxLength;

    private ngUnsubscribe: Subject<any> = new Subject();
    isSubmited = false;
    designations: Designation[] = [];
    departments: Department[] = [];
    regions: Region[] = [];
    countries: Country[] = [];
    employeeId: number;
    cities: City[] = [];
    formRegister: FormGroup;
    branches: Branch[] = [];
    newUser: User = new User();
    userForm: User = new User();

    isDesignationValid = true;
    isDepartmentValid = true;
    isCountryValid = true;
    isRegionValid = true;
    isCityValid = true;
    isBranchValid = true;
    avialableSapId = true;

    updatePermission: boolean = false;
    submitButtonTooltip = "";

    constructor(
        @Inject('IAuthService') private _authService: IAuthService,
        private _router: Router,
        private _uiService: UIService,
        private utilityService: UtilityService,
        private route: ActivatedRoute,
        private _adminSetupService: AdminSetupService,
        private _locationService: LocationService, private _adminService: AdminService,
        private fb: FormBuilder, private _userService: UserService,
        private _formService: FormService

    ) {
        this.formRegister = fb.group({
            'sapId': [this.newUser.sapId, Validators.compose([Validators.required, Validators.pattern(this.patternSapId)])],
            'email': [this.newUser.email, Validators.compose([Validators.required, Validators.email])],
            'firstName': [this.newUser.firstName, Validators.compose([Validators.required])],
            'lastName': [this.newUser.lastName, Validators.compose([Validators.required])],
            'designationId': [this.newUser.designationId, Validators.compose([Validators.required])],
            'departmentId': [this.newUser.departmentId, Validators.compose([Validators.required])],
            'roleId': [this.newUser.userRolePermission.roleId, Validators.compose([Validators.required])],
            'countryId': [this.newUser.countryId, Validators.compose([Validators.required])],
            'regionId': [this.newUser.regionId, Validators.compose([Validators.required])],
            'cityId': [this.newUser.cityId, Validators.compose([Validators.required])],
            'branchId': [this.newUser.branchId, Validators.compose([Validators.required])],
            'cnic': [this.newUser.cnic, Validators.compose([Validators.pattern(this.patternCNIC)])],
            'mobileNumber': [this.newUser.mobileNumber, Validators.compose([Validators.pattern(this.patternMobile)])],
            'phoneNumber': [this.newUser.phoneNumber, Validators.compose([Validators.pattern(this.patternPhone)])],
        });
        this.formRegister.controls['sapId'].disable();
        this.formRegister.controls['email'].disable();
        this.formRegister.controls['roleId'].disable();
    }

    ngOnInit(): void {
        this.user = this._authService.getUser();

        this.isLogin = this._authService.isLoggedIn();
        const id = this.route.snapshot.params['id'];
        if (id) {

            this.userId = id;
            this.loadUserById();
        } else {
            this._router.navigate(['/admin/users/list']);
            // this._userService.getStatus().subscribe(
            //     (res) => {
            //         const user = res.json().data[0];
            //         this.newUser = user;
            //         if (user.department) {
            //             this.newUser.departmentId = user.department.id;
            //         }
            //         if (user.country) {
            //             this.newUser.countryId = user.country.id;
            //             this.loadRegions(this.newUser.countryId);
            //         }
            //         if (user.city) {
            //             this.newUser.cityId = user.city.id;
            //             this.loadBranches(this.newUser.cityId);
            //         }
            //         if (user.designation) {
            //             this.newUser.designationId = user.designation.id;
            //         }
            //         if (user.branch) {
            //             this.newUser.branchId = user.branch.id;
            //         }
            //         if (user.region) {
            //             this.newUser.regionId = user.region.id;
            //             this.loadCities(this.newUser.regionId);
            //         }
            //         console.log('get Status', this.user);
            //         this.userId = this.user.id;
            //     }
            // );
        }

        this.updatePermission = this.utilityService.checkUserPermission(this.user, 'user_edit');
        this.submitButtonTooltip = this.utilityService.getUserPermissionTooltipMsg(this.updatePermission, this.isSubmitted, "Update");
        if (this.childForPermission) {
            if (this.updatePermission) {
                this.loadCountries();
                this.loadDesignations();
                this.loadDepartments();
            }
            else {
                // this._router.navigate(['/permission']);
            }

        }
        else {
            this.loadCountries();
            this.loadDesignations();
            this.loadDepartments();
        }
    }

    loadUserById() {
        this._uiService.showSpinner();

        this._userService.getUserById(this.userId).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                this._uiService.hideSpinner();

                const user = res.data;
                console.log('u Object', user);
                // this.newUser = user;
                this.newUser = this._adminService.mapUser(user);
                console.log('newUser', this.newUser);
                if (user.department) {
                    this.newUser.departmentId = user.department.id;
                }
                if (user.country) {
                    this.newUser.countryId = user.country.id;
                    this.loadRegions(this.newUser.countryId);
                }
                if (user.city) {
                    this.newUser.cityId = user.city.id;
                    this.loadBranches(this.newUser.cityId);
                }
                if (user.branch) {
                    this.newUser.branchId = user.branch.id;
                }
                if (user.designation) {
                    this.newUser.designationId = user.designation.id;
                }
                if (user.region) {
                    this.newUser.regionId = user.region.id;
                    this.loadCities(this.newUser.regionId);
                }
                console.log('get Status', this.user);
                this.userId = this.user.id;
            },
            (err) => {
                console.log(err);
                this._uiService.hideSpinner();
                this._authService.errStatusCheckResponse(err);
            }
        );
    }

    loadDesignations() {
        this._adminSetupService.getDesignations().subscribe(
            (res) => {
                this.designations = res.json().data;
            },
            (err) => console.log(err)
        );
    }

    loadDepartments() {
        this._adminSetupService.getDepartments().subscribe(
            (res) => {
                this.departments = res.json().data;
            },
            (err) => console.log(err)
        );
    }

    loadCountries() {
        this._locationService.getCountries().subscribe(
            (res) => {
                this.countries = res.json().data;
            },
            (err) => console.log(err)
        );
    }

    loadCities(regionId) {
        this._locationService.getCitiesViaRegionId(regionId).subscribe(
            (res) => {
                this.cities = res.json().data;
            },
            (err) => console.log(err)
        );
    }

    loadRegions(countryId) {

        this._locationService.getRegionsViaCountryId(countryId).subscribe(
            (res) => {
                this.regions = res.json().data;
            },
            (err) => console.log(err)
        );
    }

    loadBranches(cityId) {
        this._locationService.getBranchesViaCityId(cityId).subscribe(
            (res) => {
                this.branches = res.json().data;
            },
            (err) => console.log(err)
        );
    }

    onSapIdFocusOut() {

        this.userForm.sapId = this.newUser.sapId = (this.newUser.sapId && this.newUser.sapId.length > 0 ? this.newUser.sapId.trim() : this.newUser.sapId);
        this.formRegister.get('sapId').updateValueAndValidity();

        setTimeout(() => {

            if (this.newUser.sapId && this.newUser.sapId.length > 0 && this.formRegister.controls['sapId'].valid) {
                this._authService.checkSapIdAvailability(this.newUser.sapId)
                    .subscribe(
                        (res) => {
                            if (res.json().data) {
                                console.log("sap id is available");
                            }
                            else {
                                console.log("sap id is not available");
                                this.formRegister.controls.sapId.setErrors({ notAvailable: true });
                            }
                        },
                        (err) => {
                            let msg;
                            msg = this._authService.errStatusCheckResponse(err);
                            if (err.status == 404) {

                            }
                            else {
                                // msg = this._authServices.errStatusCheck(err);
                                // this._uiServices.showToast(msg);
                            }
                            // console.log(this.formRegister.controls['email'])
                        }
                    );
            }

        }, 500);

        // }
    }

    onFirstNameFocusOut() {
        this.userForm.firstName = this.newUser.firstName = (this.newUser.firstName && this.newUser.firstName.length > 0 ? this.newUser.firstName.trim() : this.newUser.firstName);
    }

    onLastNameFocusOut() {
        this.userForm.lastName = this.newUser.lastName = (this.newUser.lastName && this.newUser.lastName.length > 0 ? this.newUser.lastName.trim() : this.newUser.lastName);
    }

    onMobileNumberFocusOut() {
        this.userForm.mobileNumber = this.newUser.mobileNumber = (this.newUser.mobileNumber && this.newUser.mobileNumber.length > 0 ? this.newUser.mobileNumber.trim() : this.newUser.mobileNumber);
    }

    onPhoneNumberFocusOut() {
        this.userForm.phoneNumber = this.newUser.phoneNumber = (this.newUser.phoneNumber && this.newUser.phoneNumber.length > 0 ? this.newUser.phoneNumber.trim() : this.newUser.phoneNumber);
    }

    onDesignationFocusOut(designationId) {

        const designation = this.designations.filter(d => d.id === +this.newUser.designationId);
        if (designation.length === 0) {
            this.newUser.designationId = null;
            this.userForm.designationId = this.newUser.designationId;

            this.newUser.designationName = null;
            this.userForm.designationName = this.newUser.designationName;
            return;
        }
        this.newUser.designationId = designation[0].id;
        this.userForm.designationId = this.newUser.designationId;

        this.newUser.designationName = designation[0].designationName;
        this.userForm.designationName = this.newUser.designationName;

    }

    onDepartmentFocusOut(departmentId) {

        if (this.userForm.departmentId !== +this.newUser.departmentId) {
            const department = this.departments.filter(d => d.id === +this.newUser.departmentId);

            if (department.length === 0) {
                this.newUser.departmentId = null;
                this.userForm.departmentId = this.newUser.departmentId;

                this.newUser.departmentName = null;
                this.userForm.departmentName = this.newUser.departmentName;
                return;
            }
            this.newUser.departmentId = department[0].id;
            this.userForm.departmentId = this.newUser.departmentId;

            this.newUser.departmentName = department[0].departmentName;
            this.userForm.departmentName = this.newUser.departmentName;
        }
    }

    onCountryFocusOut(countryId) {

        if (this.userForm.countryId !== +this.newUser.countryId) {
            const country = this.countries.filter(c => c.id === +this.newUser.countryId);
            this.newUser.regionId = null;
            this.newUser.cityId = null;
            this.newUser.branchId = null;

            this.regions = [];
            this.cities = [];
            this.branches = [];

            if (country.length === 0) {
                this.newUser.countryId = null;
                this.userForm.countryId = this.newUser.countryId;
                this.newUser.country = null;
                this.userForm.country = this.newUser.country;
                return;
            }
            this.newUser.countryId = country[0].id;
            this.userForm.countryId = this.newUser.countryId;

            // this.newUser.country = country[0].countryName;
            this.newUser.country = country[0];
            this.userForm.country = this.newUser.country;

            this.loadRegions(this.newUser.countryId);
        }
    }

    onRegionFocusOut(regionId) {

        if (this.userForm.regionId !== +this.newUser.regionId) {
            const region = this.regions.filter(r => r.id === +this.newUser.regionId);
            this.newUser.cityId = null;
            this.newUser.branchId = null;

            this.cities = [];
            this.branches = [];

            if (region.length === 0) {
                this.newUser.regionId = null;
                this.userForm.regionId = this.newUser.regionId;

                this.newUser.region = null;
                this.userForm.region = this.newUser.region;
                return;
            }
            this.newUser.regionId = region[0].id;
            this.userForm.regionId = this.newUser.regionId;

            // this.newUser.region = region[0].regionName;
            this.newUser.region = region[0];
            this.userForm.region = this.newUser.region;

            this.loadCities(this.newUser.regionId);
        }
    }

    onCityFocusOut(cityId) {

        if (this.userForm.cityId !== +this.newUser.cityId) {

            const city = this.cities.filter(ct => ct.id === +this.newUser.cityId);

            this.newUser.branchId = null;
            this.branches = [];

            if (city.length === 0) {
                this.newUser.cityId = null;
                this.userForm.cityId = this.newUser.cityId;

                this.newUser.city = null;
                this.userForm.city = this.newUser.city;
                return;
            }
            this.newUser.cityId = city[0].id;
            this.userForm.cityId = this.newUser.cityId;

            // this.newUser.city = city[0].cityName;
            this.newUser.city = city[0];
            this.userForm.city = this.newUser.city;

            this.loadBranches(this.newUser.cityId);
        }
    }

    onBranchFocusOut() {
        const branch = this.branches.filter(b => b.id === +this.newUser.branchId);

        if (branch.length === 0) {
            this.newUser.branchId = null;
            this.userForm.branchId = this.newUser.branchId;

            this.newUser.branch = null;
            this.userForm.branch = this.newUser.branch;
            return;
        }
        this.newUser.branchId = branch[0].id;
        this.userForm.branchId = this.newUser.branchId;

        // this.newUser.branch = branch[0].branchName;
        this.newUser.branch = branch[0];
        this.userForm.branch = this.newUser.branch;
    }

    cnicFunction(event) {
        console.log("cnicFunction");

        if (event.keyCode == 8 || event.keyCode == 9
            || event.keyCode == 27 || event.keyCode == 13
            || (event.keyCode == 65 && event.ctrlKey === true))
            return;
        // if ((event.keyCode < 48 || event.keyCode > 57))
        if ((event.keyCode < 48) || (event.keyCode > 57 && event.keyCode < 96) || (event.keyCode > 105))
            event.preventDefault();

        var length = this.newUser.cnic ? this.newUser.cnic.length : 0;

        if (length == 5 || length == 13)
            this.newUser.cnic = this.newUser.cnic + '-';
        // $(this).val($(this).val() + '-');

    }

    mobileNoFunction(event) {
        console.log("mobileNoFunction");

        if (event.keyCode == 8 || event.keyCode == 9
            || event.keyCode == 27 || event.keyCode == 13
            || (event.keyCode == 65 && event.ctrlKey === true))
            return;
        // if ((event.keyCode < 48 || event.keyCode > 57))
        if ((event.keyCode < 48) || (event.keyCode > 57 && event.keyCode < 96) || (event.keyCode > 105))
            event.preventDefault();

        var length = this.newUser.mobileNumber ? this.newUser.mobileNumber.length : 0;

        if (length == 4)
            this.newUser.mobileNumber = this.newUser.mobileNumber + '-';
        // $(this).val($(this).val() + '-');

    }

    phoneNoFunction(event) {
        console.log("phoneNoFunction");

        if (event.keyCode == 8 || event.keyCode == 9
            || event.keyCode == 27 || event.keyCode == 13
            || (event.keyCode == 65 && event.ctrlKey === true))
            return;
        // if ((event.keyCode < 48 || event.keyCode > 57))
        if ((event.keyCode < 48) || (event.keyCode > 57 && event.keyCode < 96) || (event.keyCode > 105))
            event.preventDefault();

        var length = this.newUser.phoneNumber ? this.newUser.phoneNumber.length : 0;

        if (length == 3)
            this.newUser.phoneNumber = this.newUser.phoneNumber + '-';

    }

    // phoneNoFunction(event) {
    //     console.log("phoneNoFunction");

    //     console.log("check", this._formService.phoneNoFunction(event, this.newUser.phoneNumber));
    //     this.newUser.phoneNumber = this._formService.phoneNoFunction(event, this.newUser.phoneNumber);

    // }

    onSubmit() {
        this._uiService.showSpinner();
        const msg = new Message;

        if (this.updatePermission) {

            if (this.formRegister.valid) {
                // const obj = {
                //     Id: this.newUser.id,
                //     FirstName: this.newUser.firstName,
                //     LastName: this.newUser.lastName,
                //     SapId: this.newUser.sapId,
                //     DesignationId: this.newUser.designationId,
                //     Cnic: this.newUser.cnic,
                //     MobileNum: this.newUser.mobileNumber,
                //     PhoneNum: this.newUser.phoneNumber,
                //     DepartmentId: this.newUser.departmentId,
                //     BranchId: this.newUser.branchId,
                //     RegionId: this.newUser.regionId,
                //     CountryId: this.newUser.countryId,
                //     CityId: this.newUser.cityId
                // };
                this.isSubmitted = true;
                this.submitButtonTooltip = this.utilityService.getUserPermissionTooltipMsg(this.updatePermission, this.isSubmitted, "Update");

                this._adminService.updateUser(this.newUser).subscribe(
                    (res) => {
                        console.log(res);
                        this.isSubmitted = false;
                        this.submitButtonTooltip = this.utilityService.getUserPermissionTooltipMsg(this.updatePermission, this.isSubmitted, "Update");

                        this._uiService.hideSpinner();
                        msg.msg = res.json().message ? res.json().message : 'Profile data successfully saved.';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiService.showToast(msg, 'info');
                    },
                    (err) => {
                        console.log(err);
                        this.isSubmitted = false;
                        this.submitButtonTooltip = this.utilityService.getUserPermissionTooltipMsg(this.updatePermission, this.isSubmitted, "Update");
                        this._uiService.hideSpinner();
                        this._authService.errStatusCheckResponse(err);
                    }
                );

            }
            else {
                // console.log("asd")
                this._formService.validateAllFormFields(this.formRegister);
                this._uiService.hideSpinner();
            }
        }
        else {
            let msg = this.utilityService.permissionMsg();
            this._uiService.showToast(msg, '');
            this._uiService.hideSpinner();
        }

    }
}
