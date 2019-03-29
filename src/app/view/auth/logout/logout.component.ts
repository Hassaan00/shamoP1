import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../core/models/user';
import { Message, MessageTypes } from '../../../core/models/message';

import { IAuthService } from '../../../core/services/auth/iauth.service';
import { UIService } from '../../../core/services/ui/ui.service';

declare var libraryVar: any;

@Component({
    // selector: 'home',
    // moduleId: module.id,
    templateUrl: 'logout.component.html',
    // styleUrls: ['home.component.css']
})

export class LogoutComponent implements OnInit {
    currentURL: string;
    isUser: User = new User();
    user: User = new User();
    entityType: string;
    redirectUrl: string;
    redirectUrl2: string;
    isLogin: any;


    constructor(@Inject('IAuthService') private _authService: IAuthService,
        private _uiService: UIService,
        private route: ActivatedRoute, private _router: Router) {
        this.currentURL = window.location.href;
    }

    ngOnInit(): void {
        // this.script.removejscssfile('filestack.js', 'js', 'chat');

        // this.entityType = this._authService.getUser().entityType;
        // console.log('entity type:', this.entityType);

        this.redirectUrl = 'login';
        this.redirectUrl2 = 'home';

        // if (this.entityType === 'influencer' || this.entityType === 'brand') {
        //     this.redirectUrl = 'login';
        // } else if (this.entityType === 'digital_agency' || this.entityType === 'influencer_agent') {
        //     this.redirectUrl = 'login';
        // } else if (this.entityType === 'backoffice') {
        //     this.redirectUrl = 'admin/login';
        // }

        this._authService.logoutUser();

        this.isUser = this._authService.getUser();
        if (this.isUser) {
            // this._router.navigateByUrl(this.redirectUrl2);
            this._router.navigate([this.redirectUrl2]);
            // return;
        } else {
            // this._router.navigateByUrl(this.redirectUrl);
            this._router.navigate([this.redirectUrl]);
        }

    }
}
