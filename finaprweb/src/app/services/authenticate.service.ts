import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private s_base_url = 'http://localhost:9000/api/v1';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private s_auth_user_sub: any;
  private s_auth_res;
  private s_isLoggedIn = new BehaviorSubject<boolean>(false);
  $auth = new Subject<string>();


  constructor(private _httpcli: HttpClient,
    private _menuSer: MenuService) { }

  authenticateUser(p_auth_params: any) {
    console.log('In authenticateUser');
    console.log(p_auth_params);
    this.s_auth_user_sub = this._httpcli.post(`${this.s_base_url}/access/login`, JSON.stringify(p_auth_params), this.s_http_options)
      .subscribe(res => {
        console.log('**************Authenticate User Response.***********');
        console.log(res);
        console.log(res['response']);
        this.s_auth_res = res;
        if (res['response'] == 'Access Granted') {
          console.log('Auth Service Navigating to Home');
          this.setLoggedIn();
          // localStorage.setItem('CurrUserMobNo',user_name);
          // this._router.navigate(['/','home']);
          if (res['Role'] === 'Admin') {
            this._menuSer.setAdminMenu();
          }
          else {
            this._menuSer.setUserMenu();
          }
        }
        else {
          // localStorage.setItem('CurrUserMobNo','');
          // this.v_ret_val='Access Denied, Invalid Userid/Password';
        }
        this.$auth.next(this.s_auth_res);
      });
  }

  getAuthStatus() {
    return this.s_auth_res
  }

  setLoggedIn() {
    console.log('Authservice setLoggedIn Called');
    this.s_isLoggedIn.next(true);
  }

  isLoggedIn() {
    console.log('Authservice isLoggedIn Called');
    return this.s_isLoggedIn.asObservable();
  }

  setLoggedOut() {
    console.log('Authservice setLoggedOut Called');
    this.s_isLoggedIn.next(false);
    this._menuSer.setLoginMenu();
  }

  ngOnDestroy(): void {
    this.s_auth_user_sub.unsubscribe();
  }
}
