import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { LoginService } from "../../../Services/login.service";

@Component({
  selector: "ngx-one-column-layout",
  styleUrls: ["./one-column.layout.scss"],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed *ngIf="isLogin">
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar
        *ngIf="isLogin && this.role != 'Customer'"
        class="menu-sidebar"
        tag="menu-sidebar"
        responsive
      >
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <!--<nb-layout-footer *ngIf="isLogin" fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>-->
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements OnInit {
  isLogin: boolean = true;
  users: any;
  role: string = "";
  hidetoolbar: boolean;

  constructor(private _router: Router, private _nav: LoginService) {}
  ngOnInit(): void {
    this.readUserData();
    // this._nav.changeEmitted$.subscribe((value) => {
    //   this.isLogin = value;
    //   this.readUserData();
    // });

    this._router.events.subscribe({
      next: (res) => {
        if (res instanceof NavigationEnd) {
          this.readUserData();
          if (
            res.url.includes("login") ||
            res.url.includes("otp") ||
            res.url.includes("forgot") ||
            res.url == "/" ||
            res.url.includes("error")
          ) {
            this.isLogin = false;
          } else {
            this.isLogin = true;
          }
        }
      },
    });
  }

  readUserData() {
    const userdata = localStorage.getItem("userDetails");

    if (userdata == undefined) {
      this.isLogin = false;
      this.users = null;
    } else {
      this.users = JSON.parse(userdata);
      this.role = this.users.Role;
    }
  }
}
