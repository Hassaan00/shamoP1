import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Message, MessageTypes } from '../../../../core/models/message';
import { User } from '../../../../core/models/user';
import { Designation } from '../../../../core/models/designation';
import { Department } from '../../../../core/models/department';
import { Role } from '../../../../core/models/role';
import { Country } from '../../../../core/models/country';
import { Region } from '../../../../core/models/region';
import { City } from '../../../../core/models/city';
import { Branch } from '../../../../core/models/branch';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { AdminSetupService } from '../../../../core/services/admin/admin.setup.service';
// import { AdminRoles } from '../../../core/models/admin/role.model';
import { UtilityService } from '../../../../core/services/general/utility.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { UIService } from '../../../../core/services/ui/ui.service';

import { Config } from '../../../../config/config';

@Component({
    selector: 'user-add',
    moduleId: module.id,
    templateUrl: 'user.add.component.html',
    styleUrls: ['./../users.css']
})
export class UserAddComponent implements OnInit {

    @Input() childForPermission: boolean = true;

    title = "Add";
    isLogin: any;

    // patternEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    tooltipEmail = Config.pattern.email.tooltip;
    patternEmail = Config.pattern.email.regex;
    maxLengthEmail = Config.pattern.email.maxLength;

    // patternName = /^[A-Za-z ]+$/;
    // patternSapId = /^[A-Za-z0-9]+$/;
    tooltipSapId = Config.pattern.sapId.tooltip;
    patternSapId = Config.pattern.sapId.regex;
    maxLengthSapId = Config.pattern.sapId.maxLength;

    maxLengthFName = Config.pattern.fName.maxLength;

    maxLengthLName = Config.pattern.lName.maxLength;

    tooltipMobile = Config.pattern.mobileNo.tooltip;
    patternMobile = Config.pattern.mobileNo.regex;    // 0347-1234567
    maxLengthMobile = Config.pattern.mobileNo.maxLength;

    tooltipPhone = Config.pattern.phoneNo.tooltip;
    patternPhone = Config.pattern.phoneNo.regex;   // 021-12345678
    maxLengthPhone = Config.pattern.phoneNo.maxLength;

    tooltipPassword = Config.pattern.password.tooltip;
    patternPassword = Config.pattern.password.regex;   // 021-12345678
    // passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,20}$/;

    tooltipCNIC = Config.pattern.cnic.tooltip;
    patternCNIC = Config.pattern.cnic.regex;   // 42101-1234567-1
    maxLengthCNIC = Config.pattern.cnic.maxLength;

    phide = true;
    cphide = true;
    isEmailAvailable = false;

    isSubmitted = false;

    isDesignationValid = true;
    isDepartmentValid = true;
    isRoleValid = false;
    isCountryValid = true;
    isRegionValid = true;
    isCityValid = true;
    isBranchValid = true;

    designationCtrl: FormControl;
    departmentCtrl: FormControl;
    roleCtrl: FormControl;
    countryCtrl: FormControl;
    regionCtrl: FormControl;
    cityCtrl: FormControl;
    branchCtrl: FormControl;

    filteredDesignations: any;
    filteredDepartments: any;
    filteredRoles: any;
    filteredCountries: any;
    filteredRegions: any;
    filteredCities: any;
    filteredBranches: any;

    designations: Designation[] = [];
    departments: Department[] = [];
    roles: Role[] = [];
    countries: Country[] = [];
    regions: Region[] = [];
    cities: City[] = [];
    branches: Branch[] = [];

    newUser: User = new User();
    userForm: User = new User();
    user: User = new User();

    userId: number;

    successResponse: any;
    errorResponse: any;
    //  disable: boolean = false
    avialableSapId: boolean = true;
    avialableEmail: boolean = true;

    signin: boolean;

    formRegister: FormGroup;

    addPermission: boolean = false;
    registerButtonTooltip = "";

    private ngUnsubscribe: Subject<any> = new Subject();

