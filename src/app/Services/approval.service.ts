import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: "root",
})
export class ApprovalService {
  baseAddress: string = "";
  rejectAddress: string = "";
  constructor(
    private _http: HttpService,
    private _appConfig: AppConfigService
  ) {
    this.baseAddress = this._appConfig.get("APPROVAL_ENDPOINT");
    this.rejectAddress = this._appConfig.get("REJECT_ENDPOINT");
  }

  approveTask(taskDto):Observable<any> {
    const URL = `${this.baseAddress}/Create`;
    return this._http.post(URL, taskDto);
  }

  rejectTask(rejectDto):Observable<any> {
      const URL = `${this.rejectAddress}/RejectTransaction`;
      return this._http.post(URL, rejectDto);
    }
}
