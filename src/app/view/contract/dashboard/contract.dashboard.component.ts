import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../core/models/user';
import { Message, MessageTypes } from '../../../core/models/message';
import { ContractType } from '../../../core/models/contract.model';

import { IAuthService } from '../../../core/services/auth/iauth.service';
import { UIService } from '../../../core/services/ui/ui.service';
import { ContractService } from '../../../core/services/contract/contract.service';

import { DatePipe } from '@angular/common';

@Component({
    selector: 'contract-dashboard',
    templateUrl: 'contract.dashboard.component.html',
    styleUrls: ['./contract.dashboard.component.css'],
    providers: [DatePipe]
})
export class ContractDashboardComponent implements OnInit {
    isUser: User = new User();
    user: User = new User();
    isLogin: any;

    // contract Stats
    barAdvsStatsChartData: any[] = [
        { data: [0], label: 'One Time' },
        { data: [0], label: 'Recurring' },
        { data: [0], label: 'Total' },
    ];
    public currentDate = new Date();
    minDateLitFiled: string;
    minDate: string;
    maxDateLitFiled: string;
    maxDate: string;
    public barAdvStatsChartLabels: string[] = [];
    isContractStatChart = true;



    // contract Stats
    barAdvsStatsTypeChartData: any[] = [
        { data: [10], label: 'Total' },
    ];
    public barAdvStatsTypeChartLabels: string[] = [];
    isContractStatTypeChart = true;

    //Disposal Bar Chart
    public barChartOptions: any = {
        scaleShowVerticalLines: true,

        showAllTooltips: true,
        responsive: true
    };
    public colors = [
        {
            backgroundColor: [
                '#40a348',
                '#40a348',
                '#40a348'
            ]
        },
        {
            backgroundColor: [
                '#c3d82e',
                '#c3d82e',
                '#c3d82e'
            ]
        },
        {
            backgroundColor: [
                '#3333ff',
                '#3333ff',
                '#3333ff'
            ]
        },
        {
            backgroundColor: [
                '#cccc00',
                '#cccc00',
                '#cccc00'
            ]
        },
        {
            backgroundColor: [
                '#ffdb4d',
                '#ffdb4d',
                '#ffdb4d'
            ]
        }

    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    currentYear = this.currentDate.getFullYear();
    types: ContractType[] = [];
    selectType = 'recurring';

    constructor(@Inject('IAuthService') private _authServices: IAuthService,
        private _uiService: UIService,
        private _contractService: ContractService, private datePipe: DatePipe,
        private route: ActivatedRoute, private _router: Router) {

        // For Pre-selection of Litigation Filed Date
        const temp = new Date(Date.UTC(this.currentYear, this.currentDate.getMonth() - 3));
        this.minDateLitFiled = temp.toISOString(); this.minDate = this.datePipe.transform(temp, 'MM-dd-yyyy');
        this.maxDateLitFiled = this.currentDate.toISOString();
        this.maxDate = this.datePipe.transform(this.currentDate, 'MM-dd-yyyy');

    }

    ngOnInit(): void {

        this.user = this._authServices.getUser();
        this.isLogin = this._authServices.isLoggedIn();
        if (!this.isLogin) {
            this._router.navigateByUrl('login');
        } else {
        }

        this.onContractStatsSelect();
        this.onContractStatsByType('recurring');
        this.loadTypes();
    }


    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    onConStatMinDateChanged(date) {
        this.minDate = this.datePipe.transform(date, 'MM-dd-yyyy');
        this.onContractStatsSelect();
    }

    onConStatMaxDateChanged(date) {
        this.maxDate = this.datePipe.transform(date, 'MM-dd-yyyy');
        this.onContractStatsSelect();
    }

    onContractStatsSelect() {
        this._contractService.getContractStatsGraph(this.minDate, this.maxDate).subscribe(
            (res) => {
                const data = res.json().data;
                console.log('data', data);
                if (data && data.length < 1) {
                    this.isContractStatChart = false;
                    return;
                }
                this.isContractStatChart = true;

                let clone = JSON.parse(JSON.stringify(this.barAdvsStatsChartData));
                let oneTime = [];
                let recurring = [];
                let total = [];

                total.push(data.total);
                oneTime.push(data.oneTime);
                recurring.push(data.recurring);


                clone[0].data = oneTime;
                clone[1].data = recurring;
                clone[2].data = total;

                this.barAdvsStatsChartData = clone;
            },
            (err) => {
                console.log(err);
                this.isContractStatChart = false;
            }
        );
    }

    loadTypes() {
        this._contractService.getContractTypes().subscribe(
            (res) => {
                this.types = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }
    onContractStatsByType(type) {
        this._contractService.getContractRequestViaTypeGraph(type).subscribe(
            (res) => {
                const data = res.json().data;
                console.log('getAdviceRequestViaTypeGraph', data);
                if (data && data.length < 1) {
                    this.isContractStatTypeChart = false;
                    return;
                }
                this.isContractStatTypeChart = true;

                let clone = JSON.parse(JSON.stringify(this.barAdvsStatsTypeChartData));
                let total = [];
                total.push(data.total);
                clone[0].data = total;
                this.barAdvsStatsTypeChartData = clone;
                console.log('this.barAdvsStatsChartData ', this.barAdvsStatsTypeChartData);
            },
            (err) => {
                console.log(err);
                this.isContractStatTypeChart = false;
            }
        );
    }

}
