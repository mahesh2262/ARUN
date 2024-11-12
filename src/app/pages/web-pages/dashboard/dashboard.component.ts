import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DashboardService } from "../../../Services/dashboard.service";
import * as moment from "moment";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { DashboardTable, DashboardTiles } from "../../../Models/dashboardModel";
import { MasterService } from "../../../Services/master.service";

export interface statusTable {
  transId: string;
  name: string;
  createdOn: string;
  lastUpdated: string;
  state: string;
  status: string;
  Action: string;
}

@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  selectedItem: any;
  tabData: string;
  displayedColumns: string[] = [
    "TransId",
    "Name",
    "category",
    "CreatedOn",
    // "LastUpdated",
    "State",
    "Status",
    "CustomerCode",
    "Action",
  ];
  dataSource: any;
  filters: string[] = [
    "Pending With ASM",
    "Pending With ZH",
    "Pending With NH",
    "Pending With RA",
    "SAP",
    "Rejected",
  ];
  dashboardTableData: DashboardTable = new DashboardTable();
  tableTitleHeader: string = "All";
  sortedStatusData: any[] = [];
  userData: any;
  loader: boolean = false;
  role: string;
  positionId: string;
  empId: string;
  Statusselect: string;

  tilesCount: DashboardTiles = new DashboardTiles();

  prefix: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _router: Router,
    private _dashboardService: DashboardService,
    private _dashboardFilter: MasterService
  ) {}

  ngOnInit(): void {
    const USER = localStorage.getItem("userDetails");
    localStorage.removeItem("isAdvBillingParty");
    localStorage.removeItem("accNumber");
    if (USER) {
      this.userData = JSON.parse(USER);
      this.role = this.userData.Role;
      this.empId = this.userData.EmpId;
      this.positionId = this.userData.PositionId;
      if (this.role == "NH") {
        this.loader = true;
        this._dashboardService
          .getStateHead(this.positionId, this.role)
          .subscribe({
            next: (response) => {
              this.dataSource = new MatTableDataSource(response);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.loader = false;
            },
            error: (err) => {
              this.loader = false;
            },
          });
      } else {
        this.getAllTableData();
      }
    }
  }

  ngAfterViewInit() {}

  tableView(event) {}

  data(status) {
    this.tabData = status;
    this.Statusselect = null;
    if (status == "All") {
      this.tableTitleHeader = "All";
      this.sortedStatusData = [];
      this.dataSource = new MatTableDataSource(this.dashboardTableData.All);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else if (status == "Draft") {
      this.tableTitleHeader = "Draft";
      this.dataSource = new MatTableDataSource(this.dashboardTableData.Draft);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else if (status == "Intiated") {
      this.tableTitleHeader = "Initiated";
      this.dataSource = new MatTableDataSource(
        this.dashboardTableData.Initiated
      );
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else if (status == "Pending") {
      this.tableTitleHeader = "Pending";
      this.dataSource = new MatTableDataSource(this.dashboardTableData.Pending);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else if (status == "Approved") {
      this.tableTitleHeader = "Approved";
      this.dataSource = new MatTableDataSource(
        this.dashboardTableData.Approved
      );
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else if (status == "Rejected") {
      this.tableTitleHeader = "Rejected";
      this.dataSource = new MatTableDataSource(
        this.dashboardTableData.Rejected
      );
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  formPrefix(id) {
    return ("JKW" + "0".repeat(7 - id.toString().length));
  }
  review(transId, status) {
    if (transId) {
      localStorage.setItem("status", status);
      localStorage.setItem("transID", transId);
      this._router.navigate(["/onboarding/approval"]);
    }
  }

  getAllTableData() {
    this.loader = true;
    this._dashboardService
      .GetDashboardTable(
        this.userData.PositionId,
        this.role,
        this.userData.EmpId
      )
      .subscribe({
        next: (response) => {
          this.dashboardTableData = response as DashboardTable;
          this.dataSource = new MatTableDataSource(this.dashboardTableData.All);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.loader = false;
        },
        error: (err) => {
          this.loader = false;
        },
      });
  }

  dateFormat(date) {
    if (!date) {
      return "";
    }
    return moment(date).format("DD/MM/YYYY");
  }

  getDashboardTableData() {
    this._dashboardFilter
      .getChannelPartner(
        this.empId,
        this.positionId,
        this.role,
        this.Statusselect
      )
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      });
  }

  searchFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectedStatus($event) {
    this.Statusselect = $event;

    this.getDashboardTableData();
  }

  accessShowHide(status): boolean {
    if (
      (status.toLowerCase() === "initiated" ||
        status.toLowerCase() === "draft" ||
        status.toLowerCase() == "rejected" ||
        status.toLowerCase() == "approved") &&
      this.userData.Role == "ASM"
    )
      return true;
    if (status.includes(this.userData.Role)) return true;
    if (this.userData.Role == "SH") return true;
    return false;
  }
}
