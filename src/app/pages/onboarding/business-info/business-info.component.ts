import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { BankInfoComponent } from "../bank-info/bank-info.component";
import { BusinessInfo, SalesTarget } from "../../../Models/onboardingModel";
import { BusinessInfoService } from "../../../Services/business-info.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { CustomerLogService } from "../../../Services/customer-log.service";
import { isZeroValidation } from "../../../Customize/Validators/zeroValidation";
import { isnonZeroValidation } from "../../../Customize/Validators/zeroValidation";

@Component({
  selector: "ngx-business-info",
  templateUrl: "./business-info.component.html",
  styleUrls: ["./business-info.component.scss"],
})
export class BusinessInfoComponent implements OnInit {
  products = new FormControl();
  productlist: any[] = [];
  SalesTarget: FormGroup;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["Product"];
  userData: any;
  readable: boolean = false;
  businessInformationForm: FormGroup;
  saveBusinesInformation: boolean = false;
  ApiData: any;
  transId: number;
  Id: number;
  editclick: boolean;
  role: string;
  status: string;
  show: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _businessInformation: BusinessInfoService,
    private _commonService: CommonService,
    private _customerLog: CustomerLogService
  ) {}
  @Output() event = new EventEmitter<boolean>();
  @Output() nextTab = new EventEmitter<string>();

  ngOnInit(): void {
    const users = localStorage.getItem("userDetails");
    const transId = localStorage.getItem("transID");
    this.status = localStorage.getItem("status");

    this.transId = JSON.parse(transId);
    if (users) {
      this.userData = JSON.parse(users);
      this.role = this.userData.Role;
      if (this.role == "DH" || this.role == "NH") {
        this.readable = true;
      }
    }

    this.initializingBusinessForm();
    if (this._commonService.accessShowHide(this.status, this.role)) {
      this.disableForm();
      this.show = true;
    }

    if (this.role == "ASM" && this.show) {
      this.enableForm();
    } else {
      this.disableForm();
    }
    this.percentageCalculationonRetailSale();
    this.getbusinessInformation();
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.products.setValue(this.productlist);
    } else {
      this.products.setValue([]);
    }
  }

  isChecked(): boolean {
    return (
      this.products.value &&
      this.productlist.length &&
      this.products.value.length === this.productlist.length
    );
  }

  addBtnClicked(): void {
    const EDATA = this.dataSource.data;
    this.products.value.forEach((pd) => {
      var tmp = {};
      tmp["Product"] = pd;
      var row = this._formBuilder.group({
        Product: [pd],
      });
      for (let id = 1; id < this.displayedColumns.length; id++) {
        tmp[this.displayedColumns[id]] = "";
        row.addControl("Product", new FormControl());
      }
      tmp["Action"] = "";
      EDATA.push(tmp);
      (this.SalesTarget.get("Data") as FormArray).push(row);
    });
    this.dataSource = new MatTableDataSource(EDATA);
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
        k == 47
      );
    } else if (str == "Number") {
      return k >= 48 && k <= 57;
    } else if (str == "NumberWithDot") {
      return (k >= 48 && k <= 57) || k == 56;
    } else if (str == "A&N") {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57)
      );
    }
  }

  remove(ind): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: "Delete",
        Catagory: this.dataSource.data[ind]["Product"],
      },
      panelClass: "confirmation-dialog",
    };
    const dialogRef = this.dialog.open(BankInfoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        (this.SalesTarget.get("Data") as FormArray).removeAt(ind);
        this.dataSource.data.splice(ind, 1);
        this.dataSource._updateChangeSubscription();
        this.products.value.splice(ind, 1);
        this.products.patchValue(this.products.value);
      }
    });
  }

  initializingBusinessForm() {
    this.businessInformationForm = this._formBuilder.group({
      Turnover1: [0, [Validators.required, isnonZeroValidation]],
      Turnover2: [0, [Validators.required, isnonZeroValidation]],
      Turnover3: [0, [Validators.required, isnonZeroValidation]],
      StorageCapacity: [null, [Validators.required, isZeroValidation]],
      CapitalToBeInvest: [null, [Validators.required, isZeroValidation]],
      VehiclesOwned: [null, [Validators.required, isnonZeroValidation]],
      SalesWholesale: [null, [Validators.required]],
      SalesRetail: [0],
      NoOfRetailsers: [""],
    });
  }

  saveBusinesInfo() {
    this.saveBusinesInformation = true;
    if (!this.businessInformationForm.valid) {
      this.businessInformationForm.markAllAsTouched();
      this._commonService.openSnackbar(
        "Make sure you entered all the values",
        snackbarStatus.Danger
      );
      return;
    } else {
      let businessInformation = new BusinessInfo();
      businessInformation = this.formBusinessInfoValues(
        this.businessInformationForm.value
      );

      this._businessInformation
        .createBusinessInfo(businessInformation)
        .subscribe({
          next: (res) => {
            if (
              this.userData.Role != "ASM" &&
              this.userData.Role != "Customer"
            ) {
              this._customerLog.createLogDetails(
                this.userData,
                "updated business Information"
              );
            }
            this._commonService.openSnackbar(
              "Business information saved successfully",
              snackbarStatus.Success,
              2000
            );
            this.nextTab.emit("security_deposit");
            this.event.emit(this.businessInformationForm.valid);
            this.disableForm();
          },
          error: (err) => {
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          },
        });
    }
  }

  formBusinessInfoValues(value): BusinessInfo {
    let businessInfo = new BusinessInfo();
    businessInfo.Id = this.Id;
    businessInfo.TransId = this.transId;
    businessInfo.SalesAndTarget = [];
    businessInfo.Turnover1 = value.Turnover1.toString();
    businessInfo.Turnover2 = value.Turnover2.toString();
    businessInfo.Turnover3 = value.Turnover3.toString();
    businessInfo.StorageCapacity = value.StorageCapacity.toString();
    businessInfo.CapitalToBeInvest = value.CapitalToBeInvest.toString();
    businessInfo.VehiclesOwned = parseInt(value.VehiclesOwned);
    businessInfo.SalesWholesale = parseInt(value.SalesWholesale);
    businessInfo.SalesRetail = parseInt(value.SalesRetail);
    businessInfo.NoOfRetailsers = value.NoOfRetailsers
      ? value.NoOfRetailsers
      : 0;
    return businessInfo;
  }

  salestargets(): SalesTarget {
    let sales = new SalesTarget();
    sales.BusinessId = 0;
    sales.Month = "";
    sales.Product = "";
    sales.Value = 0;
    return sales;
  }

  getbusinessInformation() {
    this._businessInformation.getBankInfoByTransId(this.transId).subscribe({
      next: (res) => {
        if (res) {
          this.Id = res.Id;
          this.businessInformationForm.patchValue(res);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err.message, snackbarStatus.Danger);
      },
    });
  }

  percentageCalculationonRetailSale() {
    this.businessInformationForm.get("SalesWholesale").valueChanges.subscribe({
      next: (res) => {
        if (res > 100) {
          this.businessInformationForm.get("SalesWholesale").patchValue(100);
          this.businessInformationForm.get("SalesRetail").setValue(0);
        } else {
          this.businessInformationForm.get("SalesRetail").setValue(100 - res);
        }
      },
    });
  }

  editClicked() {
    this.enableForm();
  }
  enableForm() {
    this.editclick = false;
    this.businessInformationForm.enable();
  }
  disableForm() {
    this.editclick = true;
    this.businessInformationForm.disable();
  }
  cancel() {
    this.disableForm();
    this.getbusinessInformation();
  }
}
