import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { DashboardModel, DashboardTiles } from "../Models/dashboardModel";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";
import { AdminDashboardDetails } from "../Models/MasterModel";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  baseAddress: string = "";

  constructor(
    private _http: HttpService,
    private _httpClient: HttpClient,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("DASHBOARD_ENDPOINT");
  }

  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || "Server Error");
  }

  GetAll(): Observable<any | string> {
    const URL = `${this.baseAddress}/GetAll`;
    return this._http.get(URL);
  }

  GetAllCount(
    positionId: string,
    role: string,
    empId: string
  ): Observable<DashboardTiles | string> {
    if (!positionId) {
      positionId = "0";
    }
    const URL = `${this.baseAddress}/GetAllCount?positionId=${positionId}&Role=${role}&EmpId=${empId}`;
    return this._http.get(URL);
  }

  GetDashboardTable(
    positionId: string,
    role: string,
    empId: string
  ): Observable<any> {
    if (!positionId) {
      positionId = "0";
    }
    const URL = `${this.baseAddress}/GetDashboardTable?positionId=${positionId}&Role=${role}&EmpId=${empId}`;
    return this._http.get(URL);
  }


  GetAdminDashboardDataCount(): Observable<any> {
    const URL = `${this.baseAddress}/GetAdminDashboardDataCount`;
    return this._http.get(URL);
  }


  GetAdminDashboardTable(
    status: string,
    startIndex: number,
    endIndex: number
  ): Observable<any> {
    const URL = `${this.baseAddress}/GetAdminDashboardTable?status=${status}&startIndex=${startIndex}&endIndex=${endIndex}`;
    return this._http.get(URL);
  }


  GetAdminDashboardData(
    status: string,
  ): Observable<any> {
    const URL = `${this.baseAddress}/GetAdminDashboardData?status=${status}`;
    return this._http.get(URL);
  }

  // GetDashboardData(details:any[]): Observable<any> {
  //   const URL = `${this.baseAddress}/GetWorkFlowData`;
  //   return this._http.get(URL);
  // }


  getStateHead(positionId: string, role: string): Observable<any> {
    const URL = `${this.baseAddress}/GetListForStateHead?positionId=${positionId}&Role=${role}`;
    return this._http.get(URL);
  }

  getWorkFlow(catergory: string, transId: number): Observable<any> {
    const URL = `${this.baseAddress}/GetWorkFlowForForms?Category=${catergory}&TransId=${transId}`;
    return this._http.get(URL);
  }

  // GetWorkflowdata(details: AdminDashboardDetails[]): Observable<any> {
  //   const URL = `${this.baseAddress}/GetWorkFlowData`;
  //   return this._http.post(URL,details,{ responseType: 'blob'});
  // }

  GetWorkflowdata(details: AdminDashboardDetails[]): Observable<Blob | string> {

    const URL = `${this.baseAddress}/GetWorkFlowData`;
    return this._httpClient.post(
      URL, details,
      {
        responseType: 'blob',
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      })
      .pipe(catchError(this.errorHandler));
  }
}
