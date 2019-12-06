import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators,AbstractControl,FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { validatePassword,validateMobileNumber  } from '../../validators/access.validators';
import { ResetpassService  } from '../../services/resetpass.service';
import { Subscription  } from 'rxjs/Subscription';
import { Router  } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  v_phone_no:number;
  v_password:string;
  v_cnfm_password:string;
  mobileNoValid:boolean=true;
  passwordsDontMatch:boolean=false;
  resetPassSerSubs:Subscription;
  resetPassErrorMessage:string;


  resetPassFormGroup:FormGroup;
  fctl_mobile_no:FormControl;
  fctl_password:FormControl;
  fctl_cnfm_password:FormControl;
  submitAttempt:boolean=false;

  constructor(private _resPass:ResetpassService,
              private _router:Router) { }

  ngOnInit() {
    this.resetPassFormGroup = new FormGroup({
      fctl_mobile_no : new FormControl('',
                          [ 
                            Validators.required,
                            Validators.minLength(10),
                            Validators.maxLength(11),
                            Validators.pattern("^[0-9]{10,10}$")
                          ]
                        ),                
      fctl_password : new FormControl('',
                          [
                            Validators.required,
                            Validators.minLength(8),
                            Validators.maxLength(64),
                            validatePassword
                          ]
                      ),
      fctl_cnfm_password : new FormControl('',
                          [
                            Validators.required,
                            Validators.minLength(8),
                            Validators.maxLength(64),
                            validatePassword
                          ]
                      )
    });

  }

  get mobileNo(){
    return this.resetPassFormGroup.get('fctl_mobile_no');
  }

  get password(){
    return this.resetPassFormGroup.get('fctl_password');
  }

  get cnfm_password() {
    return this.resetPassFormGroup.get('fctl_cnfm_password');
  }

  clearPassword(){
    console.log('ClearPassword Called');
    this.passwordsDontMatch=false;
    this.password.reset;
    this.cnfm_password.reset;
    this.resetPassErrorMessage='';
  }

  resetPassword(status){
    console.log('------------register-----------------');
    console.log(status);

    if (status.controls['fctl_mobile_no']['errors'] !== null){
      this.mobileNoValid=false;
      return false
    }
    else if (status.controls['fctl_password']['errors'] !== null){
      return false
    } 
    else if (status.controls['fctl_cnfm_password']['errors'] !== null){
      return false
    } 
    else if (this.password.value !== this.cnfm_password.value){
      this.passwordsDontMatch=true;
      return false
    }
    else {
      console.log('All Good');
    }
    console.log(status.controls['fctl_mobile_no']['errors']);
    console.log(status.controls['fctl_password']['errors']);
    console.log(status.controls['fctl_cnfm_password']['errors']);
    console.log("Reset Password Called");
    this.submitAttempt=true;
    let mobile_no=this.resetPassFormGroup.get('fctl_mobile_no').value;
    let pass=this.resetPassFormGroup.get('fctl_password').value
    let cnfm_pass=this.resetPassFormGroup.get('fctl_cnfm_password').value
    console.log(mobile_no);
    console.log(pass);
    console.log(cnfm_pass);
    let reset_pass_params={
      'UserId':mobile_no,
      'Password':pass
    };
    console.log("--------------------------------");
    console.log(reset_pass_params);
    console.log("--------------------------------");
    this._resPass.resetPassword(reset_pass_params);
    this.resetPassSerSubs=this._resPass.$reset_pass.subscribe(data=>{
      console.log('$reset_pass '+JSON.stringify(data));
      let res=JSON.parse(data['response']);
      console.log(res);
      if (res['requestStatus']==="Success"){
          this.resetPassErrorMessage="Password Reset Successful.";
          setTimeout(()=>{
            this._router.navigate(['/','login']);
          },2000);
      }
      else{
        this.resetPassErrorMessage="Password Reset Unsuccessful.";
      }
    });
  }
}