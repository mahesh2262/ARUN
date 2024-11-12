import { Component, OnInit } from '@angular/core';
import { CustomerLog } from '../../../Models/onboardingModel';
import { CustomerLogService } from '../../../Services/customer-log.service';




@Component({
  selector: 'ngx-customer-log',
  templateUrl: './customer-log.component.html',
  styleUrls: ['./customer-log.component.scss']
})
export class CustomerLogComponent implements OnInit {
  transId: any;;
  logsData: CustomerLog[] = []
  constructor(
    private _customerLogInfo: CustomerLogService,
  ) { }

  ngOnInit(): void {
    const transId = localStorage.getItem("transID");
    this.transId = Number(transId);
    this.getCustomerLogInformation();
  }

  getCustomerLogInformation() {
    this._customerLogInfo.getCustomerLogInfoByTransId(this.transId)
      .subscribe((response) => {
        this.logsData = response;
      }, (err) => {
        console.log("err", err)
      })
  }

}
