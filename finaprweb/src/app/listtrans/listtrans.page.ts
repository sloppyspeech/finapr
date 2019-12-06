import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ListtransService } from "../services/listtrans.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-listtrans',
  templateUrl: './listtrans.page.html',
  styleUrls: ['./listtrans.page.scss'],
})
export class ListtransPage implements OnInit {
  listtrans_sub: Subscription;
  allTrans;

  constructor(private _listSer: ListtransService, private _router: Router) { }

  ngOnInit() {
    this.checkLoggedIn();
  }

  ionViewDidLoad() {
    console.log('lisstrans ionViewDidLoad');
  }
  ionViewWillEnter() {
      this.checkLoggedIn();
  }
  ionViewWillLeave() {
    console.log('lisstrans ionViewWillLeave');
  }

  getAllTrans() {
    console.log(`Inside getAllTrans ${localStorage.getItem('CurrUserMobNo')}`);
    this._listSer.getAllTransByUserId(localStorage.getItem('CurrUserMobNo'));
    this.listtrans_sub = this._listSer.$listtrans.subscribe(res => {
      console.log(res);
      console.log(res.length);
      if (res.length ===0){
          this.allTrans=[{
            'PaymentPurpose':'No Payments Found'
          }]
      }
      else{
        this.allTrans = res;
      }
    })
  }

  checkLoggedIn() {
    if (localStorage.getItem('CurrUserMobNo') !== null &&
      localStorage.getItem('CurrUserMobNo').length > 0
    ) {
      console.log('---------ListtransPage----------');
      console.log(localStorage.getItem('CurrUserMobNo'));
      this.getAllTrans();
      // this._router.navigate(['/', 'home']);
    }
    else {
      this._router.navigate(['/', 'login']);
    }
  }

  goToPay() {
    this._router.navigate(['/', 'pay']);
  }

  ngOnDestroy(): void {
    if (this.listtrans_sub) {
      this.listtrans_sub.unsubscribe();
    }
  }

}