    passwordMatcher = (control: AbstractControl): { [key: string]: boolean } => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (!password || !confirmPassword) return null;
        return password.value === confirmPassword.value ? null : { nomatch: true };
        // if (password != confirmPassword) {
        //     console.log('false');
        //     control.get('confirmPassword').setErrors({ MatchPassword: true })
        // } else {
        //     console.log('true');
        //     return null
        // }
    };

    MatchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password != confirmPassword) {
            console.log('false');
            AC.get('confirmPassword').setErrors({ matchPassword: true });
        } else {
            console.log('true');
            // AC.get('confirmPassword').setErrors(null)
            return null
        }
    }

    constructor(@Inject('IAuthService') private _authService: IAuthService,
        private _adminService: AdminService,
        private _adminSetupService: AdminSetupService,
        private utilityService: UtilityService,
        private _locationService: LocationService,
        private route: ActivatedRoute,
        private _uiServices: UIService,
        private _router: Router,
        private fb: FormBuilder
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
        }
            // , {
            //         validator: this.MatchPassword // your validation method
            //         // validator: this.passwordMatcher // your validation method
            //     }
        );

        const sub = _router.events.takeUntil(this.ngUnsubscribe).subscribe(
            (event) => {
                if (event instanceof NavigationEnd) {
                    let id = null;
                    id = this.route.snapshot.params['id'];

                    // let id = this.route.snapshot.params['id'];

                    if (id) {
                        this.title = "Update";
                        this.userId = id;
                        console.log('id from constructor testing', id);
                        // this.brandDetails = new BrandCampaignListModel();
                        this.loadUserDetails(id);
                    }
                }
            }
        );

        this.designationCtrl = new FormControl();
        this.filteredDesignations = this.designationCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterDesignations(name));

        this.departmentCtrl = new FormControl();
        this.filteredDepartments = this.departmentCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterDepartments(name));

        this.roleCtrl = new FormControl();
        this.filteredRoles = this.roleCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterRoles(name));

        this.countryCtrl = new FormControl();
        this.filteredCountries = this.countryCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterCountries(name));

        this.regionCtrl = new FormControl();
        this.filteredRegions = this.regionCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterRegions(name));

        this.cityCtrl = new FormControl();
        this.filteredCities = this.cityCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterCities(name));

        this.branchCtrl = new FormControl();
        this.filteredBranches = this.branchCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterBranches(name));


    }

    loadUserDetails(id) {

        console.log("id", id);

        this._uiServices.showSpinner();
        this._adminService.getUserDetails(id).subscribe(
            (res) => {
                this._uiServices.hideSpinner();
                console.log("response user", res);

                this.newUser = this.userForm = this._adminService.mapUser(res.json()[0]);

                console.log("newUser", this.newUser);

            },
            (err) => {
                console.log("error", err);
                this._uiServices.hideSpinner();
            }
        )

    }

    // filterDesignations(val: string) {
    //     if (val && val !== '') {
    //         return this.designations.filter(d => d.designationName.toLowerCase().indexOf(val.toLowerCase()) === 0);
    //     } else {
    //         return this.designations;
    //     }
    // }

    filterDesignations(val: any) {
        // console.log("test111 ", val);
        if (val && val !== '') {
            if (val.designationName) {
                return this.designations.filter(d => d.designationName.toLowerCase().indexOf(val.designationName.toLowerCase()) === 0);
                // return this.designations.filter(d => d.designationId == val.designationId);
            }
            return this.designations.filter(d => d.designationName.toLowerCase().indexOf(val.toLowerCase()) === 0);
            // return this.designations.filter(d => d.designationId == val.designationId);
        } else {
            return this.designations;
        }
    }

    selectedDesignationName() {
        // console.log("-", this.user);
        // return auto ? auto.designationName : auto;
        return (val) => this.designationFn(val);
    }

    designationFn(auto): string {
        // console.log("--");
        // console.log(auto);
        this.user.departmentId = auto ? auto.designationId : null;
        // console.log("--", this.user);
        return auto ? auto.designationName : auto;
    }

    filterDepartments(val: string) {
        if (val && val !== '') {
            return this.departments.filter(d => d.departmentName.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.departments;
        }
    }

    filterRoles(val: string) {
        if (val && val !== '') {
            return this.roles.filter(r => r.roleName.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.roles;
        }
    }

    filterCountries(val: string) {
        if (val && val !== '') {
            return this.countries.filter(c => c.countryName.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.countries;
        }
    }

    filterRegions(val: string) {
        if (val && val !== '') {
            return this.regions.filter(r => r.regionName.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.regions;
        }
    }

    filterCities(val: string) {
        if (val && val !== '') {
            return this.cities.filter(ct => ct.cityName.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.cities;
        }
    }

    filterBranches(val: string) {
        if (val && val !== '') {
            return this.branches.filter(b => b.branchName.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.branches;
        }
    }


    ngOnInit(): void {
        this.user = this._authService.getUser();

        // this.isLogin = this._authService.isLoggedIn();
        // if (!this._authService.isLoggedIn()) {
        //     this._router.navigateByUrl('login');
        // }

        // this._authServices.currentMessage.subscribe(value => this.signin = value)
        // let isLoggedIn = this._authServices.checkToken()
        // if (isLoggedIn) {
        //     this._router.navigate(['home']);
        // }

        // this.addPermission = this.utilityService.checkUserPermission(this.user, 'add_user');
        this.addPermission = this.utilityService.checkUserPermission(this.user, 'user_add');
        this.registerButtonTooltip = this.utilityService.getUserPermissionTooltipMsg(this.addPermission, this.isSubmitted, "Submit");
        if (this.childForPermission) {
            if (this.addPermission) {
                this.loadCountries();
                this.loadDesignations();
                this.loadDepartments();
                this.loadRoles();
            }
            else {
                this._router.navigate(['/permission']);
            }

        }
        else {
            this.loadCountries();
            this.loadDesignations();
            this.loadDepartments();
            this.loadRoles();
        }


    }

    loadDesignations() {
        this._adminSetupService.getDesignations().subscribe(
            (res) => {
                // this.designations = res.json().genericBody.data.designations;
                this.designations = res.json().data;
                this.filterDesignations('');
            },
            (err) => console.log(err)
        );
    }

    loadDepartments() {
        this._adminSetupService.getDepartments().subscribe(
            (res) => {
                // this.departments = res.json().genericBody.data.departments;
                this.departments = res.json().data;
                this.filterDepartments('');
            },
            (err) => console.log(err)
        );
    }

    loadRoles() {
        this.roles = [];
        // console.log("test load role", departmentId)
        // this._adminSetupService.getRolesViaDepartmentId(this.newUser.departmentId).subscribe(
        this._adminSetupService.getRoles().subscribe(
            (res) => {
                // this.roles = res.json().genericBody.data.roles;
                this.roles = res.json().data;
                this.isRoleValid = true;

                this.filterRoles('');

                if (this.roles.length == 0) {
                    this.isRoleValid = false;
                }
            },
            (err) => {
                console.log(err)
                this.isRoleValid = false;
            }
        );
    }

    loadRolesViaDepartmentId(departmentId) {
        this.roles = [];
        // console.log("test load role", departmentId)
        // this._adminSetupService.getRolesViaDepartmentId(this.newUser.departmentId).subscribe(
        this._adminSetupService.getRolesViaDepartmentId(departmentId).subscribe(
            (res) => {
                // this.roles = res.json().genericBody.data.roles;
                this.roles = res.json().data;
                this.isRoleValid = true;

                this.filterRoles('');

                if (this.roles.length == 0) {
                    this.isRoleValid = false;
                }
            },
            (err) => {
                console.log(err)
                this.isRoleValid = false;
            }
        );
    }

    loadCountries() {
        this._locationService.getCountries().subscribe(
            (res) => {
                // this.countries = res.json().genericBody.data.countries;
                this.countries = res.json().data;
                this.filterCountries('');
            },
            (err) => console.log(err)
        );
    }

    loadRegions(countryId) {
        // this._locationService.getRegionsViaCountryId(this.newUser.countryId).subscribe(
        this._locationService.getRegionsViaCountryId(countryId).subscribe(
            (res) => {
                // this.regions = res.json().genericBody.data.regions;
                this.regions = res.json().data;
                // console.log('test111', res.json());
                this.filterRegions('');
            },
            (err) => console.log(err)
        );
    }

    loadCities(regionId) {
        // this._locationService.getCitiesViaRegionId(this.newUser.regionId).subscribe(
        this._locationService.getCitiesViaRegionId(regionId).subscribe(
            (res) => {
                // this.cities = res.json().genericBody.data.cities;
                this.cities = res.json().data;

                this.filterCities('');
            },
            (err) => console.log(err)
        );
    }

    loadBranches(cityId) {
        // this._locationService.getBranchesViaCityId(this.newUser.cityId).subscribe(
        this._locationService.getBranchesViaCityId(cityId).subscribe(
            (res) => {
                // this.branches = res.json().genericBody.data.branches;
                this.branches = res.json().data;

                this.filterBranches('');
            },
            (err) => console.log(err)
        );
    }

    onSapIdFocusOut() {

        // console.log("test"+)
        // this.userForm.sapId = this.newUser.sapId
        // if (this.userForm.sapId !== this.newUser.sapId) {

        this.userForm.sapId = this.newUser.sapId = (this.newUser.sapId && this.newUser.sapId.length > 0 ? this.newUser.sapId.trim() : this.newUser.sapId);
        // this.formRegister.controls['sapId'].updateValueAndValidity();
        this.formRegister.get('sapId').updateValueAndValidity();



        setTimeout(() => {

            if (this.newUser.sapId && this.newUser.sapId.length > 0 && this.formRegister.controls['sapId'].valid) {

                this._uiServices.showSpinner();

                this._authService.checkSapIdAvailability(this.newUser.sapId)
                    .subscribe(
                        // () => this.isSapIdAvailable = true,
                        // (err) => this.isSapIdAvailable = false
                        (res) => {
                            this._uiServices.hideSpinner();
                            if (res.json().data) {
                                console.log("sap id is available");
                            }
                            else {
                                console.log("sap id is not available");
                                this.formRegister.controls.sapId.setErrors({ notAvailable: true });
                            }
                        },
                        (err) => {
                            this._uiServices.hideSpinner();
                            let msg;
                            msg = this._authService.errStatusCheckResponse(err);
                            // console.log("msg",msg);
                            // this._uiServices.showToast(msg, '');
                            // this.formRegister.controls.email.setErrors({ notAvailable: true });
                            // this.formRegister.controls['email'].setErrors({ notAvailable: true });
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
            else {

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

    onEmailFocusOut() {

        // this.userForm.email = this.newUser.email
        // if (this.userForm.email !== this.newUser.email) {

        this.userForm.email = this.newUser.email = (this.newUser.email && this.newUser.email.length > 0 ? this.newUser.email.trim() : this.newUser.email);
        // this.formRegister.controls['email'].updateValueAndValidity();
        this.formRegister.get('email').updateValueAndValidity();


        setTimeout(() => {

            if (this.newUser.email && this.newUser.email.length > 0 && this.formRegister.controls['email'].valid) {
                this._uiServices.showSpinner();
                // console.log('test -- 1');
                // this._authServices.checkEmailAvailability(this.newUser.email, this.role)
                this._authService.checkEmailAvailability(this.newUser.email, "")
                    .subscribe(
                        // () => this.isEmailAvailable = true,
                        // (err) => this.isEmailAvailable = false
                        (res) => {
                            this._uiServices.hideSpinner();
                            if (res.json().data) {
                                this.isEmailAvailable = true;
                                console.log("email is available");
                            }
                            else {
                                console.log("email is not available");
                                this.isEmailAvailable = false;
                                this.formRegister.controls.email.setErrors({ notAvailable: true });
                            }
                        },
                        (err) => {
                            this._uiServices.hideSpinner();
                            this.isEmailAvailable = false;
                            let msg;
                            msg = this._authService.errStatusCheckResponse(err);
                        }
                    );
            }
            else {

            }

        }, 500);

        // }
    }

    onPasswordFocusOut() {
        this.userForm.password = this.newUser.password = this.newUser.password.trim();
    }

    onConfirmPasswordFocusOut() {
        this.userForm.confirmPassword = this.newUser.confirmPassword = this.newUser.confirmPassword.trim();
    }

    onDesignationFocusOut(designationId) {

        const designation = this.designations.filter(d => d.id === +this.newUser.designationId);
        if (designation.length === 0) {
            // this.isCountryValid = false;
            this.newUser.designationId = null;
            this.userForm.designationId = this.newUser.designationId;

            this.newUser.designationName = null;
            this.userForm.designationName = this.newUser.designationName;
            return;
        }
        // this.isCountryValid = true;
        this.newUser.designationId = designation[0].id;
        this.userForm.designationId = this.newUser.designationId;

        this.newUser.designationName = designation[0].designationName;
        this.userForm.designationName = this.newUser.designationName;

    }

    onDepartmentFocusOut(departmentId) {

        if (this.userForm.departmentId !== +this.newUser.departmentId) {
            // const regions = this.regions.filter(r => r.name === this.newUser.regionId);
            const department = this.departments.filter(d => d.id === +this.newUser.departmentId);
            // const department = this.departments.filter(d => d.departmentId === +departmentId);

            this.newUser.userRolePermission.roleId = null;
            this.newUser.userRolePermission.roleName = null;
            // this.roles = [];

            if (department.length === 0) {
                // this.isCountryValid = false;
                this.newUser.departmentId = null;
                this.userForm.departmentId = this.newUser.departmentId;

                this.newUser.departmentName = null;
                this.userForm.departmentName = this.newUser.departmentName;
                return;
            }
            // this.isCountryValid = true;
            this.newUser.departmentId = department[0].id;
            this.userForm.departmentId = this.newUser.departmentId;

            this.newUser.departmentName = department[0].departmentName;
            this.userForm.departmentName = this.newUser.departmentName;

            // this.loadRolesViaDepartmentId(this.newUser.departmentId);
        }
    }

    onRoleFocusOut(roleId) {

        if (this.userForm.userRolePermission.roleId !== +this.newUser.userRolePermission.roleId) {

            const role = this.roles.filter(r => r.id === +this.newUser.userRolePermission.roleId);
            // const role = this.roles.filter(r => r.roleId === +roleId);

            if (role.length === 0) {
                // this.isCountryValid = false;
                this.newUser.userRolePermission.roleId = null;
                this.userForm.userRolePermission.roleId = this.newUser.userRolePermission.roleId;

                this.newUser.userRolePermission.roleName = null;
                this.userForm.userRolePermission.roleName = this.newUser.userRolePermission.roleName;
                return;
            }
            // this.isCountryValid = true;
            this.newUser.userRolePermission.roleId = role[0].id;
            this.userForm.userRolePermission.roleId = this.newUser.userRolePermission.roleId;

            this.newUser.userRolePermission.roleName = role[0].roleName;
            this.userForm.userRolePermission.roleName = this.newUser.userRolePermission.roleName;
        }
    }

    onCountryFocusOut(countryId) {

        if (this.userForm.countryId !== +this.newUser.countryId) {
            const country = this.countries.filter(c => c.id === +this.newUser.countryId);
            // const country = this.countries.filter(c => c.countryId === +countryId);

            this.newUser.regionId = null;
            this.newUser.cityId = null;
            this.newUser.branchId = null;

            this.regions = [];
            this.cities = [];
            this.branches = [];

            if (country.length === 0) {
                // this.isCountryValid = false;
                this.newUser.countryId = null;
                this.userForm.countryId = this.newUser.countryId;

                this.newUser.country = null;
                this.userForm.country = this.newUser.country;
                return;
            }
            // this.isCountryValid = true;
            this.newUser.countryId = country[0].id;
            this.userForm.countryId = this.newUser.countryId;

            // this.newUser.country = country[0].countryName;
            this.newUser.country = country[0];
            this.userForm.country = this.newUser.country;

            this.loadRegions(this.newUser.countryId);
        }
    }

    onRegionFocusOut(regionId) {
        console.log("onRegionFocusOut")

        if (this.userForm.regionId !== +this.newUser.regionId) {
            const region = this.regions.filter(r => r.id === +this.newUser.regionId);
            // const region = this.regions.filter(r => r.regionId === +regionId);

            this.newUser.cityId = null;
            this.newUser.branchId = null;

            this.cities = [];
            this.branches = [];

            if (region.length === 0) {
                // this.isCountryValid = false;
                this.newUser.regionId = null;
                this.userForm.regionId = this.newUser.regionId;

                this.newUser.region = new Region();
                this.userForm.region = this.newUser.region;
                return;
            }
            // this.isCountryValid = true;
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
                // this.isCountryValid = false;
                this.newUser.cityId = null;
                this.userForm.cityId = this.newUser.cityId;

                this.newUser.city = new City();
                this.userForm.city = this.newUser.city;
                return;
            }
            // this.isCountryValid = true;
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
            // this.isCountryValid = false;
            this.newUser.branchId = null;
            this.userForm.branchId = this.newUser.branchId;

            this.newUser.branch = new Branch();
            this.userForm.branch = this.newUser.branch;
            return;
        }
        // this.isCountryValid = true;
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
            this.userForm.cnic = this.newUser.cnic = this.newUser.cnic + '-';
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
            this.userForm.mobileNumber = this.newUser.mobileNumber = this.newUser.mobileNumber + '-';
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
            this.userForm.phoneNumber = this.newUser.phoneNumber = this.newUser.phoneNumber + '-';

    }

    onSubmit() {

        console.log("onSubmit this.userForm", this.userForm);
        console.log("onSubmit this.newUser", this.newUser);

        this._uiServices.showSpinner();

        if (this.addPermission) {
            if (this.formRegister.valid) {

                this.isSubmitted = true;
                this.registerButtonTooltip = this.utilityService.getUserPermissionTooltipMsg(this.addPermission, this.isSubmitted, "Submit");
                const msg = new Message();
                this._adminService.createUser(this.newUser).subscribe(
                    (res) => {
                        this.isSubmitted = false;
                        this.registerButtonTooltip = this.utilityService.getUserPermissionTooltipMsg(this.addPermission, this.isSubmitted, "Submit");
                        this._uiServices.hideSpinner();
                        console.log("success");
                        // this._router.navigate(['/verification']);
                        msg.msg = res.json().message ? res.json().message : 'Successfully submit user';
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this._uiServices.showToast(msg, 'info');
                        this._router.navigate(['/admin/users/list']);
                    },
                    (err) => {
                        this.isSubmitted = false;
                        this.registerButtonTooltip = this.utilityService.getUserPermissionTooltipMsg(this.addPermission, this.isSubmitted, "Submit");
                        console.log("err", err);
                        this._uiServices.hideSpinner();
                        this._authService.errStatusCheckResponse(err);

                    }
                );

            }
            else {
                // console.log("asd")
                this.validateAllFormFields(this.formRegister);
                this._uiServices.hideSpinner();
            }
        }
        else {
            let msg = this.utilityService.permissionMsg();
            this._uiServices.showToast(msg, '');
            this._uiServices.hideSpinner();
        }


    }

    validateAllFormFields(formGroup: FormGroup) {         //{1}
        Object.keys(formGroup.controls).forEach(field => {  //{2}
            const control = formGroup.get(field);             //{3}
            if (control instanceof FormControl) {             //{4}
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {        //{5}
                this.validateAllFormFields(control);            //{6}
            }
        });
    }

}
