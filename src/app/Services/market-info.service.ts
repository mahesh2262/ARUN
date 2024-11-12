import { Injectable } from '@angular/core';
import { Observable,Subject,throwError } from 'rxjs';
import { GSTResult, MarketInfo } from '../Models/onboardingModel';
import { AppConfigService } from './app-config.service';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {catchError } from 'rxjs/operators';
import { ApprovalNotificationList } from '../Models/MasterModel';

@Injectable({
  providedIn: "root",
})
export class MarketInfoService {
  attestrToken: string;
  baseAddress: string = "";
  attestrAddress: string = "";

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService,
    private _httpClient: HttpClient
  ) {
    this.baseAddress = this._appConfig.get("MARKET_INFO_ENDPOINT");
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

  createMarketInfo(marketInfo: MarketInfo): Observable<any | string> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, marketInfo);
  }

  getMarketInfoByTransId(transId: number): Observable<any | string> {
    const URL = `${this.baseAddress}/GetByTransId/${transId}`;
    return this._http.get(URL);
  }
  ValidateGST(gstNumber: string): Observable<GSTResult | string> {
    return this._httpClient
      .post<GSTResult>(
        `${this.attestrAddress}api/v1/public/corpx/gstin`,
        { gstin: `${gstNumber}`, fetchFilings: false },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Basic ${this.attestrToken}`,
          }),
        }
      )
      .pipe();
  }
}
