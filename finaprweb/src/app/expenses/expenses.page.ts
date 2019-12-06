import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { ApartmentService } from '../services/apartment.service';
import { ExpenseService    } from '../services/expense.service';
import { MasterReferenceService  } from '../services/master-reference.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit {
  addExpenseFormGroup: FormGroup;
  fctl_exp_paid_by: FormControl;
  fctl_exp_amount: FormControl;
  fctl_exp_purpose: FormControl;
  fctl_exp_trans_detail: FormControl;
  fctl_exp_date: FormControl;
  fctl_exp_paid_to: FormControl;

  residentList: any;
  apartmentList;
  apartSubscrip:Subscription;
  addExpenseTranStatus:string='';

  purposeListSub;
  expPurposes;

  constructor(private _apartSer: ApartmentService,
              private _expSer:ExpenseService,
              private _masterRef:MasterReferenceService) { }

  
  ngOnInit() {
    this.addExpenseFormGroup = new FormGroup({
      fctl_exp_amount: new FormControl('',
        [Validators.required]
      ),
      fctl_exp_paid_by: new FormControl('',
        [Validators.required]
      ),
      fctl_exp_date: new FormControl('',
        [Validators.required]
      ),
      fctl_exp_purpose: new FormControl('',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(256)
        ]
      ),
      fctl_exp_paid_to: new FormControl('',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(256)
        ]
      ),
      fctl_exp_trans_detail: new FormControl('',
        [
          Validators.required,
          Validators.maxLength(512)
        ]
      )
    });

    this._apartSer.getAptResiList();
    this.residentList = this._apartSer.$apartment_resi.subscribe(res => {
      console.log('*********************');
      console.log(JSON.stringify(res));
      // console.log(JSON.parse(res));
      this.apartmentList = res;
    });

    this._masterRef.getApartmentExpPurposes();
    this.purposeListSub=this._masterRef.ExpPurposes$
                            .subscribe(res=>{
                                  console.log('------------------------');
                                  console.log(res[0]['ApartmentExpPurpose']);
                                  this.expPurposes=res[0]['ApartmentExpPurpose'];
                             })

  }


  get expensePaidBy() {
    return this.addExpenseFormGroup.get('fctl_exp_paid_by');
  }
  
  get expenseDate() {
    return this.addExpenseFormGroup.get('fctl_exp_date');
  }


  get expenseAmount() {
    return this.addExpenseFormGroup.get('fctl_exp_amount');
  }


  get expensePurpose() {
    return this.addExpenseFormGroup.get('fctl_exp_purpose');
  }


  get expensePaidTo() {
    return this.addExpenseFormGroup.get('fctl_exp_paid_to');
  }


  get expenseTransDetail() {
    return this.addExpenseFormGroup.get('fctl_exp_trans_detail');
  }


  addExpense(status) {
    console.log('------------register-----------------');
    console.log(status);
    let expenseDoc={'PaidByUserId':parseInt(this.expensePaidBy.value),
                    'Date':this.expenseDate.value,
                    'Amount':this.expenseAmount.value,
                    'Purpose':this.expensePurpose.value,
                    'PaidTo':this.expensePaidTo.value,
                    'TransactionDetail':this.expenseTransDetail.value
                  };
    console.log('----Expense Doc-----');
    console.log(expenseDoc);
    this._expSer.addExpense(expenseDoc);
    this.apartSubscrip=this._expSer.$expenseSerSub.subscribe(res=>{
      console.log('------------apartSubscrip------------');
      console.log(JSON.stringify(res));
      if (res['requestStatus']=='Success'){
        this.addExpenseTranStatus='Expense Added Successfully';
        this.clearExpFields();
        setTimeout(()=>{
          this.addExpenseTranStatus='';
        },2000);
      }
      else {
        this.addExpenseTranStatus='Error in Adding Expense';
      }
    });
    // this._apartSer.
  }

  clearExpFields(){
    setTimeout(()=>{
      this.addExpenseFormGroup.reset();
    },500);
  }
  
}
