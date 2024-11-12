import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { DashboardModel } from "../../../Models/dashboardModel";
import { CommonService } from "../../../Services/common.service";
import { DelegationService } from "../../../Services/delegation.service";
import { MasterService } from "../../../Services/master.service";
import { DelegationDto } from "../../../Models/onboardingModel";

export interface statusTable {
  toggle: boolean;
  transactionId: string;
  firmName: string;
  createdDate: string;
  lastUpdated: string;
  state: string;
}

// const ELEMENT_DATA: statusTable[] = [
//   { toggle: false, transactionId: '123', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '121', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '122', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '12', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: false, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },
//   { toggle: true, transactionId: '124', firmName: 'sankar', lastUpdated: "28/11/196", createdDate: '12/25/266', state: 'salem' },

// ];

@Component({
  selector: "ngx-approval-delegation",
  templateUrl: "./approval-delegation.component.html",
  styleUrls: ["./approval-delegation.component.scss"],
})
export class ApprovalDelegationComponent implements OnInit {
  selectedItemNgModel;
  ownerEmpId = new FormControl(null, Validators.required);
  delegatedEmpId = new FormControl(null, Validators.required);
  disabled = false;
  displayedColumns: string[] = [
    "toggle",
    "transactionId",
    "firmName",
    "state",
    "createdDate",
    "Status",
  ];
  dataSource: MatTableDataSource<DashboardModel> = new MatTableDataSource();

  ownerEmpIds: string[] = [];
  delegatedEmpIds: string[] = [];
  user: any;
  selectedTransId: any[] = [];

  loader: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _masterService: MasterService,
    private _delegation: DelegationService,
    private _common: CommonService
  ) {}

  ngOnInit(): void {
    const USER = localStorage.getItem("userDetails");
    if (USER != null && USER != undefined) {
      this.user = JSON.parse(USER);
      this.ownerEmpId.valueChanges.subscribe({
        next: (res) => {
          this.delegatedEmpIds = this.ownerEmpIds.filter((x) => {
            return x != res ? x : "";
          });
          if (res != null) {
            this._delegation
              .getPossibleDelegationData(res, this.selectedItemNgModel)
              .subscribe({
                next: (res) => {
                  this.dataSource = new MatTableDataSource(res);
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
                },
                error: (err) => {
                  this._common.openSnackbar(err, snackbarStatus.Danger);
                },
              });
          }
        },
      });
    }
  }

  getUsersByRole(role: string) {
    this.ownerEmpId.patchValue(null);
    this.delegatedEmpId.patchValue(null);
    this.dataSource = new MatTableDataSource();
    this._masterService.getUsersByRole(role).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.ownerEmpIds = res;
        }
      },
    });
  }

  delegateTransaction(row: any) {}

  assignDelegation() {
    if (this.ownerEmpId.valid && this.delegatedEmpId.valid) {
      this.loader = true;
      var delegationdatas: DelegationDto[] = [];
      this.selectedTransId.forEach((transId) => {
        let delegationdata = new DelegationDto();

        delegationdata.TransId = transId;
        delegationdata.Role = this.selectedItemNgModel;
        delegationdata.OwnerEmployeeId = this.ownerEmpId.value;
        delegationdata.DelegatedEmployeeId = this.delegatedEmpId.value;

        delegationdatas.push(delegationdata);
      });

      this._delegation.createDelegation(delegationdatas).subscribe(
        (response) => {
          this._common.openSnackbar(
            "Assigned Sucessfully",
            snackbarStatus.Success
          );
          this._delegation
            .getPossibleDelegationData(
              this.ownerEmpId.value,
              this.selectedItemNgModel
            )
            .subscribe({
              next: (res) => {
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.loader = false;
              },
              error: (err) => {
                this._common.openSnackbar(err, snackbarStatus.Danger);
                this.loader = false;
              },
            });
        },
        (err) => {
          console.log("err", err);
          this._common.openSnackbar(err, snackbarStatus.Danger);
          this.loader = false;
        }
      );

    } else {
      this._common.openSnackbar(
        "Please select all the necessary details",
        snackbarStatus.Danger
      );
    }
  }

  changed(event, element) {
    if (event.checked == true) {
      if (
        this.selectedTransId.length == undefined ||
        this.selectedTransId.length == 0
      ) {
        this.selectedTransId.push(element.TransId);
      } else {
        let i = 0;
        while (i < this.selectedTransId.length) {
          if (this.selectedTransId[i] != element.TransId) {
            this.selectedTransId.push(element.TransId);
            break;
          } else {
            i++;
          }
        }
      }
    } else if (event.checked == false) {
      this.selectedTransId.forEach((transId) => {
        if (transId == element.TransId) {
          this.selectedTransId.splice(
            this.selectedTransId.indexOf(element.TransId),
            1
          );
          return;
        }
      });
    }
  }
}
