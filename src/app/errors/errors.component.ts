import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "ngx-errors",
  templateUrl: "./errors.component.html",
  styleUrls: ["./errors.component.scss"],
})
export class ErrorsComponent implements OnInit {
  unAutharized: boolean = false;
  internalServer: boolean = false;
  notFound: boolean = false;
  constructor(
    private _activatedRouter: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._router.events.subscribe({
      next: (ev) => {
      },
    });

    this._activatedRouter.queryParams.subscribe({
      next: (res) => {
        this.unAutharized,
          this.internalServer,
          (this.notFound = false),
          false,
          false;
        if (res.Status == 404) {
          this.notFound = true;
        }
        if (res.Status == 500) {
          this.internalServer = true;
        }
        if (res.Status == 401) {
          this.unAutharized = true;
        }
      },
    });
  }

  goBack() {
    window.history.back();
  }
}
