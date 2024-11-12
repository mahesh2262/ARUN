import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DialogBoxComponent } from "../../../Dialogs/dialog-box/dialog-box.component";
import { ChangePassword } from "../../../Models/authModel";
import { LoginService } from "../../../Services/login.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";

@Component({
  selector: "ngx-profile-info",
  templateUrl: "./profile-info.component.html",
  styleUrls: ["./profile-info.component.scss"],
})
export class ProfileInfoComponent implements OnInit {
  profileInformationForm: FormGroup;
  userData: any;
  Role: string;
  userName: string;
  empId: string;

  constructor(
    public _dialog: MatDialog,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initializingProfilelInfo();
    const users = localStorage.getItem("userDetails");
    if (users) {
      this.userData = JSON.parse(users);

      this.patchingValuesToForm();

      this.Role = this.userData.Role;
      this.empId = this.userData.EmpId;
      this.userName = this.userData.DisplayName;
    }
  }

  changePassword() {
    const action = "changePassword";
    const panel = "changePassword";
    const value = "role";
    this.openConfirmationDialogBox(action, value, panel);
  }

  openConfirmationDialogBox(Action: string, value: any, panel: string): void {
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: Action,
        name: value.Name,
        mobile: value.Mobile,
        emailId: value.emailId,
        role: value,
      },
      panelClass: panel,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          let changePwdPayload = res as ChangePassword;
          changePwdPayload.EmpId = this.empId;
          this._loginService.changePassword(changePwdPayload).subscribe({
            next: () => {
              localStorage.clear();
              this._commonService.openSnackbar(
                "Password updated successfully, Please login again.",
                snackbarStatus.Success,
                2500
              );
              this._router.navigate(["auth/login"]);
            },
            error: (err) => {},
          });
        }
      },
      error: (err) => {},
    });
  }

  cancel() {
    this._router.navigate(["/pages/dashboard"]);
  }

  updateProfile() {}

  initializingProfilelInfo() {
    this.profileInformationForm = this._formBuilder.group({
      DisplayName: [""],
      Email: [""],
      EmpId: [""],
      FirstName: [""],
      LastName: [""],
      MiddleName: [""],
      Mobile: [""],
      PositionId: [""],
      Role: [""],
    });
  }

  patchingValuesToForm() {
    this.profileInformationForm.patchValue(this.userData);
  }
}
