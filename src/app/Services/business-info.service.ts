import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BusinessInfo } from "../Models/onboardingModel";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class BusinessInfoService {
  baseAddress: string = "";

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("BUSINESS_INFO_ENDPOINT");
  }

  createBusinessInfo(businessInfo: BusinessInfo): Observable<any | string> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, businessInfo);
  }

  getBankInfoByTransId(transId: number): Observable<any | string> {
    const URL = `${this.baseAddress}/GetByTransId/${transId}`;
    return this._http.get(URL);
  }
}
