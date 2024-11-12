import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { snackbarStatus } from "../Enums/notification-snack-bar";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  mandatorySubject: Subject<boolean> = new Subject<boolean>();
  constructor(private _snackbar: MatSnackBar) {}

  // Opens Snackbar notification
  openSnackbar(
    message: string,
    status: snackbarStatus,
    duration: number = 2500
  ) {
    let config = {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:
        status === snackbarStatus.Success
          ? "success"
          : status === snackbarStatus.Danger
          ? "danger"
          : status === snackbarStatus.Warning
          ? "warning"
          : "info",
    };
    this._snackbar.open(message, "", config);
  }

  accessShowHide(status, role): boolean {
    if (role == "NH") {
      return false;
    }

    if (
      role == "ASM" &&
      status.toLowerCase() != "initiated" &&
      status.toLowerCase() != "draft" &&
      status.toLowerCase() != "rejected"
    ) {
      return false;
    }

    if (role != "ASM" && !status.includes(role)) {
      return false;
    }
    return true;
  }
}
