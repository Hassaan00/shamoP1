import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { LogService } from "./services/log/log.service";
import { AuthService } from "./services/auth/auth.service";
import { HttpService } from "./services/base/http.service";
import { RoutingInfoService } from "./services/routInfo/route.info.service";
import { UIService } from "./services/ui/ui.service";
import { WizardService } from './services/ui/wizard.service';
import { GeoLocationService } from "./services/location/geo-location.service";
import { LocationService } from "./services/location/location.service";

import { AdminSetupService } from "./services/admin/admin.setup.service";
import { AdminService } from "./services/admin/admin.service";
import { FileService } from "./services/file/file.service";
import { PaymentService } from "./services/payment/payment.service";
import { FormService } from "./services/form/form.service";

import { UtilityService } from "./services/general/utility.service";

import { UserService } from './services/user/user.service'
import { LoginGuard } from './services/guard/login.guard';
import { BailService } from './services/bail/bail.service';
import { FirService } from './services/fir/fir.service';
import { ContractService } from './services/contract/contract.service';
import { BacgroundService } from './services/background/background.service';

@NgModule({
    imports: [HttpModule],
    providers: [{ provide: 'ILogService', useClass: LogService },
    { provide: 'IAuthService', useClass: AuthService },
        UIService, WizardService, HttpService,
        RoutingInfoService, GeoLocationService,
        LocationService, AdminSetupService, AdminService,
        FileService,
        PaymentService,
        UtilityService, UserService,
        BailService, ContractService,
        BacgroundService,
        FirService, FormService,
        LoginGuard],
    declarations: [],
    exports: []
})
export class CoreModule { }