import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ChannelPartner } from '../../../Models/MasterModel';
import { MasterService } from '../../../Services/master.service';
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-channel-partners",
  templateUrl: "./channel-partners.component.html",
  styleUrls: ["./channel-partners.component.scss"],
})
export class ChannelPartnersComponent implements OnInit {
  displayedColumns: string[] = [
    "transactionId",
    "firmName",
    "category",
    "createdDate",
    // "LastUpdated",
    "state",
    "status",
    "sapCode",
    "virtualCode",
    "Action",
  ];
  channeldataSource: MatTableDataSource<ChannelPartner>;
  // filters: string[] = [
  //   "No filter",
  //   "Pending With ASM",
  //   "Pending With ZH",
  //   "Pending With NH",
  //   "Pending With RA",
  //   "SAP",
  //   "Approved",
  //   "Rejected"
  // ];
  selectedFilter: string;
  role: string;
  positionId: string;
  empId: string;
  Statusselect: string;
  userData: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _channelPartner: MasterService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.Statusselect = "No filter";
    this.getLocalStorage();
    this.getchannelPartnersaData();
  }

  getchannelPartnersaData() {
    this._channelPartner
      .getChannelPartnerForCustomerCode(this.positionId, this.role, this.empId)
      .subscribe((response) => {
        this.channeldataSource = new MatTableDataSource(response);
        this.channeldataSource.paginator = this.paginator;
      });
  }

  formPrefix(id) {
    return "JKW" + "0".repeat(7 - id.toString().length);
  }

  getLocalStorage() {
    const user = localStorage.getItem("userDetails");
    this.userData = JSON.parse(user);
    this.empId = this.userData.EmpId;
    this.positionId = this.userData.PositionId;
    this.role = this.userData.Role;
  }
  dateFormat(date) {
    if (!date) {
      return "";
    }
    return moment(date).format("DD/MM/YYYY");
  }

  searchFilter(filterValue) {
    this.channeldataSource.filter = filterValue.trim().toLowerCase();
  }

  review(transId, status) {
    if (transId) {
      localStorage.setItem("transID", transId);
      localStorage.setItem("status", status);
      this._router.navigate(["/onboarding/approval"]);
    }
  }
}
