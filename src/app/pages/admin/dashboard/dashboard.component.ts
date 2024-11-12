import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../../Services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from "moment";
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DashboardTiles } from '../../../Models/dashboardModel';
import {AdminDashboardDetails, AdminDetails} from "../../../Models/MasterModel";
import {DatePipe} from "@angular/common";
import { saveAs } from "file-saver";

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  displayedColumns: string[] = [
    "TransId",
    "Name",
    "category",
    "CreatedOn",
    "State",
    "Status",
  ];
  dataSource = new MatTableDataSource();
  loader: boolean = false;
  adminDashboardDataLength: number = 0;
  dashboardTableData: DashboardTiles;
  cardStatus: string = "All";
  pageIndex: number = 0;
  pageSize: number = 5;
  datalength: number = 0;
  allDataCount: number = 0;
  paginatorLength: number;
  numOfData : number = 20;
  dashboardData: any[] =[];
  excelDownloadDetails : AdminDashboardDetails [] = [];
  // dataCount: number;
  download : boolean = false;
  documentsheet : any[];
  downloadCLick : boolean;
  FuncCompleted : boolean = false;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _dashboardService: DashboardService, public datepipe: DatePipe) { }

  ngOnInit(): void {

    this.getDashboarDatadCount();
    // this.getDashboardTableData(this.cardStatus, this.datalength * this.pageSize, 20);
    // this.excelDownload();

  }

  getDashboarDatadCount() {
    this._dashboardService.GetAdminDashboardDataCount().subscribe({
      next: (response) => {
        this.dashboardTableData = response
        // this.dataCount = response.All
        this.getDashboardTableData(this.cardStatus, this.datalength * this.pageSize, this.numOfData);
      }
    })
  }

  getDashboardTableData(status, startIndex, endIndex) {
    this.loader = true;
    this._dashboardService.GetAdminDashboardTable(status, startIndex, endIndex).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.datalength = response.length;
          this.allDataCount = this.allDataCount + this.datalength;
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.sort = this.sort;
          this.paginator.pageIndex = 0;
          this.dataSource.paginator = this.paginator;
          this.paginatorLength = this.dashboardTableData ? this.dashboardTableData[status] : undefined;
        }
        this.loader = false;
      }, error: (err) => {
        this.loader = false;
      },
    })
  }

  searchFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;


    if (event.pageIndex === Math.ceil(this.datalength / this.pageSize)) {
      const startIndex = (this.pageIndex - 1) * this.pageSize;
      const endIndex = this.dashboardTableData?.[this.cardStatus];
      this.getDashboardTableData(this.cardStatus, this.allDataCount, this.numOfData);
    }
  }

  formPrefix(id) {
    return ("JKW" + "0".repeat(7 - id.toString().length));
  }

  dateFormat(date) {
    if (!date) {
      return "";
    }
    return moment(date).format("DD/MM/YYYY");
  }

  data(status) {
    this.cardStatus = status;
    this.pageIndex = 0;
    this.getDashboardTableData(this.cardStatus, this.pageIndex, 20);
  }

  excelDownload(){
    this.download = true;
    const details = [];
    this._dashboardService.GetAdminDashboardData(this.cardStatus).subscribe((response)=>{
      this.dashboardData = response;
      for(let i=0;i<this.dashboardData.length;i++){
        let category = this.dashboardData[i].Category;
        let transId = this.dashboardData[i].TransId;
        let Name = this.dashboardData[i].Name;
        this.excelDownloadDetails.push({ Category: category, TransId: transId, DealerName : Name });
      }
      this.getWorkflow(this.excelDownloadDetails);
    },(err)=>{
      console.log("err",err);
      this.download = false;
    });

  }



  getWorkflow(downloadDetails)
  {
    this._dashboardService.GetWorkflowdata(downloadDetails).subscribe({
      next : (response) =>{
        this.download =false;
        saveAs(response, 'Example.xlsx');
      }
    });
  }



  // getColumns(data: any[]): string[] {
  //   const columns = [];
  //   data.forEach(row => {
  //     Object.keys(row).forEach(col => {
  //       if (!columns.includes(col)) {
  //         columns.push(col);
  //       }
  //     });
  //   });
  //   return columns;
  // }
  // this.currentDateTime = this.datepipe.transform(new Date(), "MM/dd/yyyy");

  // formDetails(details,dashboard):AdminDetails{
  //   const adminDetails = new AdminDetails();
  //   if(details != undefined && dashboard != undefined) {
  //     if (details.TransId.toString() == dashboard.TransId.toString()) {
  //       adminDetails.TransID = dashboard.TransId.toString();
  //       adminDetails.DealerName = dashboard.Name.toString();
  //       adminDetails.FormSubmissionDate = this.datepipe.transform(dashboard.CreatedOn, "MM/dd/yyyy");
  //
  //       console.log("details", details)
  //       for (let i = 0; i < details.Workflow.length; i++) {
  //         // console.log('detailss',details.Workflow[i])
  //         let flow = details.Workflow[i];
  //         console.log("flow", flow.Role)
  //         if (flow.Role.toString() != undefined) {
  //           if (flow.Role.toString() == "ASM") {
  //             if (flow.EmailId != null && flow.Name != null) {
  //               adminDetails.ASMName = flow.Name.toString();
  //               adminDetails.ASMEmailId = flow.EmailId.toString();
  //             }
  //
  //           } else if (flow.Role.toString() == "ZH") {
  //             if (flow.EmailId != null && flow.Name != null) {
  //               adminDetails.ZHName = flow.Name.toString();
  //               adminDetails.ZHEmailId = flow.EmailId.toString();
  //             }
  //           } else if (flow.Role.toString() == "NH") {
  //             if (flow.EmailId != null && flow.Name != null) {
  //               adminDetails.NHName = flow.Name.toString();
  //               adminDetails.NHEmailId = flow.EmailId.toString();
  //             }
  //
  //           } else if (flow.Role.toString() == "RA") {
  //             if (flow.EmailId != null && flow.Name != null) {
  //
  //               adminDetails.RAName = flow.Name.toString();
  //               adminDetails.RAEmailId = flow.EmailId.toString();
  //             }
  //
  //           } else {
  //             console.log("flow", flow.Role)
  //           }
  //
  //         }
  //
  //
  //       }
  //       console.log("details", details)
  //       console.log("details.Log", details.Logs)
  //       for (let j = 0; j < details.Logs.length; j++) {
  //         let logData = details.Logs[j];
  //
  //         if (logData.Role == 'ASM' && logData.Action == 'ASM Submitted') {
  //           adminDetails.ASMApprovalDate = this.datepipe.transform(logData.ActionedDate, "MM/dd/yyyy");
  //         } else if (logData.Role == 'ZH' && logData.Action == 'ZH Approved') {
  //           adminDetails.ZHApprovalDate = this.datepipe.transform(logData.ActionedDate, "MM/dd/yyyy");
  //         } else if (logData.Role == 'NH' && logData.Action == 'PWC Approved') {
  //           adminDetails.NHApprovalDate = this.datepipe.transform(logData.ActionedDate, "MM/dd/yyyy");
  //         } else if (logData.Role == 'RA' && logData.Action == 'RA Approved') {
  //           adminDetails.RAApprovalDate = this.datepipe.transform(logData.ActionedDate, "MM/dd/yyyy");
  //         }
  //
  //       }
  //
  //     }
  //   }
  //
  //
  //   return adminDetails;
  //
  // }

  WorkFLowDetails(category,transId) : AdminDashboardDetails{
    let data = new AdminDashboardDetails()
    data.Category = category;
    data.TransId = transId;
    return data;
  }

  exportToCsv(){


    // const csvData = this.convertToCsv(this.userDetail,columns)
    // this.downloadFile(csvData, 'data.csv', 'text/csv');
  }


}
