import { Component, OnInit, ViewChild, ElementRef, Inject, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lightbox } from 'angular2-lightbox';

import { User } from '../../../core/models/user';
import { Message, MessageTypes } from '../../../core/models/message';

import { IAuthService } from '../../../core/services/auth/iauth.service';
import { UIService } from '../../../core/services/ui/ui.service';
import { FileService } from '../../../core/services/file/file.service';
import { WizardService } from '../../../core/services/ui/wizard.service';


@Component({
    selector: 'file',
    moduleId: module.id,
    templateUrl: 'file.component.html',
    styleUrls: ['file.component.css', '../../file/file-upload/file.upload.component.css']
})
export class FileComponent implements OnInit, OnChanges {


    @Input() showUpload: boolean = false;
    @Input() caseId: any = null;
    @Input() attachments = new Array<any>();
    @Output() attachmentIds = new EventEmitter<Array<number>>();

    // @Output() mediaLinks = new EventEmitter<Array<string>>();

    @ViewChild('myInput') myInputVariable: ElementRef;

    currentURL: string;
    _albums = new Array<any>();
    _attachments = new Array<any>();

    fileToUpload: File = null;
    loading: boolean = false;

    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _uiService: UIService,
        private _fileService: FileService,
        private _wizardService: WizardService,
        private _lightbox: Lightbox,
        private route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit(): void {

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
        if (changes['caseId']) {
            // this._attachments = [];
            // // this.case.documents.forEach(element => {
            // this.attachments.forEach(element => {
            //     if (element.documentTypeId == this.documentType.id) {
            //         this._attachments.push(element);
            //     }
            // });
        }
        if (changes['attachments']) {
            this._attachments = [];
            this.attachments.forEach(element => {
                this._attachments.push(element);
            });
        }
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        console.log("this.fileToUpload", this.fileToUpload);
        // this.saveResume(this.lawFirm, this.documentType, this.fileToUpload);
        this.saveDoc(this.caseId, this.fileToUpload);

    }

    open(index: number): void {
        // open lightbox
        this._lightbox.open(this._albums, index);
    }


    saveDoc(caseId, file) {
        console.log("test 1")
        const msg = new Message();
        this.loading = true;
        // if (lawFirmData && documentType && file) {
        if (caseId && file) {
            console.log("test 2")
            // this._fileService.saveResume(lawFirmData.id, documentType.id, file).subscribe(
            this._fileService.savePaymentDoc(caseId, file).subscribe(
                (res) => {
                    this.loading = false;
                    this.myInputVariable.nativeElement.value = "";
                    this.fileToUpload = null;
                    // this.documentTypeList = res.json().data;
                    // console.log(this.departments);
                    msg.msg = res.json().message ? res.json().message : "Document is Uploaded Successfully";
                    this._attachments.push(this._fileService.mapDocument(res.json().data));
                    this.attachmentIds.emit(this._attachments);
                    // this.docUploaded(res.json().data);
                    // this.caseForm.id = res.json() ? res.json().data : 0;
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, 'info');
                },
                (err) => {
                    console.log(err);
                    this.loading = false;
                    this.myInputVariable.nativeElement.value = "";
                    this.fileToUpload = null;

                    this._authService.errStatusCheckResponse(err);

                }
            );
        }
        else {

            // const msg = new Message();
            this.myInputVariable.nativeElement.value = "";
            this.fileToUpload = null;

            msg.title = '';
            msg.iconType = '';
            this.loading = false;
            if (!caseId) {
                msg.msg = 'Case Is required for upload';
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, '');
            }
        }
    }

    removeImage(index) {

        this._attachments.splice(index, 1);

        // let obj = {
        //     docs: this._attachments,
        //     index: this.index,
        //     type: this.type
        // };
        // this.attachmentIds.emit(obj);
        this.attachmentIds.emit(this._attachments);
    }

    onNavigate(url) {
        console.log("test");
        window.open(url, "_blank");
    }

    // docUploaded(data) {
    //     if (this.case.id && data) {
    //         this._caseService.getCaseDocuments(this.case.id).subscribe(
    //             (res) => {
    //                 this._uiService.hideSpinner();
    //                 console.log("response case1", res.json());
    //                 let arr = res.json().data;
    //                 this.case.documents = [];
    //                 arr.forEach(element => {
    //                     this.case.documents.push(this._caseService.mapCaseDocument(element));
    //                 });


    //             },
    //             (err) => {
    //                 console.log("error", err);
    //                 this._uiService.hideSpinner();
    //             }
    //         )
    //     }
    // }

    ngOnDestroy() {
        this._attachments = [];
    }

}
