import { CanActivate, Router } from '@angular/router';
import { Injectable, OnDestroy, Inject } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { IAuthService } from '../auth/iauth.service';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private router: Router,
        @Inject('IAuthService') private authService: IAuthService) {}

    canActivate(): boolean {
        
        if (this.authService.checkToken()) {
            return true;
        }
        //Redirect the user before denying them access to this route
        this.router.navigate(['/login']);
        return false;
    }
}