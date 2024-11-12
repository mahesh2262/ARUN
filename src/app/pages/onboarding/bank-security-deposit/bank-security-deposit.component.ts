import { Component, EventEmitter, OnInit, Output } from "@angular/core";

import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from "@angular/material/dialog";
import {
  FormGroup,
  FormBuilder,
  Validators,
  MaxLengthValidator,
} from "@angular/forms";
import { DialogBoxComponent } from "../../../Dialogs/dialog-box/dialog-box.component";
import { MatTableDataSource } from "@angular/material/table";
import { SecurityDepositService } from "../../../Services/security-deposit.service";
import { SecurityDeposits } from "../../../Models/onboardingModel";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import * as moment from "moment";
import { CustomerLogService } from "../../../Services/customer-log.service";
import { ischequeValidation } from "../../../Customize/Validators/zeroValidation";
import { MasterService } from "../../../Services/master.service";
import { EmitterService } from "../../../Services/emitter.service";
import { AppConfigService } from "../../../Services/app-config.service";
import {forkJoin} from "rxjs";
import {State, TypeOfCategory} from "../../../Models/MasterModel";

// export interface bankSecurityDeposit {

//   DepositType: string;
//   BankNumber: number;
//   Date: string;
//   Amount: number;
//   BankName: string;
//   add: string;
// }

@Component({
  selector: "ngx-bank-security-deposit",
  templateUrl: "./bank-security-deposit.component.html",
  styleUrls: ["./bank-security-deposit.component.scss"],
})
export class BankSecurityDepositComponent implements OnInit {
  formatdate = "dd/MM/yyyy";
  addSecurityDepositForm: FormGroup;
  displayedColoumnsOnSecurityDeposit: string[] = [
    "DepositType",
    "BankName",
    "Date",
    "Amount",
    "BankNumber",
    "AccNumber",
    "PaymentToJKCL",
    "UTR",
    "GLAccount",
    "Product",
    "add",
  ];
  depositSource: MatTableDataSource<SecurityDeposits> =
    new MatTableDataSource();
  userData: any;
  readable: boolean = false;
  depositTypes: string[] = ["DD", "RTGS UTR", "NEFT", "IMPS", "CHEQUE"];
  paymentToJkclOptions: any[] = [];
  dataFromForm: any[] = [];
  securityValid: boolean = false;
  apiData: any;
  transId: any;
  Id: any;
  securityDepositData: any;
  securityActions: string;
  editIndex: number;
  editclick: boolean = false;

  // For Add Validation
  alreadyExistName: boolean = false;
  alreadyExistNum: boolean = false;
  currentBankName: string = " ";
  currentBankNum: string = "";

  minDate: Date = new Date();
  maxDate: Date = new Date();

  isEdit: boolean = false;
  role: string;
  status: string;
  show: boolean = false;
  IsAdvBillingParty: boolean = false;
  selectedDocType: string;
  GlAccountList: string[] = [];
  products: string[] = [];

  constructor(
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _securityDeposityInfo: SecurityDepositService,
    private _commonService: CommonService,
    private _customerLog: CustomerLogService,
    private _masterService: MasterService,
    private _emitter: EmitterService,
    private _appConfig: AppConfigService
  ) {}

  @Output() event = new EventEmitter<boolean>();
  @Output() nextTab = new EventEmitter<string>();
  ngOnInit(): void {
    this.initializingSecurityDeposit();
    this.valuchanges();
    this.getAllMasters();
    this.paymentToJkclOptions = this._appConfig.get("PaymentToJkclBank");
    const users = localStorage.getItem("userDetails");
    const transId = localStorage.getItem("transID");
    this.status = localStorage.getItem("status");
    this.transId = JSON.parse(transId);
    if (users) {
      this.userData = JSON.parse(users);
      // this.readable = this.userData.isReadonly
      this.role = this.userData.Role;
      if (this.role == "DH" || this.role == "NH") {
        this.readable = true;
      }
    }
    console.log('status',this.status)
    if (this._commonService.accessShowHide(this.status, this.role)) {
      this.disableForm();
      this.show = true;
    }

    console.log("this.show",this.show, this.role)
    if (this.role == "ASM" && this.show) {
      this.enableForm();
    } else {
      this.disableForm();
    }
    this.getbankSecurityDepositInformation();

    this.GlAccountList = this._appConfig.get('GL_Account').split(',');
  }

