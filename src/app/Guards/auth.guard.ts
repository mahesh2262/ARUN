import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { snackbarStatus } from "../Enums/notification-snack-bar";
import { CommonService } from "../Services/common.service";
import { LoginService } from "../Services/login.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private _login:LoginService, private _route: Router,private _common:CommonService) {}

  canActivate() {
    if (this._login.isLoggedIn()) {
      return true;
    }
    else {
      this._route.navigate(['/auth/login']);
      this._common.openSnackbar('Please login and try again', snackbarStatus.Danger);
      return false;
    }
  }
}
