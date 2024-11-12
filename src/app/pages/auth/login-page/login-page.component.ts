import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { AppConfigService } from "../../../Services/app-config.service";
import { LoginService } from "../../../Services/login.service";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from "@angular/material/dialog";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoginDetails } from "../../../Models/authModel";
import { HttpErrorResponse } from "@angular/common/http";

export interface UserDetails {
  userId: string;
  password: string;
  mailId: string;
  firstName: string;
  lastName: string;
  role: string;
  userName: string;
}

const dummyData: UserDetails[] = [
  {
    userId: "111",
    password: "Exalca@123",
    mailId: "111@jkc.com",
    firstName: "user",
    lastName: "1",
    role: "ASM",
    userName: "user1",
  },
  {
    userId: "222",
    password: "Exalca@123",
    mailId: "222@jkc.com",
    firstName: "user",
    lastName: "2",
    role: "ZH",
    userName: "user2",
  },
  {
    userId: "333",
    password: "Exalca@123",
    mailId: "333@jkc.com",
    firstName: "user",
    lastName: "3",
    role: "P-WC",
    userName: "user3",
  },
  {
    userId: "444",
    password: "Exalca@123",
    mailId: "444@jkc.com",
    firstName: "user",
    lastName: "4",
    role: "SH",
    userName: "user4",
  },
  {
    userId: "555",
    password: "Exalca@123",
    mailId: "555@jkc.com",
    firstName: "user",
    lastName: "5",
    role: "DH",
    userName: "user5",
  },
  {
    userId: "666",
    password: "Exalca@123",
    mailId: "666@jkc.com",
    firstName: "user",
    lastName: "6",
    role: "SH",
    userName: "user6",
  },
];
@Component({
  selector: "ngx-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  loginForm = new FormGroup({
    loginuser: new FormControl("", [Validators.required]),
    loginpassword: new FormControl("", [Validators.required]),
  });
  userDetail = dummyData;
  Islogin: boolean = false;
  isReadonly: boolean = false;
  role: string;
  users: any;

  constructor(
    public _login: LoginService,
    private _router: Router,
    public dialog: MatDialog,
    private _snackbar: MatSnackBar
  ) {
    // this._login.islogin(false);
  }

  ngOnInit(): void {
    this.Islogin = false;
    const userdata = localStorage.getItem("userDetails");
    if (userdata != undefined) {
      // this._login.islogin(true);
      this.users = JSON.parse(userdata);
      if (this.users.Role != "Admin") {
        this._router.navigate(["/pages/dashboard"]);
      } else if (this.users.Role == "Admin") {
        this._router.navigate(["/admin/dashboard"]);
      } else {
        // this._login.islogin(false);
      }
    }
  }

  forgotPassword() {
    const action = "forgotPassword";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: "forgotPassword-dialog",
    };
    const dialogRef = this.dialog.open(ForgotPasswordComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (result) => {},
      (err) => {}
    );
  }

  logIn() {
    // let UserId = this.loginForm.get("loginuser").value;
    // let Password = this.loginForm.get("loginpassword").value;
    if (this.loginForm.valid) {
      let loginDetails = new LoginDetails();
      loginDetails.UserName = this.loginForm.get("loginuser").value;
      loginDetails.Password = this.loginForm.get("loginpassword").value;
      this._login.authUser(loginDetails).subscribe({
        next: (res) => {
          localStorage.setItem("userDetails", JSON.stringify(res));
          if (res.Role != "Admin") {
            this._router.navigate(["/pages/dashboard"]);
          } else if (res.Role == "Admin") {
            this._router.navigate(["/admin/dashboard"]);
          }
        },
        error: (err) => {
          this._snackbar.open(err, "", {
            duration: 2000,
            verticalPosition: "top",
            horizontalPosition: "right",
            panelClass: ["snackBarPassword"],
          });
        },
      });
    }

  }

  saveSessionStorage(userData) {
    localStorage.setItem("userDetails", JSON.stringify(userData));
  }
}
