import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router  } from '@angular/router';
import { validatePassword, validateMobileNumber } from '../../validators/access.validators';
import { RegisterService } from '../../services/register.service';
import { Subscription } from 'rxjs/Subscription';
import { ApartmentService } from '../../services/apartment.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  v_phone_no: number;
  v_password: string;
  v_cnfm_password: string;
  mobileNoValid: boolean = true;
  passwordsDontMatch: boolean = false;

  registerFormGroup: FormGroup;
  fctl_mobile_no: FormControl;
  fctl_user_name: FormControl;
  fctl_password: FormControl;
  fctl_cnfm_password: FormControl;
  submitAttempt: boolean = false;
  register_sub: Subscription;
  registerStatus: string;
  apartSubscrip: Subscription;
  apartmentListSub;
  apartmentList;

  constructor(private _regSer: RegisterService, 
              private _apartSer: ApartmentService,
              private _router:Router) { }

  ngOnInit() {
    this.registerFormGroup = new FormGroup({
      fctl_mobile_no: new FormControl('',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
          Validators.pattern("^[0-9]{10,10}$")
        ]
      ),
      fctl_user_name: new FormControl('',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      ),
      fctl_password: new FormControl('',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          validatePassword
        ]
      ),
      fctl_cnfm_password: new FormControl('',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          validatePassword
        ]
      ),
      fctl_apart_no: new FormControl('',
        [
          Validators.required
        ]
      )
    });

    this._apartSer.getAptResiList();
    this.apartmentListSub = this._apartSer.$apartment_resi.subscribe(res => {
      console.log('*********************');
      console.log(res);
      this.apartmentList = res;
    });

  }

  get mobileNo() {
    return this.registerFormGroup.get('fctl_mobile_no');
  }

  get userName() {
    return this.registerFormGroup.get('fctl_user_name');
  }

  get password() {
    return this.registerFormGroup.get('fctl_password');
  }

  get cnfm_password() {
    return this.registerFormGroup.get('fctl_cnfm_password');
  }

  clearPassword() {
    console.log('ClearPassword Called');
    this.passwordsDontMatch = false;
    this.password.reset;
    this.cnfm_password.reset;
    this.registerStatus = '';
  }

  register(status) {
    console.log('------------register-----------------');
    console.log(status);

    if (status.controls['fctl_mobile_no']['errors'] !== null) {
      this.mobileNoValid = false;
      return false
    }
    else if (status.controls['fctl_user_name']['errors'] !== null) {
      return false
    }
    else if (status.controls['fctl_password']['errors'] !== null) {
      return false
    }
    else if (status.controls['fctl_cnfm_password']['errors'] !== null) {
      return false
    }
    else if (this.password.value !== this.cnfm_password.value) {
      this.passwordsDontMatch = true;
      return false
    }
    else {
      console.log('All Good');
    }

    console.log(status.controls['fctl_mobile_no']['errors']);
    console.log(status.controls['fctl_user_name']['errors']);
    console.log(status.controls['fctl_password']['errors']);
    console.log(status.controls['fctl_cnfm_password']['errors']);
    this.submitAttempt = true;

    console.log("Register Called");
    let mobile_no = this.registerFormGroup.get('fctl_mobile_no').value;
    let user_name = this.registerFormGroup.get('fctl_user_name').value;
    let pass = this.registerFormGroup.get('fctl_password').value;
    let cnfm_pass = this.registerFormGroup.get('fctl_cnfm_password').value;
    let apart_no = this.registerFormGroup.get('fctl_apart_no').value;

    console.log(mobile_no);
    console.log(user_name);
    console.log(pass);
    console.log(cnfm_pass);
    console.log(apart_no);

    let register_param = {
      'UserId': mobile_no,
      'UserName': user_name,
      'Password': pass,
      'ApartmentNo': apart_no,
      'Role':'User'
    };

    console.log("--------------------------------");
    console.log(register_param);
    console.log("--------------------------------");

    this._regSer.registerUser(register_param);
    this.register_sub = this._regSer.$register.subscribe(res => {
      if (JSON.parse(res['response'])['requestStatus'] === 'Success'){
        this.registerStatus = `User Register ${JSON.parse(res['response'])['requestStatus']}`;
        setTimeout(()=>{
          this.registerStatus='';
          this._router.navigate(['/','login']);
        },2000)
      }
      else {
        this.registerStatus = `User Register ${JSON.parse(res['response'])['requestStatus']} ${JSON.parse(res['response'])['Document']}`;
      }
    });
  }



}
