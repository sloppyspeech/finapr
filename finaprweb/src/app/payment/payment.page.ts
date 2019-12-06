import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators,ReactiveFormsModule} from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MasterReferenceService  } from '../services/master-reference.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})

export class PaymentPage implements OnInit {
  private makePaymentFormGroup:FormGroup;
  private fctl_payment_amount:FormControl;
  private fctl_payment_purpose:FormControl;
  private fctl_payment_date:FormControl;
  private fctl_payment_comment:FormControl;
  private userId:any;
  private payment_rec;
  private $payment_response_sub:Subscription;
  private payment_response;
  private purposeListSub;
  paymentPurposes;

  constructor(private _paySer:PaymentService,
              public toastController: ToastController,
              private _router:Router,
              private _masterRef:MasterReferenceService) { }

  ngOnInit() {
    this.checkLoggedIn();
    
    this.userId=localStorage.getItem('CurrUserMobNo');
    this.makePaymentFormGroup = new FormGroup({
      fctl_payment_amount : new FormControl('',[Validators.required]),
      fctl_payment_purpose : new FormControl('',[Validators.required]),
      fctl_payment_date : new FormControl('',[Validators.required]),
      fctl_payment_comment : new FormControl('',[])
    });

    this._masterRef.getPaymentPurposes();
    this.purposeListSub=this._masterRef.PaymentPurposes$
                            .subscribe(res=>{
                                  console.log('------------------------');
                                  console.log(res[0]['PaymentPurpose']);
                                  this.paymentPurposes=res[0]['PaymentPurpose'];
                             })
  }

  resetFields(){
    this.makePaymentFormGroup.get('fctl_payment_amount').reset();
    this.makePaymentFormGroup.get('fctl_payment_date').reset();
    this.makePaymentFormGroup.get('fctl_payment_purpose').reset();
    this.makePaymentFormGroup.get('fctl_payment_comment').reset();
  }
  makePayment(){
    this.payment_rec={
      'UserId':this.userId,
      'Amount':this.makePaymentFormGroup.get('fctl_payment_amount').value,
      'PaymentDate':this.makePaymentFormGroup.get('fctl_payment_date').value,
      'PaymentPurpose':this.makePaymentFormGroup.get('fctl_payment_purpose').value,
      'Comment':this.makePaymentFormGroup.get('fctl_payment_comment').value
    }
    console.log(this.payment_rec);

    this._paySer.makePayment(this.payment_rec);
    this.$payment_response_sub=this._paySer.$payment_action.subscribe(data=>{
      console.log('In Payment Response Payment Page.ts');
      console.log(data);
      if (data['requestStatus']==='Success'){
        this.presentToast("Payment Successful","success");
        this.resetFields();
        this._router.navigate(['/','listtrans']);
      }
    });
                         
  }

  async presentToast(message:string,color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color:color
    });
    toast.present();
  }

  checkLoggedIn(){
      if (localStorage.getItem('CurrUserMobNo') !== null &&
      localStorage.getItem('CurrUserMobNo').length > 0
    ) {
      console.log('---------PaymentPage----------');
      console.log(localStorage.getItem('CurrUserMobNo'));
      // this.getAllTrans();
      // this._router.navigate(['/', 'home']);
    }
    else {
      this._router.navigate(['/', 'login']);
    }
  }

}
