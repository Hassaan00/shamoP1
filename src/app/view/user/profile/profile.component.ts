import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { startWith, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { User } from '../../../core/models/user';
import { Message, MessageTypes } from '../../../core/models/message';

import { IAuthService } from "../../../core/services/auth/iauth.service";
import { UserService } from '../../../core/services/user/user.service';
import { UIService } from '../../../core/services/ui/ui.service';
import { AdminService } from '../../../core/services/admin/admin.service';
import { UtilityService } from '../../../core/services/general/utility.service';


@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
    loggedInUser: User = new User();
    user: User = new User();
    userId: number;
    profilePic: string;

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(@Inject('IAuthService') private _authService: IAuthService,
        private route: ActivatedRoute, private _userService: UserService,
        private _router: Router, private _uiService: UIService,
        private _adminService: AdminService,
        private utilityService: UtilityService
    ) {

    }


    ngOnInit(): void {
        this.loggedInUser = this._authService.getUser();
        // this.userId = this.loggedInUser.id;
        // this._userService.getStatus().subscribe(
        //     (res) => {
        //         this.user = res.json().data[0];
        //         console.log('get Status', this.user);
        //         this.userId = this.user.id;
        //         if (this.user.profilePicture && this.user.profilePicture.documentUrl) {
        //             console.log('get Status', this.user.profilePicture.documentUrl);

        //             this.profilePic = this.user.profilePicture.documentUrl;
        //         } else {
        //             // this.profilePic = 'assets/img/user.png';
        //         }
        //     }
        // );

        this.loadUser();



    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
    }

    loadUser() {
        this._uiService.showSpinner();

        this._userService.getUserByIdNew(this.loggedInUser.id).subscribe(
            (res) => {
                this._uiService.hideSpinner();

                const user = res.data;
                this.userId = this.loggedInUser.id;
                // this._userService.mapUser(user);
                // this._adminService.mapUser(user);

                // this.newUser = user;
                this.user = this._adminService.mapUser(user);
                if (this.user.profilePicture && this.user.profilePicture.documentUrl) {
                    console.log('get Status', this.user.profilePicture.documentUrl);

                    this.profilePic = this.user.profilePicture.documentUrl;
                } else {
                    // this.profilePic = 'assets/img/user.png';
                }
                console.log('this.user', this.user);
            },
            (err) => {
                console.log("err", err);
                this._uiService.hideSpinner();
                this._authService.errStatusCheckResponse(err);
            }
        );
    }

    editProfile() {
        this._router.navigate(['/user/edit/profile']);
    }


}

