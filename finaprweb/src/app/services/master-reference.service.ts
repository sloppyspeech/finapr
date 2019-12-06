import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Subject  }  from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class MasterReferenceService {
  private s_base_url='http://localhost:9000/api/v1/master-references';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  ExpPurposes$=new Subject<Object>();
  ExpPurposes_sub;

  PaymentPurposes$=new Subject<Object>();
  PaymentPurposes_sub;

  constructor(private _httpcli:HttpClient) { }

  getApartmentExpPurposes(){
    this.ExpPurposes_sub=this._httpcli
                             .get(`${this.s_base_url}/expense-purposes`,this.s_http_options)
                             .subscribe(res=>{
                                console.log('getApartmentExpPurpose');
                                console.log(res);
                                this.ExpPurposes$.next(res);
                             });

  }

  getPaymentPurposes(){
    this.PaymentPurposes_sub=this._httpcli
                             .get(`${this.s_base_url}/payment-purposes`,this.s_http_options)
                             .subscribe(res=>{
                                console.log('getPaymentPurposes');
                                console.log(res);
                                this.PaymentPurposes$.next(res);
                             });

  }

}
