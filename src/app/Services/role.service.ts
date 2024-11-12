import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { AppConfigService } from './app-config.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseAddress: string = "";

  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("ROLE_ID_ENDPOINT");
  }

  getRoles():Observable <any> {
    const URL = `${this.baseAddress}/GetRoles `;
    return this._http.get(URL);
  }
}
