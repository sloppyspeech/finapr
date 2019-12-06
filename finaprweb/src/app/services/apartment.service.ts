import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Subject  } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  private s_base_url='http://localhost:9000/api/v1';
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private s_apart_dets_subs:any;
  private s_apart_dets;
  $apartment_dets=new Subject<string>();
  $aptDetsByAptNo=new Subject<string>();
  $apartment_resi=new Subject<any>();

  constructor(private _httpcli:HttpClient) { }

  
  getApartmentByMobNo(p_mob_no){
    this.s_apart_dets_subs=this._httpcli
                               .get(`${this.s_base_url}/apartments/apartment-by-mobno/${p_mob_no}`)
                               .subscribe(res=>{
                                  console.log('--------getApartmentByMobNo-----response-----');
                                  console.log('getApartmentByMobNo:'+JSON.stringify(res));
                                  this.s_apart_dets=res;
                                  this.$apartment_dets.next(this.s_apart_dets);
                               });
  }


  getAptResiList(){
    this.s_apart_dets_subs=this._httpcli
                               .get(`${this.s_base_url}/apartments/curr-residents`)
                               .subscribe(res=>{
                                  console.log('-------getAptResiList response-----------');
                                  console.log('getAptResiList:'+res);
                                  this.$apartment_resi.next(res);
                               });
  }


  getApartmentByAptNo(p_apart_no){
    this.s_apart_dets_subs=this._httpcli
                               .get(`${this.s_base_url}/apartments/apartment-by-apartno/${p_apart_no}`)
                               .subscribe((res:string) =>{
                                  console.log('--------getApartmentByApartNo-----response-----');
                                  console.log('getApartmentByApartNo:'+JSON.stringify(res));
                                  this.$aptDetsByAptNo.next(res);
                               });
  }


}
