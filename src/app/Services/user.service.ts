import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User } from '../Models/MasterModel';
// import { PersonalInfo, SecurityDeposits } from "../Models/onboardingModel";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseAddress: string = "";

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("CREATE_USER_ENDPOINT");
  }

  createUsersDetails(userInfo: User): Observable<any> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, userInfo);
  }

  updateUsersDetails(userInfo: User): Observable<any> {
    const URL = `${this.baseAddress}/Update`;
    return this._http.post(URL, userInfo);
  }

}
