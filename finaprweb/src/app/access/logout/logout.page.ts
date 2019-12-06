import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { AuthenticateService  } from '../../services/authenticate.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private _router:Router,
              private _authSer:AuthenticateService) { }

  ngOnInit() {
    this.logout();
  }

  logout(){
    if (localStorage.getItem('CurrUserMobNo') !== null){
      console.log('Logging out');
      localStorage.setItem('CurrUserMobNo','');
      this._authSer.setLoggedOut();
      this._router.navigate(['/','login']);
    }
  }
}