  valuchanges() {
    this.addSecurityDepositForm.get("DocumentType").valueChanges.subscribe({
      next: (res) => {
        if (res) {
          this.addSecurityDepositForm.controls["AccNumber"].clearValidators();
          this.addSecurityDepositForm.controls[
            "AccNumber"
          ].updateValueAndValidity();
          this.selectedDocType = res;
          if (res == "CHEQUE") {
            this.addSecurityDepositForm.controls[
              "DocumentNo"
            ].clearValidators();
            this.addSecurityDepositForm.controls["DocumentNo"].setValidators([
              Validators.required,
              ischequeValidation,
            ]);
            this.addSecurityDepositForm.controls["AccNumber"].setValidators([
              Validators.required,
              Validators.minLength(9),
            ]);
            this.addSecurityDepositForm.controls[
              "DocumentNo"
            ].updateValueAndValidity();
            this.addSecurityDepositForm.controls[
              "AccNumber"
            ].updateValueAndValidity();
          }
          this.addSecurityDepositForm.get("DocumentDate").patchValue(null);
          if (res == "DD" || res == "CHEQUE") {
            this.minDate = new Date(
              new Date().setMonth(new Date().getMonth() - 3)
            );
          } else {
            this.minDate = null;
          }
          if (res != "CHEQUE") {
            this.maxDate = new Date();
          } else {
            this.maxDate = null;
          }
          if (this.editIndex >= 0) {
            this.addSecurityDepositForm
              .get("DocumentDate")
              .patchValue(
                new Date(this.depositSource.data[this.editIndex].DocumentDate)
              );
          }
        }
      },
    });
  }

