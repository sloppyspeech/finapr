import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators,FormsModule,ReactiveFormsModule  }  from '@angular/forms';
import { validateStartEndDate } from '../validators/access.validators';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.page.html',
  styleUrls: ['./admin-reports.page.scss'],
  providers:[DatePipe]
})
export class AdminReportsPage implements OnInit {
  adminReportsFG:FormGroup;
  dateVal;
  bef6MonDateVal;

  constructor(private _formbuilder: FormBuilder,
              private _datePipe:DatePipe) { }

  ngOnInit() {
    this.adminReportsFG = this._formbuilder.group({
      fctl_start_date: new FormControl('', [Validators.required]),
      fctl_end_date: new FormControl('', [Validators.required])}
      , { validator: validateStartEndDate }
    );

    console.log(new Date());
    this.dateVal=this._datePipe.transform(new Date(),"yyyy-MM-dd");
    console.log(`${this.dateVal}`);
    this.bef6MonDateVal=this._datePipe.transform(new Date(new Date().setMonth(new Date().getMonth() -12)),"yyyy-MM-dd");
    console.log('------Admin reports----');
    console.log(`${this.bef6MonDateVal} <=> ${this.dateVal}`);
    this.adminReportsFG.get('fctl_start_date').setValue(this.bef6MonDateVal);
    this.adminReportsFG.get('fctl_end_date').setValue(this.dateVal);
    // this.defDateFilter={'startDate':this.bef6MonDateVal,'endDate':this.dateVal};

  }

  showm(input:string){
    console.log('--------------------');
    console.log(input);
  }
}
