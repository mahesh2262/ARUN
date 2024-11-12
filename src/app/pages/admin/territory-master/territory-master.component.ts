import { Component, OnInit, ViewChild } from "@angular/core";

import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DialogBoxComponent } from "../../../Dialogs/dialog-box/dialog-box.component";
import { Territory } from "../../../Models/MasterModel";
import { MatTableDataSource } from "@angular/material/table";
import { MasterService } from "../../../Services/master.service";
import { MatPaginator } from "@angular/material/paginator";
import { error } from "console";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import {UserTemplateComponent} from "../../../user-template/user-template.component";
import {TeritoryTemplateComponent} from "../../../teritory-template/teritory-template.component";


@Component({
  selector: "ngx-territory-master",
  templateUrl: "./territory-master.component.html",
  styleUrls: ["./territory-master.component.scss"],
})
export class TerritoryMasterComponent implements OnInit {
  displayedColumns1: string[] = [
    "dChannel",
    "stateCode",
    "stateName",
    "countyCode",
    "countyName",
    "raEmpID",
    "raEmpName",
    "raEmail",
    "raPosition",
    "Action",
  ];
  territorySource: MatTableDataSource<Territory>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  loader: boolean = false;

  constructor(
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _territory: MasterService,
    private _common: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllTerritoryData();
  }

  openConfirmationDialogBox(Action: string, element: any, panel: string): void {
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: Action,
        territoryData: element,
      },
      panelClass: panel,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result == "delete") {
          this._territory.deleteTerritory(element.Id).subscribe({
            next: (res) => {
              this._common.openSnackbar(
                "Territory details deleted successfully",
                snackbarStatus.Success
              );
              this.getAllTerritoryData();
            },
            error: () => {},
          });
        }
      },
      (err) => {}
    );
  }

  addTerritory() {
    const action = "addTerritory";
    const panel = "dialog-box-territory";

    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: panel,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this._territory.addTerritory(result).subscribe({
            next: () => {
              this._common.openSnackbar(
                "Territory details added successfully",
                snackbarStatus.Success
              );
              this.getAllTerritoryData();
            },
            error: () => {},
          });
        }
      },
      (err) => {}
    );
  }

  editTerritory(element) {
    // 'dChannel','stateCode', 'stateName', 'countyCode', 'countyName', 'raEmpID', 'raEmpName', 'raEmail'
    const action = "editTerritory";
    const panel = "dialog-box-territory";

    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
        territoryData: element,
      },
      panelClass: panel,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this._territory.editTerritory(result).subscribe({
            next: () => {
              this._common.openSnackbar(
                "Territory details updated successfully",
                snackbarStatus.Success
              );
              this.getAllTerritoryData();
            },
            error: () => {},
          });
        }
      },
      (err) => {}
    );
  }

  deleteTerritory(element) {
    const action = "deleteTerritory";
    const panel = "delete-dialog";
    this.openConfirmationDialogBox(action, element, panel);
  }
  getAllTerritoryData() {
    this.loader = true;
    this._territory.getTerritory().subscribe({
      next: (response) => {
        this.territorySource = new MatTableDataSource(response);
        this.territorySource.paginator = this.paginator;
        this.loader = false;
      },
      error: (err) => {
        this.loader = false;
        this._common.openSnackbar(err, snackbarStatus.Danger);
      }
    });
  }

  searchFilter(filterValue) {
    this.territorySource.filter = filterValue.trim().toLowerCase();
  }

  downloadUserDetails(){

    const dialogconfig: MatDialogConfig = {
      data: {
        // Action: Action,
      },
      panelClass: "dialog-box",
    };

    const dialogRef = this._dialog.open(TeritoryTemplateComponent, dialogconfig);
    this._dialog.afterAllClosed.subscribe({
      next: () => {},
    });
  }
}
