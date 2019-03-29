import { Component, EventEmitter, Inject, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions, RequestOptionsArgs, Headers, Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpEventType, HttpEvent } from '@angular/common/http';

import { MessageTypes, Message } from '../../../../core/models/message';
import { Token } from '../../../../core/models/token';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UserService } from '../../../../core/services/user/user.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { FileService } from '../../../../core/services/file/file.service';

@Component({
    selector: 'upload',
    templateUrl: 'upload.image.component.html',
})
export class UploadImageComponent implements OnChanges {
    @Input() profilePic;
    @Input() userId;

    fileToUpload: File = null;
    previewData: any;
    header: { 'Content-Type', 'application/x-www-form-urlencoded' };
    // options: FancyImageUploaderOptions = {
    //     thumbnailHeight: 150,
    //     thumbnailWidth: 150,
    //     // uploadUrl: 'http://localhost:8080/api/user/change/picture',
    //     uploadUrl: 'http://18.220.65.157:8080/api/user/change/picture',
    //     allowedImageTypes: ['image/png', 'image/jpeg'],
    //     maxImageSize: 10,
    //     httpMethod: 'POST',
    //     customHeaders: this.header,
    //     authTokenPrefix: 'Bearer ',
    //     authToken: this._authService.getToken(),
    // };

    image = 'https://s3.us-east-2.amazonaws.com/socol-bucket/profile/1516700053820-atomix_user31.png';


    selectedFile: File = null;


    constructor(@Inject('IAuthService') private _authService: IAuthService, private httpClient: Http,
        private uiService: UIService, private _userService: UserService,
        private _fileService: FileService) {

    }

    onFileSelected(event) {
        console.log(event);
        this.selectedFile = <File>event.target.files[0];
        this.onUpload();
    }

    onUpload() {

        this._fileService.uploadProfilePic(this.selectedFile, this.userId).subscribe(
            (res) => {
                console.log('Image upload response', res);
                this.profilePic = res.json().data.documentUrl;
                const msg = new Message();
                msg.msg = 'Your picture has saved successfully.';
                msg.msgType = MessageTypes.Information;
                this.uiService.showToast(msg, 'info');
                msg.autoCloseAfter = 400;
                const user = this._authService.getUser();
                user.profilePicture = res.json().data;
                this._authService.storeUser(user);
                window.location.reload();
            },
            (err) => {
                console.log('err', err);
                this._authService.errStatusCheckResponse(err);
            }
        );

    }

    ngOnChanges() {

    }
    // onUpload(file: UploadedFile) {
    //     let res = JSON.parse(file.response);
    //     let msg = new Message();
    //     msg.msg = res.message;
    //     if (res.status == 200) {
    //         msg.msgType = MessageTypes.Information;
    //         this._userService.getUser().subscribe(
    //             (res) => {
    //                 const loggedInUser = this._authService.getLoggedInUser();
    //                 loggedInUser.profilePic = res.profilePic;
    //                 this._authService.storeLoggedInUser(loggedInUser);
    //             },
    //             (err) => {
    //                 console.log('err', err);
    //             }
    //         );
    //         this.uiService.showToast(msg, "info");
    //     } else {
    //         msg.msgType = MessageTypes.Error;
    //         this.uiService.showToast(msg, "");
    //     }
    //     msg.autoCloseAfter = 400;
    // }


    onClickImage() { }


}
