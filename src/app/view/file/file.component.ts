import { Component, OnInit, ViewChild, ElementRef, Inject, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lightbox } from 'angular2-lightbox';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';

import { User } from '../../core/models/user';
import { Message, MessageTypes } from '../../core/models/message';

import { IAuthService } from '../../core/services/auth/iauth.service';
import { UIService } from '../../core/services/ui/ui.service';
import { FileService } from '../../core/services/file/file.service';
import { WizardService } from '../../core/services/ui/wizard.service';
import { UtilityService } from '../../core/services/general/utility.service';

declare var hoverCard: any;

@Component({
    selector: 'file',
    moduleId: module.id,
    templateUrl: 'file.component.html',
    styleUrls: ['file.component.css', './file-upload/file.upload.component.css']
})
export class FileComponent implements OnInit, OnChanges {


    @Input() case: any = null;
    @Input() pIndex: any = null;
    @Input() attachments = new Array<any>();
    @Input() documentType: any = null;
    @Input() showUpload: boolean = false;
    @Input() showVerifyOption: boolean = false;
    @Output() uploadedDoc = new EventEmitter<boolean>();
    // @Output() attachmentIds = new EventEmitter<Array<number>>();

    // @Output() mediaLinks = new EventEmitter<Array<string>>();

    @ViewChild('myInput') myInputVariable: ElementRef;

    user: User = new User();
    currentURL: string;
    _albums = new Array<any>();
    _attachments = new Array<any>();

    fileToUpload: File = null;
    docHover: boolean = false;
    loading: boolean = false;
    // docAction: string = "";
    // doc: any;


    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        public utilityService: UtilityService,
        private _fileService: FileService,
        private _wizardService: WizardService,
        private _lightbox: Lightbox,
        private route: ActivatedRoute, private _router: Router,
        private _formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {

        this.user = this._authService.getUser();
        // this._wizardService.onStepChange.subscribe(
        //     (currentIndex) => {
        //         currentIndex = currentIndex - 1;
        //         if (currentIndex === this.componentIndex) {
        //             console.log('data send from upload media');
        //         }
        //     });


    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log("this.documentType in parent on change=-=-==-=-=", this.documentType)
        // console.log("this.case in parent on change=-=-==-=-=", this.case)
        // console.log("this.attachments in parent on change=-=-==-=-=", this.attachments)
        if (changes['case'] || changes['attachments']) {
            this._attachments = [];
            // this.case.documents.forEach(element => {
            this.attachments.forEach(element => {
                if (element.documentTypeId == this.documentType.id) {
                    this._attachments.push(element);
                }
            });
            // console.log('this._attachments', this._attachments);
            // setTimeout(() => {
            //     let c = 0;
            //     this.attachments.forEach(element => {
            //         if (element.documentTypeId == this.documentType.id) {
            //             this.mouseEnter1('demo-basic-', element.documentTypeId + '-' + c);
            //             c++;
            //         }
            //     });

            // }, 1000);

        }
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        console.log("this.fileToUpload", this.fileToUpload);
        this.saveFile(this.case, this.documentType, this.fileToUpload);

    }

    open(index: number): void {
        // open lightbox
        this._lightbox.open(this._albums, index);
    }


