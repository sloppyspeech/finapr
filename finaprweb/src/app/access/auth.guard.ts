import { Injectable } from '@angular/core';
import { Router  } from '@angular/router';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService  } from '../services/authenticate.service';
import { take,map  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private _authSer:AuthenticateService,
              private _router:Router) {}

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canActivateChild(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  canActivate(route: ActivatedRouteSnapshot){
    return this._authSer
               .isLoggedIn()
               .pipe( take(1),
                      map(res=>{
                              console.log('*** CanActivate *** '+res);
                              console.log(route);
                              if(!res){
                                this._router.navigate(['/','login']);
                                return res;
                              }
                              return res;
                              }
                        )
               );
  }

  canActivateChild(){
    return this._authSer.isLoggedIn();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }


}
