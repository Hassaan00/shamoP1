import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';

import { IAuthService } from '../../core/services/auth/iauth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bail } from '../../core/models/bail';

declare var hoverCard: any;

@Component({
    templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
    public pageTitle: string = 'Welcome';

    isLogin: any;

    list = [1, 2, 3, 4];

    bailList = new Array<Bail>();
    displayedColumns = ['sNo', 'caseNo', 'option', 'bailValue', 'status'];
    dataSource = new MatTableDataSource<Bail>(this.bailList);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    isSpinner = false;
    filter: string = "";
    pageEvent: PageEvent;
    pageIndex: number = 0;
    pageSize: number = 10; // by default
    length: number = 0;
    pageSizeOptions = [5, 10, 25, 50, 100];
    // pageSizeOptions = [10];
    upperLimit = 0;

    constructor(
        @Inject('IAuthService')
        private _authService: IAuthService,
        private _router: Router,
    ) {
    }

    ngOnInit(): void {
        this.mouseEnter('demo-hcOverHc', '')
        this.isLogin = this._authService.isLoggedIn();
        // console.log('this.isLogin', this.isLogin);

        // if (!this.isLogin) {
        //     this._router.navigateByUrl('login');
        // }


        // this._caseService.getAccountViaCIF("111").subscribe(
        //     (res) => {

        //         // msg.msg = (res.json() ? res.json() : 'Successfully Updated Password');
        //         // msg.msgType = MessageTypes.Information;
        //         // msg.autoCloseAfter = 400;
        //         // this._uiService.showToast(msg, 'info');
        //     },
        //     (err) => {

        //         // this.isSubmitted = false;
        //         console.log("err ", err);
        //         // this._authService.errStatusCheck(err);
        //     }
        // );

        let c = 0;
        this.list.forEach(element => {

            setTimeout(() => {
                this.mouseEnter('demo-basic-', '21' + '-' + c)
            }, 500);

            c++;


        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    mouseEnter(id, index = null) {
        console.log("test hover");
        // hoverCard("test","");
        new hoverCard("test", "", id + index);
    }


    fileSelectMsg: string = 'No file selected yet.';
    fileUploadMsg: string = 'No file uploaded yet.';
    disabled: boolean = false;

    selectEvent(file: File): void {
        this.fileSelectMsg = file.name;
    }

    uploadEvent(file: File): void {
        this.fileUploadMsg = file.name;
    }

    cancelEvent(): void {
        this.fileSelectMsg = 'No file selected yet.';
        this.fileUploadMsg = 'No file uploaded yet.';
    }

    toggleDisabled(): void {
        this.disabled = !this.disabled;
    }

}
