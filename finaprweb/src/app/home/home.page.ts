import { Component } from '@angular/core';
import { ApartmentService } from '../services/apartment.service';
import { AuthenticateService  } from '../services/authenticate.service';
import { Subscription  } from 'rxjs/Subscription';
import { take  } from 'rxjs/operators';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake.js';
import { PdfMakeWrapper  } from 'pdfmake-wrapper';
import pdfFonts  from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
PdfMakeWrapper.setFonts(pdfFonts);


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  v_occupantName:string;
  private s_curr_user:string="";
  apartSubscription:Subscription;
  v_apart_number;
  v_mobile_no;
  v_apart_name;
  pdf:any;
  filename:any;
  pdfDoc:any;
  // pdfMake.vfs = pdfFonts.pdfMake.vfs;


  constructor(private _apartSer:ApartmentService,
              private _router:Router,
              private _authSer:AuthenticateService) {}


  ngOnInit(): void {
    // this.displayHomePage();
 
  }

  ionViewWillEnter(){
    console.log('Home Page TS ionViewWillEnter displayHomePage');
    this._authSer
                .isLoggedIn()
                .pipe(take(1))
                .subscribe(res=>{
                  console.log('=========ionViewWillEnter=======');
                  console.log(res);
                });
    this.displayHomePage()
    // this.checkLoggedIn();
  }

  displayHomePage(){

    this.s_curr_user=localStorage.getItem('CurrUserMobNo');
    console.log(`=====HomePage this.s_curr_user====${this.s_curr_user}== ${this.s_curr_user.length}`);
    if (this.s_curr_user !==null && this.s_curr_user.length >0){
      this._apartSer.getApartmentByMobNo(this.s_curr_user);
      this.apartSubscription=this._apartSer.$apartment_dets.subscribe(res=>{
        console.log('----------HomePage-------------');
        console.log('HomePage :'+JSON.stringify(res));
        this.v_apart_name=res['Name'];
        this.v_mobile_no=res['MobileNo'];
        this.v_apart_number=res['Number'];
        this.v_occupantName=res['Occupant'];
      });
    }
    else{
      this._router.navigate(['/','login']);
    }
  }

  getPdf(){
    this.pdfDoc = {
      watermark: { text: 'FINAPR Beta', color: 'violet', opacity: 0.2, bold: false, italics: false },
      content: [
        {text: 'PdfComponent Example', style: 'header'},
        {text: 'This was generated using Angular and PdfMake', style: 'body'},
        {text: 'PdfMake', link: 'https://pdfmake.github.io/docs/', style: 'link'}
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true
        },
        body: {
          fontSize: 12
        },
        link: {
          fontSize: 12,
          color: '#03A9F4'
        }
      }
    };

    pdfMake.createPdf(this.pdfDoc).download('jill.pdf');
  }

  ngOnDestroy(): void {
    if (this.apartSubscription){
      this.apartSubscription.unsubscribe();
    }
  }
}
