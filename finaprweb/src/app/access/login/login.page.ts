import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators,FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { AuthenticateService  } from '../../services/authenticate.service';
import { Subject  } from 'rxjs/Subject';
import { Subscription  } from 'rxjs/Subscription';
import { Router  } from '@angular/router';
import { take,map  } from 'rxjs/operators';
import { MenuService  } from '../../services/menu.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  v_username:string;
  v_password:string;
  v_ret_val:string;
  loginFormGroup:FormGroup;
  fctl_username:FormControl;
  fctl_password:FormControl;
  authSubscription:Subscription;
  $authBS:any

  constructor(private _authSer:AuthenticateService,
              private _router:Router,
              private _menuSer:MenuService) { }

  ngOnInit() {
    console.log(`localStorage:  ${localStorage.getItem('CurrUserMobNo')}`);
    if (localStorage.getItem('CurrUserMobNo')!==null &&
        localStorage.getItem('CurrUserMobNo').length>0
       ){
      console.log(localStorage.getItem('CurrUserMobNo'));
      this._router.navigate(['/','home']);      
    }

    // localStorage.setItem('CurrUserMobNo','');    

    this.loginFormGroup = new FormGroup({
      fctl_username : new FormControl('',[Validators.required]),
      fctl_password : new FormControl('',[Validators.required])
  });
  }

  login() {
    let auth_params={};
    console.log("Login Clicked");
    var user_name=this.loginFormGroup.get('fctl_username').value;
    var password=this.loginFormGroup.get('fctl_password').value;
    console.log(user_name);
    console.log(password);
    auth_params={'UserId':user_name,'Password':password,'LoginDate':new Date()};
    this._authSer.authenticateUser(auth_params);
    this.authSubscription=this._authSer.$auth.subscribe(res=>{
        console.log('Inside the subscription of login');
        console.log(res);
        console.log('Response :'+res['response']);
        this.v_ret_val=res['response'];
        if (res['response'] == 'Access Granted'){
          console.log('Navigating to Home');
          localStorage.setItem('CurrUserMobNo',user_name);
          console.log('**********************AUthGuard Status***************************');
          this.$authBS=this._authSer.isLoggedIn()
                          .pipe(
                            take(1)
                          )
                          .subscribe(res=>{
                              console.log("--------------------");
                              console.log(res);
                          });
          console.log(this.$authBS);
          console.log('*****************************************************************');
          this._router.navigate(['/','home']);

        }
        else{
          localStorage.setItem('CurrUserMobNo','');
          this.v_ret_val='Access Denied, Invalid Userid/Password';
        }
        
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription){
      this.authSubscription.unsubscribe();
    }
    // localStorage.setItem('CurrUserMobNo','');    
  }
}
