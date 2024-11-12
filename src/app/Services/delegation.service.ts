import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";
import { DelegationDto } from "../Models/onboardingModel";

@Injectable({
  providedIn: "root",
})
export class DelegationService {
  baseAddress: string = "";
  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("DELEGATION_ENDPOINT");
  }

  getPossibleDelegationData(
    id: string,
    role: string
  ): Observable<any> {
    const URL = `${this.baseAddress}/getPossibleDelegationData?id=${id}&role=${role}`;
    return this._http.get(URL);
  }

  delegateTransaction(delagationDto:DelegationDto):Observable<any> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, delagationDto);
  }

  createDelegation(delegationDtos : DelegationDto[]):Observable<any>{
    const URL = `${this.baseAddress}/CreateDelegation`;
    return this._http.post(URL, delegationDtos);
  }
}
