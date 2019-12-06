import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Subject  } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private s_base_url='http://localhost:9000/api/v1/expenses';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private s_exp_sub:any;
  private allExpenseSerSub:any;
  private allExpByYearMon:any;
  private allExpByPurpose:any;
  private allExpByFilter:any;
  private totExpenseIncomeForApartmentByYear:any;

  $expenseSerSub=new Subject<any>();
  $allExpenseSerSub=new Subject<any>();
  $allExpByYearMon=new Subject<any>();
  $allExpByPurpose=new Subject<any>();
  $allExpByFilter=new Subject<any>();
  $TotExpenseIncomeForApartmentByYear=new Subject<any>();

  constructor(private _httpcli:HttpClient) { }

  addExpense(expenseDoc:any){
    console.log('--------addExpense--------');
    this.s_exp_sub=this._httpcli.post(`${this.s_base_url}/add-expense`,expenseDoc,this.s_http_options)
                   .subscribe(res=>{
                    console.log(JSON.stringify(res));
                    this.$expenseSerSub.next(res);
                   });

  }

  getExpenseByFilter(expFilter:any){
    console.log('expense Service getExpenseByFilter');
    console.log(expFilter);
    var queryString='';
    for (var key in expFilter) {
      console.log(`There are ${key} : ${expFilter[key]}`)
      if (queryString ==='') {
        queryString=`?${key}=${expFilter[key]}`;
      }
      else{
        queryString=`${queryString}&${key}=${expFilter[key]}`;
      }
      console.log(queryString);
    }
    this.allExpByFilter=this._httpcli.get(`${this.s_base_url}/exp-by-filter${queryString}`)
                        .subscribe(res=>{
                            console.log('---getExpenseByFilter  RES---');
                            console.log(JSON.stringify(res));
                            this.$allExpByFilter.next(res);
                        });
  }

  getAllExpenses(){
    console.log('--------getAllExpenses--------');
    this.allExpenseSerSub=this._httpcli.get(`${this.s_base_url}/all-expenses`)
                   .subscribe(res=>{
                      // console.log(JSON.stringify(res));
                      this.$allExpenseSerSub.next(res);
                   });
  }

  getSumAllExpByYearMon(filter){
    console.log('--------getAllExpByYearMon--------');
    var url=`${this.s_base_url}/sum-exp-by-year-mon?startDate=${filter['startDate']}&endDate=${filter['endDate']}`;
    console.log(`URL is ${url}`);
    this.allExpByYearMon=this._httpcli.get(url)
                   .subscribe(res=>{
                      // console.log(JSON.stringify(res));
                      this.$allExpByYearMon.next(res);
                   });
  }

  
  getSumAllExpByPurpose(filter){
    console.log('--------getSumAllExpByPurpose--------');
    var url=`${this.s_base_url}/sum-exp-by-purpose?startDate=${filter['startDate']}&endDate=${filter['endDate']}`;
    console.log(`URL is ${url}`);
    this.allExpByPurpose=this._httpcli.get(url)
                   .subscribe(res=>{
                      // console.log(JSON.stringify(res));
                      this.$allExpByPurpose.next(res);
                   });
  }


  getExpIncomeDataForApartment(filter){
    console.log(`-----getExpIncomeDataForApartment-----${JSON.stringify(filter)}---`);
    var url1=`${this.s_base_url}/tot-exp-inc-by-year?startDate=${filter['startDate']}&endDate=${filter['endDate']}`;
    console.log(url1);
    this.totExpenseIncomeForApartmentByYear=this._httpcli.get(url1)
                           .subscribe(res=>{
                              this.$TotExpenseIncomeForApartmentByYear.next(res);
                           });

  }


}
