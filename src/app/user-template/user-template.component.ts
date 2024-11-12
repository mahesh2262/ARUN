import { Component, OnInit } from '@angular/core';
import {DatePipe} from "@angular/common";
import {MatDialogRef} from "@angular/material/dialog";
import {MasterService} from "../Services/master.service";
import {RoleService} from "../Services/role.service";
import {Roles, User, UserDetailsTemplate} from "../Models/MasterModel";
import {DomSanitizer} from "@angular/platform-browser";
import * as XLSX from 'xlsx';

@Component({
  selector: 'ngx-user-template',
  templateUrl: './user-template.component.html',
  styleUrls: ['./user-template.component.scss']
})
export class UserTemplateComponent implements OnInit {

  usersData: any[] = [];
  currentDateTime: any;
  RolesData: Roles[] = [];
  userDetail: UserDetailsTemplate[] = [];
  fileUrl;
  constructor(

    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<UserTemplateComponent>,
    public _users: MasterService,
    private _roleService: RoleService,
    private sanitizer: DomSanitizer,
  ) {

    this.currentDateTime = this.datepipe.transform(new Date(), 'MM/dd/yyyy');
  }

  ngOnInit(): void {

    this.getUsersDetails();
    this.getRoles();
  }

  print(id) {
    // var content = document.getElementById(id).innerHTML;
    // var a = window.open('', '', 'height=500, width=500');
    // a.document.write(content);
    // a.document.close();
    // a.print();
    // a.close();
    // this.dialogRef.close();

    this.exportToCsv();
  }

  exportToCsv(){

    const data = this.userDetail;
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

  //
  // getcoloum(data: any[]): string[]{
  //   const columns =[];
  //   this.userDetail.forEach(row=>{
  //     Object.keys(row).forEach(col=>{
  //       if(!columns.includes(col)){
  //         columns.push(col)
  //       }
  //     })
  //   });
  //   return columns;
  // }

  // convertToCsv(data: any[], columns: string[]): string {
  //   let csv = '';
  //   csv += columns.join(',') + '\n';
  //   data.forEach(row => {
  //     const values = [];
  //     columns.forEach(col => {
  //       values.push(row[col] || '');
  //     });
  //     csv += values.join(',') + '\n';
  //   });
  //   return csv;
  // }

  // downloadFile(data: string, filename: string, type: string) {
  //   const blob = new Blob([data], { type: type });
  //   this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  //   console.log("fileUrl",this.fileUrl)
  //   /*if (window.navigator.msSaveOrOpenBlob) {
  //     window.navigator.msSaveBlob(blob, filename);
  //   } else {
  //     const link = document.createElement('a');
  //     link.setAttribute('href', URL.createObjectURL(blob));
  //     link.setAttribute('download', filename);
  //     link.style.visibility = 'hidden';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }*/
  // }



  getUsersDetails() {
    this._users.getAllUsers().subscribe(
      (response) => {
        this.usersData = response;

        const Details = [];
        for(let i=0; i<this.usersData.length; i++){
          Details[i] = this.UserDetails(this.usersData[i]);

        }
        this.userDetail = Details;
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  UserDetails(value): UserDetailsTemplate {
    const Uservalue  = new UserDetailsTemplate();
    Uservalue.EmployeeId = value.EmpId;
    Uservalue.EmailId = value.Email;
    Uservalue.MobileNo = value.Mobile;
    Uservalue.PositionId = value.PositionId;
    let executiveFullName = "";

    if( value.FirstName != null){
      executiveFullName = value.FirstName;
    }
    if( value.MiddleName != null){
      executiveFullName += value.MiddleName
    }
    if( value.LastName != null){
      executiveFullName += value.LastName
    }
    Uservalue.ExecutiveName = executiveFullName;
    Uservalue.UserAccountStatus = value.IsActive;
    Uservalue.ManagerPositionId = value. ManagerId;
    // role
    this.RolesData.forEach((Roles)=>{
      if(Roles.RoleId == value.RoleId ){
        Uservalue.Role = Roles.Desc;
      }


    })

    this.usersData.forEach((manager)=>{
      if(manager.PositionId == value.ManagerId){
        let managerFullName =""
        if( manager.FirstName != null){
          managerFullName = manager.FirstName
        }
        // console.log("middle",manager.MiddleName)
        if( manager.MiddleName != null  ){
          managerFullName += manager.MiddleName
        }

        if( manager.LastName != null){
          managerFullName += manager.LastName
        }

        Uservalue.ManagerName = managerFullName;
      }
    })
    return Uservalue;
  }

  getRoles() {
    this._roleService.getRoles().subscribe(
      (response) => {
        this.RolesData = response;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

}
