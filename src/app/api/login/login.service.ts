import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { GenerateTokenResponse } from 'src/Models/Login/GenerateTokenResponse';
import { LoginRequest } from 'src/Models/Login/LoginRequest';
import { LoginResponse } from 'src/Models/Login/LoginResponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authState = new BehaviorSubject(false);
  
  tokenUrl = "/authentication/token/new?api_key=";
  loginUrl = "/authentication/token/validate_with_login?api_key=";

  constructor(private http: HttpClient,
    private router: Router,
    private storage: Storage,
    private platform: Platform) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  async ifLoggedIn(): Promise<void | LoginResponse> {
    let response: LoginResponse = await this.storage.get('USER_INFO');

    if (response) {
      const date = new Date(response.expires_at);
      if (date.getTime() > new Date().getTime()) {
        this.authState.next(true);
      } else {
        this.logout();
      }
    }
    else {
      this.logout();
    }

    return response;
  }

  async isAuthenticated(): Promise<boolean> {
    await this.ifLoggedIn();

    return this.authState.value;
  }

  logout() {
    this.storage.remove('USER_INFO').then(() => {
      this.authState.next(false);
      this.router.navigate(['login']);
    });
  }

  saveLoginInfoAndRedirect(response: LoginResponse) {
    this.storage.set('USER_INFO', response).then((response) => {
      this.authState.next(true);
      this.router.navigate(['home']);
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    let token = await this.generateToken();

    let request = new LoginRequest();

    request.username = email; 
    request.password = password;
    request.request_token = token.request_token;

    return this.http.post<LoginResponse>(environment.baseApi+this.loginUrl+environment.apiKey, request)
    .pipe(
      retry(2),
      catchError(this.handleError))
      .toPromise();
  }

  async generateToken(): Promise<GenerateTokenResponse> {
    return this.http.get<GenerateTokenResponse>(environment.baseApi+this.tokenUrl+environment.apiKey)
      .pipe(
        retry(2),
        catchError(this.handleError))
        .toPromise();
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error code: ${error.status}, ` + `message: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

}