  openConfirmationDialogBox(Action: string, value: any, panel: string): void {
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: Action,
      },
      panelClass: panel,
    };
    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (dialogResult) => {
        if (dialogResult == "delete") {
          this.depositSource.data.splice(value, 1);
          this.depositSource._updateChangeSubscription();
          this.addSecurityDepositForm.reset();
        }
      },
      (err) => {}
    );
  }

  scroll(tab: HTMLElement) {
    tab.scrollIntoView();
  }

  reject(value) {
    const action = "reject";
    const panel = "delete-dialog";
    this.openConfirmationDialogBox(action, value, panel);
  }

  toggle(event) {
    this.IsAdvBillingParty = event;
    this._emitter.emitIsAdvBillingParty(this.IsAdvBillingParty);
    localStorage.setItem(
      "isAdvBillingParty",
      this.IsAdvBillingParty.toString()
    );
    if (this.IsAdvBillingParty) {
      this.addSecurityDepositForm.disable();
    } else if (!this.IsAdvBillingParty) {
      this.addSecurityDepositForm.enable();
    }
  }

  addSecurityDetails(value) {
    if (this.checkValidForm()) {
      if (this.depositSource && this.depositSource.data) {
        this.depositSource.data.push(this.addSecurityDepositForm.value);
        this.depositSource._updateChangeSubscription();
      } else {
        this.depositSource = new MatTableDataSource([
          this.addSecurityDepositForm.value,
        ]);
      }
      this.addSecurityDepositForm.reset();
    }
  }

  checkValidForm() {
    if (this.addSecurityDepositForm.valid) {
      if (this.depositSource && this.depositSource.data.length > 0) {
        if (this.selectedDocType == "CHEQUE") {
          this.addAcNotoLocalStorage();
          let acDup = false;
          this.depositSource.data.forEach((deposit, i) => {
            if (
              deposit.AccNumber &&
              deposit.AccNumber !=
                this.addSecurityDepositForm.get("AccNumber").value
            ) {
              acDup = true;
            }
          });
          if (acDup) {
            this._commonService.openSnackbar(
              "Bank Account Numbers can not be different.",
              snackbarStatus.Danger
            );
            return false;
          }
        }

        let dup = false;
        this.depositSource.data.forEach((deposit, i) => {
          if (
            deposit.DocumentNo ==
              this.addSecurityDepositForm.get("DocumentNo").value &&
            i != this.editIndex
          ) {
            dup = true;
          }
        });
        if (dup) {
          this._commonService.openSnackbar(
            "Your are trying to add duplicate DD/Cheque number",
            snackbarStatus.Danger
          );
        }
        return !dup;
      } else {
        return this.addAcNotoLocalStorage();
      }
    } else {
      this.addSecurityDepositForm.markAllAsTouched();
      return false;
    }
  }

  addAcNotoLocalStorage() {
    var acNo = localStorage.getItem("accNumber");
    if (!acNo) {
      localStorage.setItem(
        "accNumber",
        this.addSecurityDepositForm.get("AccNumber").value
      );
      return true;
    } else {
      if (this.selectedDocType == "CHEQUE") {
        if (acNo != this.addSecurityDepositForm.get("AccNumber").value) {
          this._commonService.openSnackbar(
            "Bank Account Numbers can not be different.",
            snackbarStatus.Danger
          );
          return false;
        } else return true;
      }
      return true;
    }
  }

  saveEditedDetails() {
    if (this.checkValidForm()) {
      this.isEdit = false;
      this.depositSource.data[this.editIndex] =
        this.addSecurityDepositForm.value;
      this.depositSource._updateChangeSubscription();
      this.editIndex = -1;
      this.addSecurityDepositForm.reset();
      this.securityActions = "";
    }
  }

  editSecurityDetails(value, dd) {
    this.isEdit = true;
    this.editIndex = dd;
    this.securityActions = value;
    this.addSecurityDepositForm.reset();
    this.addSecurityDepositForm.patchValue(this.depositSource.data[dd]);
  }

  deleteSecurityDetails(value, dd) {
    const action = "deleteSecurity";
    const panel = "delete-dialog";
    this.openConfirmationDialogBox(action, dd, panel);
  }

  initializingSecurityDeposit() {
    this.addSecurityDepositForm = this._formBuilder.group({
      DocumentType: ["", Validators.required],
      DocumentNo: ["", [Validators.required]],
      DocumentDate: ["", Validators.required],
      Amount: ["", Validators.required],
      BankName: ["", Validators.required],
      AccNumber: [""],
      PaymentToJKCLBank: ["", Validators.required],
      UTRNumber: ["", Validators.required],
      GLAccount: ["", Validators.required],
      ProductName:["",Validators.required]
    });
  }

  saveBankSecurity() {
    if (!this.IsAdvBillingParty) {
      if (this.depositSource.data.length > 0) {
        let securityDeposits: SecurityDeposits[] = [];
        this.depositSource.data.forEach((deposit) => {
          let single = new SecurityDeposits();
          single = deposit as SecurityDeposits;
          single.Id = 0;
          single.TransId = this.transId;
          single.IsAdvBillingParty = this.IsAdvBillingParty;
         // single.ProductName = this.addSecurityDepositForm.value
          console.log("productname",this.addSecurityDepositForm.value);
          securityDeposits.push(single);
        });

        this._securityDeposityInfo
          .createSecurityDepositInfo(securityDeposits)
          .subscribe({
            next: (response) => {
              if (
                this.userData.Role != "ASM" &&
                this.userData.Role != "Customer"
              ) {
                this._customerLog.createLogDetails(
                  this.userData,
                  "updated security deposit information"
                );
              }
              this._commonService.openSnackbar(
                "Security deposit details saved successfully",
                snackbarStatus.Success,
                2000
              );
              this.addSecurityDepositForm.reset();
              this.nextTab.emit("details_of_firm");
              this.event.emit(this.addSecurityDepositForm.valid);
              this.disableForm();
            },
            error: (error) => {
              this._commonService.openSnackbar(
                error instanceof Error ? error.message : "Something went wrong",
                snackbarStatus.Danger
              );
            },
          });
      } else {
        this._commonService.openSnackbar(
          "Please add atlease one security deposit detail",
          snackbarStatus.Danger
        );
      }
    } else {
      let securityDeposits: SecurityDeposits[] = [];
      let single = new SecurityDeposits();
      single.Id = 0;
      single.TransId = this.transId;
      single.IsAdvBillingParty = this.IsAdvBillingParty;
      securityDeposits.push(single);

      this._securityDeposityInfo
        .createSecurityDepositInfo(securityDeposits)
        .subscribe({
          next: (response) => {
            if (
              this.userData.Role != "ASM" &&
              this.userData.Role != "Customer"
            ) {
              this._customerLog.createLogDetails(
                this.userData,
                "updated security deposit information"
              );
            }
            this._commonService.openSnackbar(
              "Security deposit details saved successfully",
              snackbarStatus.Success,
              2000
            );
            this.addSecurityDepositForm.reset();
            this.nextTab.emit("details_of_firm");
            this.event.emit(this.addSecurityDepositForm.valid);
            this.disableForm();
          },
          error: (error) => {
            this._commonService.openSnackbar(
              error instanceof Error ? error.message : "Something went wrong",
              snackbarStatus.Danger
            );
          },
        });
    }
  }

  getbankSecurityDepositInformation() {
    this._securityDeposityInfo
      .getSecurityDepositInfoByTransId(this.transId)
      .subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            this.Id = res[0].Id;
            this.IsAdvBillingParty = res[0].IsAdvBillingParty;
            localStorage.setItem(
              "isAdvBillingParty",
              this.IsAdvBillingParty.toString()
            );
            this._emitter.emitIsAdvBillingParty(this.IsAdvBillingParty);
            if (!res[0].IsAdvBillingParty) {
              this.depositSource = new MatTableDataSource(res);
            } else {
              this.disableForm();
            }
          }
        },
        error: (err) => {
          this._commonService.openSnackbar(err.message, snackbarStatus.Danger);
        },
      });
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

  editClicked() {
    this.enableForm();
    this.alreadyExistName = false;
    this.alreadyExistNum = false;
    this.securityValid = false;
  }

  enableForm() {
    this.editclick = false;
    this.addSecurityDepositForm.enable();
  }

  disableForm() {
    this.editclick = true;
    this.addSecurityDepositForm.disable();
  }

  cancel() {
    this.disableForm();
    this.getbankSecurityDepositInformation();
  }

  dateFormat(date) {
    if (!date) {
      return "";
    }
    return moment(date).format("DD/MM/YYYY");
  }

  toggleSelection(checked: boolean): void {
    if (this.addSecurityDepositForm) {
      if (checked) {
        this.addSecurityDepositForm.get("ProductName").setValue(this.products);
      } else {
        this.addSecurityDepositForm.get("ProductName").setValue([]);
      }
    }
  }


  getAllMasters() {


    this.products = this._appConfig.get('SecurityProducts').split(',');
    // this._masterService.getDivisionMaterialMap().subscribe((response)=>{
    //   response.forEach((val)=>{
    //     val.MaterialGroup != null ? this.products.push(val.MaterialGroup):{}
    //   })
    //
    //   console.log("products,",this.products);
    // })
    // forkJoin([
    //   this._masterService.getStates(),
    //   this._masterService.getCategories(),
    //   this._masterService.getDivisionMaterialMap(),
    // ]).subscribe({
    //   next: (res) => {
    //     res[2].forEach((ele) => {
    //       ele.MaterialGroup != null
    //         ? this.products.push(ele.MaterialGroup)
    //         : {};
    //     });
    //
    //   },
    // });
  }


}
