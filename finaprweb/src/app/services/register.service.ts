import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Subject  } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private s_base_url='http://localhost:9000/api/v1';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private s_reg_user_sub:any;
  $register=new Subject<any>();

  constructor(private _httpcli:HttpClient) { }

  registerUser(p_register_params:any){
    console.log('In RegisterUser Service');
    console.log(p_register_params);
    this.s_reg_user_sub=this._httpcli.post(`${this.s_base_url}/access/register`,JSON.stringify(p_register_params),this.s_http_options)
                 .subscribe(res=>{
                   console.log('Register User Response');
                   console.log(res);
                   this.$register.next(res);
                 })
  }


  ngOnDestroy(): void {
    this.s_reg_user_sub.unsubscribe();
  }
}
