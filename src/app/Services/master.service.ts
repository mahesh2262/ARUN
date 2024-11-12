import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  ApprovalNotificationList,
  ChannelPartner, EmailSetting,
  Territory,
} from "../Models/MasterModel";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  baseAddress: string = "";
  userAddress: string = "";
  channelPartner: string = "";
  baseUrl: string = "";
  territoryMasterUrl: string = "";

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService,
    private _httpClient: HttpClient
  ) {
    this.baseUrl = this._appConfig.get("API");
    this.baseAddress = this._appConfig.get("MASTERS_ENDPOINT");
    this.userAddress = this._appConfig.get("USERS_ENDPOINT");
    this.channelPartner = this._appConfig.get("CHANNEL_PARTNER");
    this.territoryMasterUrl = this._appConfig.get("TERRITORY_MASTER_ENDPOINT");
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

  getStates(): Observable<any> {
    const URL = `${this.baseAddress}/getStates`;
    return this._http.get(URL);
  }

  getDistrictsByStateCode(stCode: string): Observable<any> {
    const URL = `${this.baseAddress}/getDistricts?stCode=${stCode}`;
    return this._http.get(URL);
  }

  // getProducts(): Observable<any> {
  //   const URL = `${this.baseAddress}/getStates`;
  //   return this._http.get(URL);
  // }

  getAccountGroup(): Observable<any> {
    const URL = `${this.baseAddress}/GetAccountGroupMasters`;
    return this._http.get(URL);
  }

  getDistributionChannel(): Observable<any> {
    const URL = `${this.baseAddress}/GetDistributionChannelMasters`;
    return this._http.get(URL);
  }

  getDivisions(): Observable<any> {
    const URL = `${this.baseAddress}/GetDivisionMasters`;
    return this._http.get(URL);
  }

  getDivisionMaterialMap(): Observable<any> {
    const URL = `${this.baseAddress}/GetDivisionMaterialMap`;
    return this._http.get(URL);
  }

  getRegions(): Observable<any> {
    const URL = `${this.baseAddress}/GetRegionMasters`;
    return this._http.get(URL);
  }

  getCategories(): Observable<any> {
    const URL = `${this.baseAddress}/GetAllCustomerType`;
    return this._http.get(URL);
  }
  getSaleOrgMasters(): Observable<any | string> {
    const URL = `${this.baseAddress}/getSaleOrgMasters`;
    return this._http.get(URL);
  }
  getAllUsers(): Observable<any> {
    const URL = `${this.userAddress}/GetUsers`;
    return this._http.get(URL);
  }

  getTerritory(): Observable<any> {
    const URL = `${this.territoryMasterUrl}/GetTerritoryMasters`;
    return this._http.get(URL);
  }

  addTerritory(territory: Territory): Observable<any> {
    const URL = `${this.territoryMasterUrl}/CreateTerritoryMaster`;
    return this._http.post(URL, territory);
  }

  editTerritory(territory: Territory): Observable<any> {
    const URL = `${this.territoryMasterUrl}/UpdateTerritoryMaster`;
    return this._http.post(URL, territory);
  }

  deleteTerritory(Id: number): Observable<any> {
    const URL = `${this.territoryMasterUrl}/DeleteTerritoryMaster?Id=${Id}`;
    return this._http.postUrl(URL);
  }
  // this.empId,this.positionId,this.role,this.selectedStatus
  getChannelPartner(
    empId: string,
    positionId: string,
    role: string,
    status: string
  ): Observable<ChannelPartner | any> {
    const params = new HttpParams()
      .set("empId", empId)
      .set("positionId", positionId)
      .set("role", role)
      .set("status", status);
    const URL = `${this.channelPartner}/GetList/`;
    return this._httpClient.get(URL, { params });
  }

  getChannelPartnerForCustomerCode(
    positionId: string,
    role: string,
    empId: string
  ): Observable<ChannelPartner | any> {
    const params = new HttpParams()

      .set("positionId", positionId)
      .set("role", role)
      .set("empId", empId);
    const URL = `${this.channelPartner}/GetFilterCustomerCode`;
    return this._httpClient.get(URL, { params });
  }

  getUsersByRole(role): Observable<any> {
    const URL = `${this.userAddress}/GetUsersByRole?role=${role}`;
    return this._http.get(URL);
  }

  getApprovalNotification(): Observable<ApprovalNotificationList | any> {
    const URL = `${this.baseAddress}/GetApprovalNotifications`;
    return this._http.get(URL);
  }

  CreateApprovalNotification(
    approvalNotifiaction: ApprovalNotificationList
  ): Observable<ApprovalNotificationList | any> {
    const URL = `${this.baseAddress}/CreateApprovalNotification`;
    return this._http.post(URL, approvalNotifiaction);
  }

  deleteApprovalDelagation(id: number): Observable<any> {
    const URL = `${this.baseAddress}/DeleteApprovalNotificationById/${id}`;
    return this._http.get(URL);
  }

  getAccountAssignment(): Observable<any> {
    const URL = `${this.baseUrl}/AccAssignGroup/Get`;
    return this._http.get(URL);
  }

  getCustomerGroup(): Observable<any> {
    const URL = `${this.baseUrl}/CustomerGroup/Get`;
    return this._http.get(URL);
  }
  getCustomerPriceProcedure(): Observable<any> {
    const URL = `${this.baseUrl}/CustomerPriceProcedure/Get`;
    return this._http.get(URL);
  }
  getCustomerStatistics(): Observable<any> {
    const URL = `${this.baseUrl}/CustomerStatistics/Get`;
    return this._http.get(URL);
  }
  getDeliveryPriority(): Observable<any> {
    const URL = `${this.baseUrl}/DeliveryPriority/Get`;
    return this._http.get(URL);
  }
  getIncoTerms(): Observable<any> {
    const URL = `${this.baseUrl}/IncoTerms/Get`;
    return this._http.get(URL);
  }
  getPaymentMethod(): Observable<any> {
    const URL = `${this.baseUrl}/PaymentMethod/Get`;
    return this._http.get(URL);
  }
  getPaymentTerms(): Observable<any> {
    const URL = `${this.baseUrl}/PaymentTerms/Get`;
    return this._http.get(URL);
  }
  getPriceGroup(): Observable<any> {
    const URL = `${this.baseUrl}/PriceGroup/Get`;
    return this._http.get(URL);
  }
  getPriceList(): Observable<any> {
    const URL = `${this.baseUrl}/PriceList/Get`;
    return this._http.get(URL);
  }
  getRecocilationAccount(): Observable<any> {
    const URL = `${this.baseUrl}/RecocilationAccount/Get`;
    return this._http.get(URL);
  }
  getSalesDistrict(): Observable<any> {
    const URL = `${this.baseUrl}/SalesDistrict/Get`;
    return this._http.get(URL);
  }
  getSalesOffice(): Observable<any> {
    const URL = `${this.baseUrl}/SalesOffice/Get`;
    return this._http.get(URL);
  }
  getSalesGroupBysoCode(soCode: string): Observable<any> {
    const URL = `${this.baseUrl}/SalesGroup/GetBySalesOffice?soCode=${soCode}`;
    return this._http.get(URL);
  }
  getShippingCondition(): Observable<any> {
    const URL = `${this.baseUrl}/ShippingCondition/Get`;
    return this._http.get(URL);
  }

  getIndustry(): Observable<any> {
    const URL = `${this.baseUrl}/Indutry/Get`;
    return this._http.get(URL);
  }
  getAttributeSix(): Observable<any> {
    const URL = `${this.baseUrl}/AttributeSix/Get`;
    return this._http.get(URL);
  }
  getAttributeNine(): Observable<any> {
    const URL = `${this.baseUrl}/AttributeNine/Get`;
    return this._http.get(URL);
  }

  getAttributeTwo(): Observable<any> {
    const URL = `${this.baseUrl}/AttributeTwo/Get`;
    return this._http.get(URL);
  }

  getCompanyCode(): Observable<any> {
    const URL = `${this.baseUrl}/CompanyCode/Get`;
    return this._http.get(URL);
  }

  getDefaultDataByCustomerGroup(customerGroup: string): Observable<any> {
    const URL = `${this.baseAddress}/GetDefaultDataByCustomerGroup?CustomerGroup=${customerGroup}`;
    return this._http.get(URL);
  }

  getEmail(): Observable<EmailSetting | any> {
    const URL = `${this.baseAddress}/GetDailyEmails`;
    return this._http.get(URL);
  }

  CreateEmail(
    Email: EmailSetting
  ): Observable<ApprovalNotificationList | any> {
    const URL = `${this.baseAddress}/CreateEmail`;
    return this._http.post(URL, Email);
  }

  deleteEmail(Email : EmailSetting): Observable<any> {
    const URL = `${this.baseAddress}/DeleteDailyEmail`;
    return this._http.post(URL,Email);
  }
}
