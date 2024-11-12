import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {snackbarStatus} from "../Enums/notification-snack-bar";
import {MasterService} from "../Services/master.service";
import {DatePipe} from "@angular/common";
import {MatDialogRef} from "@angular/material/dialog";
import * as XLSX from "xlsx";

@Component({
  selector: 'ngx-teritory-template',
  templateUrl: './teritory-template.component.html',
  styleUrls: ['./teritory-template.component.scss']
})
export class TeritoryTemplateComponent implements OnInit {
  currentDateTime: any;
  teritory : any[]=[];
  constructor( private _territory: MasterService ,  public datepipe: DatePipe,
               public dialogRef: MatDialogRef<TeritoryTemplateComponent>) {

    this.currentDateTime = this.datepipe.transform(new Date(), 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.getAllTerritoryData();
  }

  getAllTerritoryData() {
    // this.loader = true;
    this._territory.getTerritory().subscribe({
      next: (response) => {
      // console.log("res",response)
        this.teritory = response;
      },
      error: (err) => {
      }
    });
  }

  print(id) {
    this.exportToCsv();
  }


  exportToCsv(){

    const data = this.teritory;
    const columns = this.getColumns(data);

    const worksheet = XLSX.utils.json_to_sheet(data, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
    // const csvData = this.convertToCsv(this.userDetail,columns)
    // this.downloadFile(csvData, 'data.csv', 'text/csv');
  }

  getColumns(data: any[]): string[] {
    const columns = [];
    data.forEach(row => {
      Object.keys(row).forEach(col => {
        if (!columns.includes(col)) {
          columns.push(col);
        }
      });
    });
    return columns;
  }
}
