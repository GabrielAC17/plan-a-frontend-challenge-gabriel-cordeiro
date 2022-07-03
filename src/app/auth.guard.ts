import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';
import { LoginService } from './api/login/login.service';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
      public authenticationService: LoginService
        ) {}


    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean>|boolean {
      let promise = this.authenticationService.isAuthenticated().then(res => {
        return res;
      }).catch(err => {
        return false;
      });

      return from(promise);
  }

}