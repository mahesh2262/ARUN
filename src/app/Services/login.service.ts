import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { ChangePassword, ForgotPassword, LoginDetails } from "../Models/authModel";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  baseAddress: string = "";

  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  constructor(private _http: HttpService,private _appConfig: AppConfigService) {
    // this.baseAddress = environment.baseAddress;
    this.baseAddress = this._appConfig.get("API");
  }
  
  errorHandler(error: HttpErrorResponse): Observable<any> {
    return throwError(
      error.error instanceof Object
        ? error.error.Error
          ? error.error.Error
          : error.error.Message
          ? error.error.Message
          : error.error.message
        : error.error || error.message || "Server Error"
    );
  }

  islogin(change: boolean) {
    this.emitChangeSource.next(change);
  }

  authUser(loginDetails: LoginDetails): Observable<any> {
    const URL = this.baseAddress + "/Auth/AuthenticateUser";
    return this._http.post(URL, loginDetails);
  }

  getToken() {
    var users = localStorage.getItem("userDetails");
    if (users) {
      let userData = JSON.parse(users);
      return userData.Token;
    }
  }

  isLoggedIn(): boolean {
    var users = localStorage.getItem("userDetails");
    if (users) {
      let userData = JSON.parse(users);
      return !!userData.Token;
    } else {
      return false;
    }
  }

  getOtp(transId: number, email: string): Observable<any> {
    const URL =
      this.baseAddress +
      `/OTP/GenerateOTPForCustomer?transId=${transId}&email=${email}`;
    return this._http.get(URL);
  }

  authenticateCustomer(otp: number, transId: number): Observable<any> {
    const URL =
      this.baseAddress +
      `/OTP/AuthenticateCustomerWithOTP?otp=${otp}&transID=${transId}`;
    return this._http.get(URL);
  }

  getEmailsByTransId(transId: number): Observable<any> {
    const URL = this.baseAddress + `/OTP/GetEmailsByTransId/${transId}`;
    return this._http.get(URL);
  }

  getOTPforForgotPassword(email: string): Observable<any> {
    const URL =
      this.baseAddress + `/Auth/SendResetLinkToMail?emailAddress=${email}`;
    return this._http.get(URL);
  }

  updateNewPassword(forgotPassword: ForgotPassword): Observable<any> {
    const URL = this.baseAddress + `/Auth/ForgotPassword`;
    return this._http.post(URL, forgotPassword);
  }

  changePassword(payload: ChangePassword): Observable<any>{
    const URL = this.baseAddress + `/Auth/ChangePassword`;
    return this._http.post(URL, payload);
  }
}
