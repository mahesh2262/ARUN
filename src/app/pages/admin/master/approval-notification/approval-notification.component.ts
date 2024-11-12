import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import {
  ApprovalNotificationList,
  ApprovalRoleList,
  Roles,
} from "../../../../Models/MasterModel";
import { MasterService } from "../../../../Services/master.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormBuilder } from "@angular/forms";
import { DialogBoxComponent } from "../../../../Dialogs/dialog-box/dialog-box.component";
import { RoleService } from "../../../../Services/role.service";

@Component({
  selector: "ngx-approval-notification",
  templateUrl: "./approval-notification.component.html",
  styleUrls: ["./approval-notification.component.scss"],
})
export class ApprovalNotificationComponent implements OnInit {
  displayedColumns1: string[] = ["Role", "Name", "Mail", "add"];
  approvalNotification: MatTableDataSource<ApprovalNotificationList>;
  roleData: Roles[] = [];
  approvalRoleData: ApprovalRoleList[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _masterService: MasterService,
    private _roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.getApprovalNotification();
  }

  getApprovalNotification() {
    this._masterService.getApprovalNotification().subscribe(
      (response) => {
        if (response) {
          this.roleIdtoName(response);
        }
      },
      (err) => {}
    );
  }

  createApprovalNotification() {
    const action = "Approval";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: "dialog-box",
      autoFocus: false,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe((dialogResponse) => {
      let approvalNotificationData = new ApprovalNotificationList();

      approvalNotificationData.Mail = dialogResponse.Mail;
      approvalNotificationData.Name = dialogResponse.Name;
      approvalNotificationData.RoleId = dialogResponse.Role;

      this._masterService
        .CreateApprovalNotification(approvalNotificationData)
        .subscribe(
          (response) => {
            this.getApprovalNotification();
          },
          (err) => {
            console.log("err", err);
          }
        );
    });
  }

  searchFilter(filterValue) {
    this.approvalNotification.filter = filterValue.trim().toLowerCase();
  }

  editApproval(value, index) {
    const action = "Approval";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
        ID: value.Id,
        Name: value.Name,
        Mail: value.Mail,
        Role: value.RoleId,
      },
      panelClass: "dialog-box",
      autoFocus: false,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe((dialogresponse) => {
      if (dialogresponse) {
        let ApprovalData = new ApprovalNotificationList();
        ApprovalData.Id = value.Id;
        ApprovalData.Mail = dialogresponse.Mail;
        ApprovalData.Name = dialogresponse.Name;
        ApprovalData.RoleId = dialogresponse.Role;
        if (dialogresponse.Role == null) {
          ApprovalData.RoleId = value.RoleId;
        }

        this._masterService.CreateApprovalNotification(ApprovalData).subscribe(
          (response) => {
            this.getApprovalNotification();
          },
          (err) => {
            console.log("err", err);
          }
        );
      }
    });
  }

  roleIdtoName(value) {
    this._roleService.getRoles().subscribe((response) => {
      this.approvalRoleData = [];
      this.roleData = response;
      value.forEach((singleValue) => {
        this.roleData.forEach((single) => {
          if (single.RoleId == singleValue.RoleId) {
            let ApprovalData = new ApprovalRoleList();
            ApprovalData.Id = singleValue.Id;
            ApprovalData.Mail = singleValue.Mail;
            ApprovalData.Name = singleValue.Name;
            ApprovalData.Role = single.Desc;
            ApprovalData.RoleId = singleValue.RoleId;
            this.approvalRoleData.push(ApprovalData);
          }
        });
      });
      this.approvalNotification = new MatTableDataSource(this.approvalRoleData);
      this.approvalNotification.paginator = this.paginator;
      this.approvalNotification._updateChangeSubscription();
    });
  }

  deleteApproval(value, i) {
    const action = "deleteApprovalNotification";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: "delete-dialog",
      autoFocus: false,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);

    dialogRef.afterClosed().subscribe((dialogResponse) => {
      if (dialogResponse == "delete") {
        this._masterService.deleteApprovalDelagation(value.Id).subscribe(
          (response) => {
            this.getApprovalNotification();
          },
          (err) => {
            console.log("err", err);
          }
        );
      }
    });
  }
}
