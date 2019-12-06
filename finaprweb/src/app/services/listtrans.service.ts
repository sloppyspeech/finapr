import { Injectable } from '@angular/core';
import { Subject  } from 'rxjs/Subject';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ListtransService {
  $listtrans=new Subject<any>();
  private base_url:string='http://localhost:9000/api/v1/payments';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private listtrans;

  constructor(private _httpcli:HttpClient) { }

  getAllTransByUserId(p_userid){
    console.log(`listtrans Service ${p_userid}`);
    this.listtrans=this._httpcli.get(`${this.base_url}/payments-by-mobno?UserId=${p_userid}`)
                    .subscribe(res=>{
                      console.log('ListTransService Response');
                      console.log(res['response']);
                      this.$listtrans.next(JSON.parse(res['response']));
                    });
  }

  ngOnDestroy(): void {
    this.listtrans.unsubscribe();
  }


}
