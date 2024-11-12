import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PersonalInfo, SecurityDeposits } from "../Models/onboardingModel";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class SecurityDepositService {
  baseAddress: string = "";

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("SECURITY_DEPOSIT_ENDPOINT");
  }

  createSecurityDepositInfo(securityDepositInfo: SecurityDeposits[]): Observable<any | string> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, securityDepositInfo);
  }

  getSecurityDepositInfoByTransId(transId: number): Observable<any | string> {
    const URL = `${this.baseAddress}/GetByTransId/${transId} `;
    return this._http.get(URL);
  }
}
