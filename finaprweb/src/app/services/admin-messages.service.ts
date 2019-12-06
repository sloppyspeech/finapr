import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class AdminMessagesService {
  private s_base_url = 'http://localhost:9000/api/v1/messages';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  insMessageSub;
  $insMessage = new Subject<any>();

  broadCastSub;
  $broadcastMessage = new Subject<any>();

  constructor(private _httpcli: HttpClient) { }

  insertMessage(message:any){
    console.log('In insertMessage');
    console.log(message);
    if (message['BroadCastToAll']){
      this.broadCastSub = this._httpcli.post(`${this.s_base_url}/broadcast`, message, this.s_http_options)
      .subscribe(res => {
        console.log('**************BroadCast Message Response.***********');
        console.log(res);
        console.log(res['response']);
        this.$broadcastMessage.next(res);
      });
    }
    else {

      console.log('Sending broadcast to all residents');
      this.insMessageSub = this._httpcli.post(`${this.s_base_url}/message`, message, this.s_http_options)
      .subscribe(res => {
        console.log('**************Insert Message Response.***********');
        console.log(res);
        console.log(res['response']);
        this.$insMessage.next(res);
      });
    
    }
  }


}