    saveFile(caseData, documentType, file) {
        const msg = new Message();
        this.loading = true;
        if (caseData && documentType && file) {
            this._fileService.saveFile(caseData.id, documentType.id, file).subscribe(
                (res) => {
                    this.loading = false;
                    this.myInputVariable.nativeElement.value = "";
                    this.fileToUpload = null;
                    // this.documentTypeList = res.json().data;
                    // console.log(this.departments);
                    msg.msg = res.json().message ? res.json().message : "File is Uploaded Successfully";
                    this.uploadedDoc.emit(res.json().data);
                    // this.docUploaded(res.json().data);
                    // this.caseForm.id = res.json() ? res.json().data : 0;
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, 'info');
                },
                (err) => {
                    this.loading = false;
                    console.log(err);
                    this.myInputVariable.nativeElement.value = "";
                    this.fileToUpload = null;

                    this._authService.errStatusCheckResponse(err);

                }
            );
        }
    }

    onNavigate(url) {
        console.log("test");
        window.open(url, "_blank");
    }

    docUploaded(data) {
        if (this.case.id && data) {
            // this._caseService.getCaseDocuments(this.case.id).subscribe(
            //     (res) => {
            //         this._uiService.hideSpinner();
            //         console.log("response case1", res.json());
            //         let arr = res.json().data;
            //         this.case.documents = [];
            //         arr.forEach(element => {
            //             this.case.documents.push(this._caseService.mapCaseDocument(element));
            //         });


            //     },
            //     (err) => {
            //         console.log("error", err);
            //         this._uiService.hideSpinner();
            //     }
            // )
        }
    }

    mouseEnter(data: any) {

        if (this.utilityService.checkRoleAllowed(this.user, ['cad']) || true) {
            // this.docAction = "";
            // this.doc = null;
            // console.log("mouse enter : " + div);
            console.log("1", data);
            // this.doc = data;
            if (data.genericStatus && data.genericStatus.statusType == "VERIFIED") {
                // this.docAction = "verify";
                console.log("1.1");
            }
            else if (data.genericStatus && data.genericStatus.statusType == "UNVERIFIED") {
                // this.docAction = "reject";
            }
            else {
                // this.docAction = "";
                console.log("1.2");
            }
            this.docHover = true;
        }

    }

    mouseLeave() {
        // console.log('mouse leave :' + div);
        console.log("2");
        this.docHover = false;
    }

    docVerification(doc) {
        console.log("doc", doc);
        const msg = new Message();
        // this._caseService.caseSubmitDocumentVerification(this.case, doc).subscribe(
        //     (res) => {
        //         msg.msg = res.json() ? res.json().message : 'You have successfully added an action';
        //         msg.msgType = MessageTypes.Information;
        //         msg.autoCloseAfter = 400;
        //         this._uiService.showToast(msg, 'info');
        //         this.uploadedDoc.emit(true);
        //         // this.dialogRef.close();
        //     },
        //     (err) => {
        //         console.log(err);
        //         this._authService.errStatusCheckResponse(err);
        //     });
    }

    mouseEnter1(id, index = null) {
        console.log("test hover = ", id + index);
        // hoverCard("test","");
        new hoverCard("test", "", id + index);
    }

    mouseOver(data, id = null, index = null) {

        console.log("test hover = ", id + index);
        // this.docAction = "";
        // this.doc = null;
        // console.log("mouse enter : " + div);
        console.log("1", data);
        // this.doc = data;
        if (data.genericStatus && data.genericStatus.statusType == "VERIFIED") {
            // this.docAction = "verify";
            console.log("1.1");
        }
        else if (data.genericStatus && data.genericStatus.statusType == "UNVERIFIED") {
            // this.docAction = "reject";
        }
        else {
            // this.docAction = "";
            console.log("1.2");
        }
        this.docHover = true;
        // hoverCard("test","");
        let html = `<div class="row">
            <div class="col-md-12">
                <form name="form" [formGroup]="docVerificationForm">
                    <div class="row">
                        <div class="col-md-6">
                            <mat-radio-group class="example-radio-group" [(ngModel)]="docAction" formControlName="action">

                                <mat-radio-button class="example-radio-button col-md-4" value="verify">
                                    Verify
                                </mat-radio-button>

                                <mat-radio-button class="example-radio-button col-md-4" value="reject">
                                    Reject
                                </mat-radio-button>
                            </mat-radio-group>
                        </div>
                        <div class="col-md-6">
                            <button mat-raised-button [disabled]="!docVerificationForm.valid" color="primary" (click)="docVerification()" tabindex="2">SUBMIT</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>`;
        new hoverCard(html, "", id + index);
    }

    // removeImage(index) {

    //     this._attachments.splice(index, 1);

    //     let obj = {
    //         docs: this._attachments,
    //         index: this.index,
    //         type: this.type
    //     };
    //     // this.attachmentIds.emit(this._attachments);
    //     this.attachmentIds.emit(obj);
    // }

    // removeImage(document) {
    removeImage(index) {
        console.log("index", index);
        console.log("this._attachments", this._attachments);
        const msg = new Message();
        // this.loading = true;
        if (this.case && (index || index == 0)) {
            this._attachments[index].isProcessing = true;
            console.log("this._attachments", this._attachments);
            // this._fileService.removeFile(this.case.id, this._attachments[index].id).subscribe(
            this._fileService.removeFile(this.case.id, this._attachments[index].documentUploadId).subscribe(
                (res) => {
                    this._attachments[index].isProcessing = false;
                    // this.loading = false;
                    msg.msg = res.json().message ? res.json().message : "File is Removed Successfully";
                    this.uploadedDoc.emit(res.json().data);
                    // this.docUploaded(res.json().data);
                    // this.caseForm.id = res.json() ? res.json().data : 0;
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, 'info');
                },
                (err) => {
                    console.log(err);
                    this._attachments[index].isProcessing = false;
                    // this.loading = false;

                    this._authService.errStatusCheckResponse(err);

                }
            );
        }
    }

    ngOnDestroy() {
        this._attachments = [];
    }
}
