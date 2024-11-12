/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  MENU_ITEMS,
  ADMIN_MENU_ITEMS,
  INITIATOR_MENU_ITEMS,
} from "./Pages/pages-menu";
import { NbMenuService, NbMenuItem } from "@nebular/theme";
import { BnNgIdleService } from "bn-ng-idle";
import { CommonService } from "./Services/common.service";
import { snackbarStatus } from "./Enums/notification-snack-bar";

@Component({
  selector: "ngx-app",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  role: string;
  userData: any;
  menu = MENU_ITEMS;
  adminMenuItem = ADMIN_MENU_ITEMS;
  initiatorMenuItem = INITIATOR_MENU_ITEMS;

  constructor(
    private _nbMenuService: NbMenuService,
    private _router: Router,
    private _bnIdle: BnNgIdleService,
    private _common: CommonService
  ) {
    this.adminAccess();
    this._router.events.subscribe({
      next: (ev) => {
        if (ev instanceof NavigationEnd) {
          this.adminAccess();
        }
      },
    });

    this._bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this._common.openSnackbar(
          "Session Expired due to inactivity, Please login!",
          snackbarStatus.Info
        );
        localStorage.clear();
        this._router.navigate(['auth/login']);
      }
    });
  }

  adminAccess() {
    const userdata = localStorage.getItem("userDetails");

    if (userdata == undefined || userdata == null) {
      this.userData = null;
    } else {
      this.userData = JSON.parse(userdata);
      this.role = this.userData.Role;
    }
  }
}
