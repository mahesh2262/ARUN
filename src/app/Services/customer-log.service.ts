import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";
import { CustomerLog } from "../Models/onboardingModel";

@Injectable({
  providedIn: "root",
})
export class CustomerLogService {
  baseAddress: string = "";

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("CUSTOMER_LOG_ENDPOINT");
  }

  getCustomerLogInfoByTransId(transId: number): Observable<any | string> {
    const URL = `${this.baseAddress}/GetUserLogByTransId/${transId} `;
    return this._http.get(URL);
  }

  createLog(customerLog: CustomerLog): Observable<any> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, customerLog);
  }

  createLogDetails(userData, message: string) {
    var customerLog: CustomerLog = new CustomerLog();
    customerLog.Action = userData.Role + " " + message;
    customerLog.ActionedBy = userData.EmpId;
    customerLog.ActionedDate = new Date();
    customerLog.Role = 0;
    customerLog.TransId = parseInt(localStorage.getItem("transID"));

    this.createLog(customerLog).subscribe({
      next: (res) => {},
    });
  }
}
