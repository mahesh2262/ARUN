import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { validateConfirmPassword } from "../../../Customize/Validators/confirm-password";
import { LoginService } from "../../../Services/login.service";
import { ForgotPassword } from "../../../Models/authModel";

@Component({
  selector: "ngx-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(
    public _dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private _formbuilder: FormBuilder,
    private _common: CommonService,
    private _auth: LoginService
  ) {
    _dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializingForgotForm();
  }

  sendOTP() {
    if (this.forgotPasswordForm.get("emailId").valid) {      
      this._auth
        .getOTPforForgotPassword(this.forgotPasswordForm.get("emailId").value)
        .subscribe({
          next: (res) => {},
          error: (error) => {
            this._common.openSnackbar(error, snackbarStatus.Danger);
          },
        });
    } else {
      this._common.openSnackbar(
        "Please enter your email address",
        snackbarStatus.Danger
      );
    }
  }

  value(action) {
    if (
      action == "add" &&
      this.forgotPasswordForm.valid &&
      this.validatingForm()
    ) {
      let forgotPass = new ForgotPassword();
      forgotPass.EmailAddress = this.forgotPasswordForm.get("emailId").value;
      forgotPass.EmpId = "";
      forgotPass.NewPassword = this.forgotPasswordForm.get("newPassword").value;
      forgotPass.Token = this.forgotPasswordForm.get("otp").value;
      this._auth.updateNewPassword(forgotPass).subscribe({
        next: (data) => {
          
        },
        error: (err) => { }
      });
      this._dialogRef.close(this.forgotPasswordForm.value);
    } else if (action == "close") {
      this._dialogRef.close(false);
    }
  }

  validatingForm() {
    if (
      !this.forgotPasswordForm.get("otp").valid ||
      this.forgotPasswordForm.get("otp").value.length != 6
    ) {
      this._common.openSnackbar("Enter the valid OTP", snackbarStatus.Danger);
      return false;
    } else if (
      !validateConfirmPassword(
        this.forgotPasswordForm.get("newPassword"),
        this.forgotPasswordForm.get("confirmPassword")
      )
    ) {
      this._common.openSnackbar("Password Mismatch", snackbarStatus.Danger);
      return false;
    } else {
      return true;
    }
  }

  initializingForgotForm() {
    this.forgotPasswordForm = this._formbuilder.group({
      emailId: ["", [Validators.required]],
      otp: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
  }
}
