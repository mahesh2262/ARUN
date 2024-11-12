import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class EmitterService {
  statusOfFirmEmitter = new Subject<any>();
  categoryEmitter = new Subject<any>();
  isAdvBillingEmitter = new Subject<any>();
  IsNepalCode = new Subject<any>();
  constructor() {
    this.statusOfFirmEmitter.asObservable();
    this.categoryEmitter.asObservable();
    this.isAdvBillingEmitter.asObservable();
    this.IsNepalCode.asObservable();
  }

  emitFirmStatus(status: string) {
    this.statusOfFirmEmitter.next(status);
  }

  emitIsAdvBillingParty(isAdv: boolean) {
    this.isAdvBillingEmitter.next(isAdv);
  }

  emitCategory(change: string) {
    this.categoryEmitter.next(change);
  }

  emitNepalCode(nepalCode: boolean){
    this.IsNepalCode.next(nepalCode);
  }
}
