import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { AuthResponse } from "../../../Models/authModel";
import { MasterService } from "../../../Services/master.service";
import { RoleService } from "../../../Services/role.service";
import { Roles, User } from "../../../Models/MasterModel";
import { UserService } from "../../../Services/user.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonService } from "../../../Services/common.service";
import { Router } from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { UserTemplateComponent } from "../../../user-template/user-template.component";


@Component({
  selector: "ngx-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  categorylist = [];
  usersData: any[] = [];
  userDataFilter: any[] = [];

  title: string = "CREATE AN USER";
  userInformationForm: FormGroup;
  EmpId: number;
  FirstName: string;
  Email: string;
  Mobile: number;
  RoleId: string;
  PositionId: string;
  ManagerId: string;
  buttonAction: boolean;
  LastName: string;
  MiddleName: string;
  RolesData: Roles[] = [];
  disableEmpId: boolean = false;
  enableEmpId: boolean = true;
  fieldValid: boolean = false;
  isClicked: boolean = false;
  isUserActive: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    public _users: MasterService,
    private _roleService: RoleService,
    private _userInfoService: UserService,
    private _commonService: CommonService,
    private _router: Router,
    public _dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.buttonAction = true;
    this.getUsersDetails();
    this.initializeUserDetails();
    this.getRoles();
  }

  addUser() {
    this.isUserActive = true;
    this.userInformationForm.reset();
    this.userInformationForm.get("EmpId").reset();
    this.isClicked = false;
    this.buttonAction = true;
    this.fieldValid = false;
    this.title = "CREATE AN USER";
  }

  setUserDetails(value) {
    this.isUserActive = value.IsActive;
    this.buttonAction = false;
    this.isClicked = true;
    this.title = "UPDATE AN USER";
    this.userInformationForm.patchValue(value);

    // this.EmpId = value.EmpId;
    // this.ManagerId = value.ManagerId;
    // this.Mobile = value.Mobile;
    // this.RoleId = value.RoleId;
    // this.PositionId = value.PositionId;
    // this.FirstName = value.FirstName;
    // this.Email = value.Email;
    // this.LastName = value.LastName;
    // this.MiddleName = value.MiddleName;
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

  cancel() {}

  updateUserDetails(action) {
    if (action == "add") {
      if (this.userInformationForm.valid) {
        // this.fieldValid = true;
        // if (this.userInformationForm.valid) {

        let userInfo = new User();
        userInfo = this.userInformationForm.value;
        userInfo.IsActive = this.isUserActive;
        // userInfo.Mobile = this.userInformationForm.get("Mobile").value.toString();
        this._userInfoService.createUsersDetails(userInfo).subscribe({
          next: (res) => {
            this.getUsersDetails();
            this.userInformationForm.reset();
            this._commonService.openSnackbar(
              "Saved successfully",
              snackbarStatus.Success,
              2000
            );
            // this.getUsersDetails();
          },
          error: (err) => {
            this._commonService.openSnackbar(err, snackbarStatus.Danger, 2000);
          },
        });
      } else {
        this.userInformationForm.markAllAsTouched();
        this._commonService.openSnackbar(
          "Please fill the required details",
          snackbarStatus.Danger,
          2000
        );
      }
    } else {
      // this.disableEmpId = true;
      if (this.userInformationForm.valid) {
        let userInfo = new User();
        userInfo = this.userInformationForm.value;
        userInfo.IsActive = this.isUserActive;
        // userInfo.Mobile = this.userInformationForm.get("Mobile").value.toString();
        this._userInfoService.updateUsersDetails(userInfo).subscribe({
          next: (res) => {
            this.getUsersDetails();
            this._commonService.openSnackbar(
              "Updated successfully",
              snackbarStatus.Success,
              2000
            );
            // this.getUsersDetails();
          },
          error: (err) => {
            this.userInformationForm.markAllAsTouched();
            this._commonService.openSnackbar(err, snackbarStatus.Danger, 2000);
          },
        });
      } else {
        this.userInformationForm.markAllAsTouched();
        this._commonService.openSnackbar(
          "Please fill the required details",
          snackbarStatus.Danger,
          2000
        );
      }
    }
  }

  getUsersDetails() {
    this._users.getAllUsers().subscribe(
      (response) => {
        this.usersData = response;
        this.userDataFilter = response;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  initializeUserDetails() {
    this.userInformationForm = this._formBuilder.group({
      EmpId: ["", Validators.required],
      FirstName: ["", Validators.required],
      Email: ["", Validators.required],
      Mobile: [
        "",
        [Validators.required, Validators.pattern("^[6-9]{1}[0-9]{9}$")],
      ],
      RoleId: ["", Validators.required],
      PositionId: ["", Validators.required],
      ManagerId: ["", Validators.required],
      LastName: [""],
      MiddleName: [""],
    });
  }

  toggle(event) {
    this.isUserActive = event.target.checked;
  }

  searchFilter(filterValue) {
    this.userDataFilter = [];
    this.userDataFilter = this.usersData.filter(function (x) {
      return (
        x.FirstName?.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
        x.MiddleName?.toLowerCase().includes(
          filterValue.trim().toLowerCase() ||
            x.LastName?.toLowerCase().includes(
              filterValue.trim().toLowerCase()
            ) ||
            x.EmpId?.toLowerCase().includes(filterValue.trim().toLowerCase())
        )
      );
    });
    // this.usersData.filter = filterValue.trim().toLowerCase();
  }

  KeyPressValidation(event, str): boolean {
    const k = event.which ? event.which : event.keyCode;
    if (str == "Name") {
      return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32;
    } else if (str == "Address") {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57) ||
        k == 44 ||
        k == 45 ||
        k == 47 ||
        k == 35
      );
    } else if (str == "Number") {
      return k >= 48 && k <= 57;
    }
  }

  downloadUserDetails(){
    const dialogconfig: MatDialogConfig = {
      data: {
        // Action: Action,
      },
      panelClass: "dialog-box",
    };

    const dialogRef = this._dialog.open(UserTemplateComponent, dialogconfig);
    this._dialog.afterAllClosed.subscribe({
      next: () => {},
    });
  }
}
