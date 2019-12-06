import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Subject }  from 'rxjs/Subject';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private base_url:string='http://localhost:9000/api/v1/payments/pay';
  // private $make_payment;
  $payment_action= new Subject<any>();
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private _httpcli:HttpClient) { }

  makePayment(p_payment){
    return this._httpcli.post(
                        this.base_url,
                        p_payment,
                        this.s_http_options)
                        .subscribe(data=>{
                          console.log('In Post Make Payment');
                          console.log(data);
                          this.$payment_action.next(data);
                        });
  }

  ngOnDestroy(): void {
    // this.$make_payment.unsubscribe();
    
  }
}
