import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class MyMessagesService {
  private s_base_url = 'http://localhost:9000/api/v1/messages';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  myMessageSub;
  $myMessage = new Subject<any>();
  messageStatusSub;
  $messageStatus = new Subject<any>();

  constructor(private _httpcli: HttpClient) { }

  showMessages(UserId:number){
    this.myMessageSub=this._httpcli.get(`${this.s_base_url}/all?UserId=${UserId}`)
                      .subscribe(res=>{
                          console.log('------MyMessagesService.showMessages-----');
                          console.log(res);
                          this.$myMessage.next(res)
                      });
  }

  setMessageStatusToRead(UserId:number){
    var filter={'UserId':UserId};
    this.messageStatusSub=this._httpcli.post(`${this.s_base_url}/message-read`,
                                        JSON.stringify(filter),
                                        this.s_http_options)
                                        .subscribe(res=>{
                                            this.$messageStatus.next(res);
                                        });
  }

}
