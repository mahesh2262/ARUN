import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class AdditionalDataService {
  baseAddress: string = "";
  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("ADDITIONAL_DATA_ENDPOINT");
  }

  getAdditionalData(transID: number) {
    const URL = `${this.baseAddress}/GetOrganisationInputs?TransId=${transID}`;
    return this._http.get(URL);
  }

  updateAdditionalData(additionalData: any): Observable<any> {
    const URL = `${this.baseAddress}/UpdateAdditionalData`;
    return this._http.post(URL, additionalData);
  }
}
