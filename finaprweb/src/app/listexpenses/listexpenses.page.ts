import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { formatDate, DatePipe  } from '@angular/common';
import { LoadingController  } from '@ionic/angular';

import { ExpenseService } from '../services/expense.service';
import { validateExpSrchDate } from '../validators/access.validators';
import { ExpexcelService  } from '../services/expexcel.service';
import { load } from 'ssf/types';

@Component({
  selector: 'app-listexpenses',
  templateUrl: './listexpenses.page.html',
  styleUrls: ['./listexpenses.page.scss'],
  providers:[DatePipe]
})


export class ListexpensesPage implements OnInit {
  allExpenses:any;
  expExpExclData:any;
  loadingSpinner:any; 
  ExpSearchFormGroup: FormGroup;
  fctl_start_date: FormControl;
  fctl_end_date: FormControl;
  showTextSrchBox: boolean = false;
  srchItemPlaceHolder: string='Purpose';
  $allexpsub: Subscription;
  $srchItemSub: Subscription;
  $filterSrchResult:Subscription;
  $expExclSerSub:Subscription;

  constructor(private _expSer: ExpenseService, 
              private _router: Router, 
              private _formbuilder: FormBuilder,
              private _date:DatePipe,
              private _exportExcel:ExpexcelService,
              private _loadingCtl:LoadingController) { }

  ngOnInit() {
    this.checkLoggedIn();

    this.ExpSearchFormGroup = this._formbuilder.group({
      fctl_start_date: new FormControl('', [Validators.required]),
      fctl_end_date: new FormControl('', [Validators.required]),
      fctl_text_srch_val: new FormControl('', [Validators.required, , Validators.minLength(3), Validators.maxLength(128)])
    }, { validator: validateExpSrchDate }
    );
    var dateVal=this._date.transform(new Date(),"yyyy-MM-dd");
    var bef6MonDateVal=this._date.transform(new Date(new Date().setMonth(new Date().getMonth() -6)),"yyyy-MM-dd");
    
    console.log('------ListExpenses----');
    console.log(dateVal);
    this.ExpSearchFormGroup.get('fctl_start_date').setValue(bef6MonDateVal);
    this.ExpSearchFormGroup.get('fctl_end_date').setValue(dateVal);
    this.ExpSearchFormGroup.get('fctl_text_srch_val').setValue('');
  }


  ionViewWillEnter() {
    this.searchExpense();
    this.checkLoggedIn();
  }


  goToAddExpense() {
    this._router.navigate(['/', 'add-expense']);
  }


  SrchOptionSel(event) {
    console.log('-----In SrchOptionSel-------');
    console.log(event);

    switch (event.detail.value) {

      case 'Purpose':
        this.showTextSrchBox = true;
        this.srchItemPlaceHolder = 'Purpose';
        break;
      case 'Paid To':
        this.showTextSrchBox = true;
        this.srchItemPlaceHolder = 'Paid To';
        break;
      case 'Transaction Details':
        this.showTextSrchBox = true;
        this.srchItemPlaceHolder = 'Transaction Detail';
        break;

    }
  }


  searchExpense() {
    this.loadingSpinner=this._loadingCtl.create({
                     message:'Please Wait'
                }).then((res)=>{
                  res.present();
                });              

    console.log('----------Listexpenses searchExpense()---------');
    console.log(this.srchItemPlaceHolder);
    console.log(this.ExpSearchFormGroup.get('fctl_start_date').value);
    console.log(this.ExpSearchFormGroup.get('fctl_end_date').value);
    console.log(this.ExpSearchFormGroup.get('fctl_text_srch_val').value);

    var srchFilter = { 'srchField': this.srchItemPlaceHolder.replace(/ /g,''), 
                       'srchValue': this.ExpSearchFormGroup.get('fctl_text_srch_val').value, 
                       'startDate': this.ExpSearchFormGroup.get('fctl_start_date').value, 
                       'endDate'  : this.ExpSearchFormGroup.get('fctl_end_date').value
                     };

    console.log(srchFilter);
    this._expSer.getExpenseByFilter(srchFilter);
    this.$filterSrchResult=this._expSer.$allExpByFilter.subscribe(data=>{
      this.allExpenses=data;
      //
        setTimeout(()=>{
          this._loadingCtl.dismiss();
        },1000);
      //
    });
  }

  clearSrchText(){
    this.ExpSearchFormGroup.get('fctl_text_srch_val').setValue('');
  }


  getAllExpenses() {
    this._expSer.getAllExpenses();
    this.$allexpsub = this._expSer.$allExpenseSerSub.subscribe(data => {
      console.log('--------------in Listexpensepage.ts getallExpense-----');
      console.log(data);
      this.allExpenses = data;
    });
  }


  checkLoggedIn() {
    if (localStorage.getItem('CurrUserMobNo') !== null &&
      localStorage.getItem('CurrUserMobNo').length > 0
    ) {
      console.log('---------ListExpensesPage----------');
      console.log(localStorage.getItem('CurrUserMobNo'));
      this.getAllExpenses();
    }
    else {
      this._router.navigate(['/', 'login']);
    }
  }

  exportToExcel(){
    this._expSer.getAllExpenses();
    this.$expExclSerSub = this._expSer.$allExpenseSerSub.subscribe(data => {
      console.log('--------------in Listexpensepage.ts exportToExcel-----');
      console.log(data);
      this.expExpExclData = data;
      var expenseData=[]
      var tmpData;
      for (var i=0;i<data.length;i++){
      tmpData=data[i]['Apartment'][0];
      tmpData['Amount']=data[i]['ApartmentExpenses']['Amount'];
      tmpData['Date']=data[i]['ApartmentExpenses']['Date'];
      tmpData['PaidByUserId']=data[i]['ApartmentExpenses']['PaidByUserId'];
      tmpData['PaidTo']=data[i]['ApartmentExpenses']['PaidTo'];
      tmpData['Purpose']=data[i]['ApartmentExpenses']['Purpose'];
      tmpData['TransactionDetail']=data[i]['ApartmentExpenses']['TransactionDetail'];
      expenseData.push(tmpData);
      }
      this._exportExcel.exportToExcel(expenseData,'ExpenseData');
    });

  }


}
