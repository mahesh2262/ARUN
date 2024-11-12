import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { PersonalInfo, RecGeoLocation } from "../Models/onboardingModel";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PersoanlInfoService {
  baseAddress: string = "";
  attestrAddress: string = "";
  attestrToken: string = "";
  sharedService: any;

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService,
    private _httpClient: HttpClient
  ) {
    this.baseAddress = this._appConfig.get("PERSONAL_INFO_ENDPOINT");
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

  createPersonalInfo(personalInfo: PersonalInfo): Observable<any | string> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, personalInfo);
  }

  getPersonalInfoByTransId(transId: number): Observable<any | string> {
    const URL = `${this.baseAddress}/GetByTransId/${transId} `;
    return this._http.get(URL);
  }

  GetRecGeoLocation(address: string): Observable<any> {
    return this._httpClient
      .post<RecGeoLocation>(
        `${this.attestrAddress}api/v1/public/checkx/rev-geocode`,
        { address: `${address}` },
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
