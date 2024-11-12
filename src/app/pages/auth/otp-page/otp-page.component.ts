import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { CommonService } from "../../../Services/common.service";
import { LoginService } from "../../../Services/login.service";

@Component({
  selector: "ngx-otp-page",
  templateUrl: "./otp-page.component.html",
  styleUrls: ["./otp-page.component.scss"],
})
export class OtpPageComponent implements OnInit {
  otp: string;
  showOtpComponent: boolean = true;

  selectedItem: string;

  transId: number;
  emailList: string[] = [""];
  firmName: string = "";

  constructor(
    public _nav: LoginService,
    private _activatedRote: ActivatedRoute,
    private _common: CommonService,
    private _router: Router
  ) {
    this._nav.islogin(false);
  }

  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
  };

  ngOnInit(): void {
    this._activatedRote.queryParams.subscribe({
      next: (params) => {
        if (params["Id"]) {
          this.transId = params["Id"];
          this.getEmailList();
        }
      },
    });
  }

  getEmailList() {
    this._nav.getEmailsByTransId(this.transId).subscribe({
      next: (res) => {
        this.firmName = res.FirmName;
        this.emailList = res.Emails;
      },
    });
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  onConfigChange() {
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

  requestOtp() {
    if (this.selectedItem != null && this.selectedItem != "") {
      this._nav.getOtp(this.transId, this.selectedItem).subscribe({
        next: () => {
          this._common.openSnackbar(
            "Please check your mail",
            snackbarStatus.Success
          );
        },
        error: (err) => {
          this._common.openSnackbar(err, snackbarStatus.Danger);
        },
      });
    } else {
      this._common.openSnackbar(
        "Please select a mail Id",
        snackbarStatus.Warning
      );
    }
  }

  submitOTP() {
    this._nav.authenticateCustomer(parseInt(this.otp), this.transId).subscribe({
      next: (res) => {
        res.Token = "Customer Token";
        localStorage.setItem("userDetails", JSON.stringify(res));
        localStorage.setItem("transID", this.transId.toString());
        this._nav.islogin(true);
        this._router.navigate(["/onboarding/approval"]);
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }
}
