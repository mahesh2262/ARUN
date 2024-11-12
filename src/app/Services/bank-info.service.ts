import { Injectable } from "@angular/core";
import { BankAccountResult, BankDetails } from "./../Models/onboardingModel";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { BankInfo } from "../Models/onboardingModel";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class BankInfoService {
  attestrToken: string;
  baseAddress: string = "";
  attestrAddress: string = "";

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService,
    private _httpClient: HttpClient
  ) {
    this.baseAddress = this._appConfig.get("BANK_INFO_ENDPOINT");
    this.attestrAddress = environment.attestrAddress;
    this.attestrToken = environment.attestrToken;
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

  createBankInfo(bankInfo: BankDetails): Observable<any | string> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, bankInfo);
  }

  getBankInfoByTransId(transId: number): Observable<any | string> {
    const URL = `${this.baseAddress}/GetByTransId/${transId}`;
    return this._http.get(URL);
  }

  ValidateBankAccount(
    accNumber: string,
    IFSCCode: string
  ): Observable<BankAccountResult | string> {
    return this._httpClient
      .post<BankAccountResult>(
        `${this.attestrAddress}api/v1/public/finanx/acc`,
        { acc: `${accNumber}`, ifsc: `${IFSCCode}` },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Basic ${this.attestrToken}`,
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  ValidateIfscCode(IFSCCode: string): Observable<BankAccountResult | string> {
    return this._httpClient
      .post<BankAccountResult>(
        `${this.attestrAddress}api/v1/public/finanx/ifsc`,
        { ifsc: `${IFSCCode}` },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Basic ${this.attestrToken}`,
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }
}
