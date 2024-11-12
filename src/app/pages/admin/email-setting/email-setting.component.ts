import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ApprovalNotificationList, EmailSetting} from "../../../Models/MasterModel";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogBoxComponent} from "../../../Dialogs/dialog-box/dialog-box.component";
import {FormBuilder} from "@angular/forms";
import {MasterService} from "../../../Services/master.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'ngx-email-setting',
  templateUrl: './email-setting.component.html',
  styleUrls: ['./email-setting.component.scss']
})
export class EmailSettingComponent implements OnInit {

  displayedColumns1: string[] = [ "Name", "Mail", "add"];
  emailNotification: MatTableDataSource<EmailSetting>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor( public _dialog: MatDialog,
               private _formBuilder: FormBuilder,
               private _masterService: MasterService) { }

  ngOnInit(): void {
    this.getEmailSetting()
  }

  getEmailSetting() {
    this._masterService.getEmail().subscribe(
      (response) => {
        if (response) {
          this.emailNotification = new MatTableDataSource<EmailSetting>(response)
          this.emailNotification.paginator = this.paginator;
          this.emailNotification._updateChangeSubscription();
        }
      },
      (err) => {}
    );
  }

  editMail(value,index){

    const action = "Email";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
        Name: value.Name,
        Mail: value.Mail,
      },
      panelClass: "dialog-box",
      autoFocus: false,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe((dialogresponse) => {
      if (dialogresponse) {
        let email = new EmailSetting();
        email.Email = dialogresponse.Mail;
        email.Name = dialogresponse.Name;


        this._masterService.CreateEmail(email).subscribe(
          (response) => {
            this.getEmailSetting();
          },
          (err) => {
            console.log("err", err);
          }
        );
      }
    });

  }

  deleteMail(value,index){

  }

  createEmail(){

    const action = "Email";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: "dialog-box",
      autoFocus: false,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe((dialogResponse) => {
      let mailData = new EmailSetting();

      mailData.Email = dialogResponse.Mail;
      mailData.Name = dialogResponse.Name;
      // console.log("mailData",mailData)

      this._masterService
        .CreateEmail(mailData)
        .subscribe(
          (response) => {
            // this.();
          },
          (err) => {
            console.log("err", err);
          }
        );
    });
  }
}
