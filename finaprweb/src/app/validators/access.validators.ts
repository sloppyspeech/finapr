import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { format } from 'url';

export function validatePassword(control: AbstractControl) {
    if (control.value) {
        console.log(' Password :' + control.value);
    }
    return null;
}

// function, that takes a FromControl and either returns a JavaScript map or null.  
export function validateMobileNumber(control: AbstractControl): { 
    [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value)
    return valid
        ? null
        : { invalidMobileNumber: { valid: false, value: control.value } }
}


export const validateExpSrchDate :ValidatorFn = (fg:FormGroup)=>{
    const start = fg.get('fctl_start_date').value;
    const end = fg.get('fctl_end_date').value;
    console.log('-------------------------');
    console.log(start);
    console.log(end);
    console.log(typeof(start));
    console.log(typeof(end));
    let startDate=new Date(start);
    let endDate=new Date(end);
    console.log(startDate);
    console.log(endDate);
    console.log('-------------------------');


    if (start !== null && end !== null && start > end){
        console.log('Start Date should be less than end Date');
    }
    return start !== null && end !== null && start > end
      ? null
      : { 'app-listexpense': false };
  };

  export const validateStartEndDate :ValidatorFn = (fg:FormGroup)=>{
    const start = fg.get('fctl_start_date').value;
    const end = fg.get('fctl_end_date').value;
    console.log('-------------------------');
    console.log(start);
    console.log(end);
    console.log(typeof(start));
    console.log(typeof(end));
    let startDate=new Date(start);
    let endDate=new Date(end);
    console.log(startDate.getUTCFullYear());
    console.log(startDate.getUTCMonth());
    console.log(endDate.getUTCFullYear());
    console.log(endDate.getUTCMonth());
    console.log(endDate.valueOf()-startDate.valueOf());
    console.log('-------------------------');
    var NoOfdays=(endDate.valueOf()-startDate.valueOf())/86400000
    console.log(`No Of days ${NoOfdays}`);

    if (start !== null && end !== null && (startDate > endDate || NoOfdays >365)){
        console.log('Start Date should be less than end Date and Not More than 12 Months earlier');
        return {'msg':'Start Date should be LESS than & NOT earlier than 12 Months End Date'};
    }
    else {
        return {};
    }
  };