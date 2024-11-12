import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonService } from "./common.service";
import { snackbarStatus } from "../Enums/notification-snack-bar";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private _httpClient: HttpClient) {}

  errorHandler(error: HttpErrorResponse): Observable<any> {
    var message = "";
    if (error.error instanceof Object) {
      if (error.error.errors && error.error.errors instanceof Object) {
        Object.keys(error.error.errors).forEach((key) => {
          message += error.error.errors[key][0] + "\n";
        });
      } else {
        message =
          error.error instanceof Object
            ? error.error.Error
              ? error.error.Error
              : error.error.Message
              ? error.error.Message
              : error.error.message
            : error.error || error.message || "Server Error";
      }
    }
    if (message) throwError(message);
    else return throwError(error.error || error.message || "Server Error");
  }

  get(URL: string) {
    return this._httpClient.get<any>(URL).pipe(catchError(this.errorHandler));
  }

  post(URL: string, Model: any) {
    return this._httpClient
      .post<any>(URL, Model, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      })
      .pipe(catchError(this.errorHandler));
  }

  postUrl(URL: string) {
    return this._httpClient
      .post<any>(URL, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      })
      .pipe(catchError(this.errorHandler));
  }

  postFile(URL: string, formData: FormData) {
    return this._httpClient
      .post<any>(URL, formData)
      .pipe(catchError(this.errorHandler));
  }
}
