import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Subject  } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class ResetpassService {
  private s_base_url='http://localhost:9000/api/v1/access/reset-password';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private s_reset_user_pass:any;
  $reset_pass=new Subject<any>();

  constructor(private _httpcli:HttpClient) { }

  resetPassword(p_reset_pass_params:any){
    console.log('In resetPassword Service');
    console.log(p_reset_pass_params);
    this.s_reset_user_pass=this._httpcli.post(`${this.s_base_url}`,JSON.stringify(p_reset_pass_params),this.s_http_options)
                 .subscribe(res=>{
                   console.log('Reset Password User Response');
                   console.log(res);
                   this.$reset_pass.next(res);
                 })
  }


  ngOnDestroy(): void {
    this.s_reset_user_pass.unsubscribe();
  }
}
