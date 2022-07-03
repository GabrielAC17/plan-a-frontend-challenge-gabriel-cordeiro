import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LatestMovie } from 'src/Models/Movie/LatestMovie';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  latestMovieUrl = "/movie/latest?language=en-US&api_key=";

  constructor(private http: HttpClient) { }

  async getLatestMovie(): Promise<LatestMovie> {
    return this.http.get<LatestMovie>(environment.baseApi+this.latestMovieUrl+environment.apiKey)
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
  }
}
