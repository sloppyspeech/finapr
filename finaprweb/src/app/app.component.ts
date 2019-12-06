import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthenticateService  } from './services/authenticate.service';
import { MenuService  } from './services/menu.service';
import { take,map, subscribeOn  } from 'rxjs/operators';
import { Subscription  } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [];
  public appPage$:Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _authSer:AuthenticateService,
    private _menuSer:MenuService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log('App is Ready');
      console.log('======:'+this._authSer.getAuthStatus());
      this._menuSer.getMenuItems().subscribe(res=>{
          this.appPages=[];
          console.log(res);
          this.appPages=res;
      });
    });
  }
}
