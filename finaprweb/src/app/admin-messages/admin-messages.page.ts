import { Component, OnInit } from '@angular/core';
import { AdminMessagesService  } from '../services/admin-messages.service';
import { ApartmentService  } from '../services/apartment.service';
import { Router  } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormControl, FormGroup, Validators, AbstractControl, FormBuilder, ReactiveFormsModule, MinLengthValidator } from '@angular/forms';


@Component({
  selector: 'app-messages',
  templateUrl: './admin-messages.page.html',
  styleUrls: ['./admin-messages.page.scss'],
})
export class AdminMessagesPage implements OnInit {
  sendMessageFormGroup: FormGroup;
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
  sendMessageStatus:string;
  insMessageSub;

  constructor(private _msgSer:AdminMessagesService,
              private _apartSer:ApartmentService) { }

  ngOnInit() {
    this.sendMessageFormGroup = new FormGroup({
      fctl_mobile_no: new FormControl({value:'',disabled:true},
        [
          Validators.required
        ]
      ),
      fctl_occupant_name: new FormControl({value:'',disabled:true},
        [
          Validators.required
        ]
      ),
      fctl_apart_no: new FormControl('',
        [
          Validators.required
        ]
      ),
      fctl_broadcast_message_all: new FormControl({value:''},
        [
          Validators.required
        ]
      ),
      fctl_message: new FormControl('Message size 10 to 256 characters',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(256)
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

  getMobileNo(){
    return this.sendMessageFormGroup.get('fctl_mobile_no');
  }

  getOccupantName(){
    return this.sendMessageFormGroup.get('fctl_occupant_name');
  }

  getApartmentNumber(){
    return this.sendMessageFormGroup.get('fctl_apart_no');
  }

  getMessage() {
    return this.sendMessageFormGroup.get('fctl_message');
  }

  getBroadCastToAll(){
    return this.sendMessageFormGroup.get('fctl_broadcast_message_all');
  }

  populateFields(values:any){
    console.log('-------------------------');
    console.log(this.apartmentList);
    var aptNumber=values['detail'];
    console.log(aptNumber['value']);
    for (var i=0;i< this.apartmentList.length;i++){
      console.log(this.apartmentList[i]['Number'] );
      if (this.apartmentList[i]['Number'] === aptNumber['value']) {
        this.getMobileNo().setValue(this.apartmentList[i]['MobileNo']);
        this.getOccupantName().setValue(this.apartmentList[i]['Occupant'])
        break;
      }
    }
  }

  clearMessage(){
    this.getMessage().setValue('');
    console.log('-------Clear Message Broadcast Toggle Value-----');
    console.log(this.getBroadCastToAll().value);
  }

  setFieldsForBroadcast(){
      this.getMobileNo().setValue(0);
      this.getOccupantName().setValue('BroadCast Message');
      this.getApartmentNumber().setValue('XX');
      console.log('==============================');
      console.log(this.getBroadCastToAll().value);
  }

  sendMessage(){
    var message={
      'RecipientName':this.getOccupantName().value,
      'RecipientMobileNo': this.getMobileNo().value,
      'RecipientApartment': this.getApartmentNumber().value,
      'Message':this.getMessage().value,
      'Date':new Date(),
      'Read':'N',
      'BroadCastToAll':this.getBroadCastToAll().value
    }
    //



    console.log(message);
    this._msgSer.insertMessage(message);
    this.insMessageSub=this._msgSer.$insMessage.subscribe(res=>{

      console.log('===========Insert Message Response=====================');
      console.log(res);

      if (res['returnStatus']=='Success'){
        this.sendMessageStatus='Message Sent Successfully.'
        
        setTimeout(() => {
            this.sendMessageFormGroup.reset();
            this.sendMessageStatus='';
        }, 2000);

      }
      else {
        this.sendMessageStatus='Error in Sending Message,try again after sometime.'
      }
    });
  }

}
