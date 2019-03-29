import { Component, OnInit, Inject, ViewChild, } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';



@Component({
    selector: 'message-dialog',
    templateUrl: './message.dialog.html',
    // styleUrls: ['../../campaign.component.css']
})

export class MessageDialogComponent {
    fieldType: string = "showOnlyMessage";
    message: string = "Nothing to show!";


    name: string;
    constructor(
        public dialogRef: MatDialogRef<MessageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.fieldType = data.value || "showOnlyMessage";
        this.message = data.msg || "Nothing to show!";
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(field) {

        this.dialogRef.close(false);
    }
}