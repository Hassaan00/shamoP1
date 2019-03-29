import { Component, OnInit, ViewChild, ElementRef, Inject, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lightbox } from 'angular2-lightbox';

import { Message, MessageTypes } from '../../../../core/models/message';

import { IAuthService } from '../../../../core/services/auth/iauth.service';
import { UIService } from '../../../../core/services/ui/ui.service';
import { FileService } from '../../../../core/services/file/file.service';


@Component({
    selector: 'contract-upload',
    moduleId: module.id,
    templateUrl: 'contract.upload.component.html',
    styleUrls: ['contract.component.css', '../../../file/file-upload/file.upload.component.css']
})
export class ContractFileComponent implements OnInit, OnChanges {


    @Input() showUpload: boolean = false;
    @Input() index: any = null;
    @Input() attachments = new Array<any>();
    @Output() attachmentIds = new EventEmitter<any>();
    // @Output() attachmentIds = new EventEmitter<Array<number>>();


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
        private _lightbox: Lightbox,
        private route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes['attachments']) {
            this._attachments = [];
            if (this.attachments) {
                this.attachments.forEach(element => {
                    this._attachments.push(element);
                });
            }
        }
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        console.log("this.fileToUpload", this.fileToUpload);
        this.saveReference(this.fileToUpload);

    }

    open(index: number): void {
        // open lightbox
        this._lightbox.open(this._albums, index);
    }


    saveReference(file) {

        const msg = new Message();
        this.loading = true;
        if (file) {
            this._fileService.saveContractDocs(file).subscribe(
                (res) => {
                    this.loading = false;
                    this.myInputVariable.nativeElement.value = "";
                    this.fileToUpload = null;
                    msg.msg = res.json().message ? res.json().message : "Contract Document is Uploaded Successfully";
                    this._attachments.push(this._fileService.mapDocument(res.json().data));
                    let obj = {
                        docs: this._attachments,
                        index: this.index,
                        // type: this.type
                    };
                    // this.attachmentIds.emit(this._attachments);
                    this.attachmentIds.emit(obj);
                    // this.uploadedDoc.emit(res.json().data);
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
            this.loading = false;
        }
    }

    removeImage(index) {

        this._attachments.splice(index, 1);

        let obj = {
            docs: this._attachments,
            index: this.index,
            // type: this.type
        };
        this.attachmentIds.emit(obj);
        // this.attachmentIds.emit(this._attachments);
    }

    onNavigate(url) {
        console.log("test");
        window.open(url, "_blank");
    }

    ngOnDestroy() {
        this._attachments = [];
    }

}
