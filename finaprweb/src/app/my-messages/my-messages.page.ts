import { Component, OnInit } from '@angular/core';
import { AuthenticateService  } from '../services/authenticate.service';
import { MyMessagesService  } from '../services/my-messages.service';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.page.html',
  styleUrls: ['./my-messages.page.scss'],
})
export class MyMessagesPage implements OnInit {
  UserId:number;
  messageList:any;
  messageListSub;
  messageStatusSub;

  constructor(private _authSer:AuthenticateService,
              private _msgSer:MyMessagesService) { }

  ngOnInit() {
    if(localStorage.getItem('CurrUserMobNo') !== '' ){
      console.log(localStorage.getItem('CurrUserMobNo'));
      this.UserId=parseInt(localStorage.getItem('CurrUserMobNo'));
    }
  }

  ionViewWillEnter(){
    this.showMyMessages();
  }

  ionViewDidEnter(){
    this.setMessageStatusToRead();
  }

  showMyMessages(){
      console.log(this.UserId);
      this._msgSer.showMessages(this.UserId);
      this.messageListSub=this._msgSer.$myMessage.subscribe(res=>{
          console.log('----my-messages.showMyMessages-----');
          console.log(res);
          if (res.length ===0){
            this.messageList=[{
              'Message':'No Payments Found'
            }]
          }
          else{
            this.messageList = res;
          }
      });
  }

  setMessageStatusToRead(){
    console.log(`setMessageStatusToRead  : ${this.UserId}`);
    this._msgSer.setMessageStatusToRead(this.UserId);
    this.messageStatusSub=this._msgSer.$messageStatus.subscribe(res=>{
                          console.log('setMessageStatusToRead Update Status');
                          console.log(res);
                        });
  }
}
