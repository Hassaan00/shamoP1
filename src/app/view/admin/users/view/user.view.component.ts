import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { startWith, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { User } from '../../../../core/models/user';
import { Message, MessageTypes } from '../../../../core/models/message';

import { IAuthService } from "../../../../core/services/auth/iauth.service";
import { UserService } from '../../../../core/services/user/user.service';
import { UIService } from '../../../../core/services/ui/ui.service';


@Component({
    selector: 'user-view',
    templateUrl: 'user.view.component.html',
    styleUrls: ['user.view.component.css']
})
export class UserViewComponent implements OnInit, OnDestroy {

    isLogin: any;
    loginUser: User = new User();
    user: User = new User();
    userId: number;
    profilePic: string;

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(@Inject('IAuthService') private _authService: IAuthService,
        private route: ActivatedRoute, private _userService: UserService,
        private _router: Router, private _uiService: UIService,
    ) {

    }


    ngOnInit(): void {
        this.loginUser = this._authService.getUser();
        this.isLogin = this._authService.isLoggedIn();

        const id = this.route.snapshot.params['id'];
        if (id) {
            this._uiService.showSpinner();
            this.userId = id;
            this.loadUserById();
        }

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



    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
    }

    loadUserById() {
        this._userService.getUserById(this.userId).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                this._uiService.hideSpinner();
                // const user = res.data;
                this.user = res.data;
                // this.user = res.json().data[0];
                console.log('get Status', this.user);
                this.userId = this.user.id;
                if (this.user.profilePicture && this.user.profilePicture.documentUrl) {
                    console.log('get Status', this.user.profilePicture.documentUrl);

                    this.profilePic = this.user.profilePicture.documentUrl;
                } else {
                    // this.profilePic = 'assets/img/user.png';
                }
            },
            (err) => {
                console.log(err);
                this._uiService.hideSpinner();
                this._authService.errStatusCheckResponse(err);
            }
        );
    }


    editProfile() {
        // this._router.navigate(['/user/edit/profile']);
        this._router.navigate(['/admin/users/edit', this.userId]);
    }


}

