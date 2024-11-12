import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
  BankDetails,
  BankAccountResult,
} from "../../../Models/onboardingModel";

import { BankInfoService } from "../../../Services/bank-info.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { BankInfo } from "../../../Models/onboardingModel";
import { forkJoin } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { CustomerLogService } from "../../../Services/customer-log.service";
@Component({
  selector: "ngx-bank-info",
  templateUrl: "./bank-info.component.html",
  styleUrls: ["./bank-info.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BankInfoComponent implements OnInit {
  currentTransaction: number;
  public listData: BankDetails[] = [];
  BankForm: FormGroup;
  productlist: [];
  panelOpenState = false;
  apidata: any;
  Id: number;
  TransId: number;
  saveBankInfo: boolean = false;
  editclick: boolean;
  readable: boolean = false;
  Userdata: any;
  ifsc: string;
  accNumber: string;
  branchDetails: any;
  userDetails: any;
  role: string;
  status: string;
  show: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _bankInfoService: BankInfoService,
    private _customerLog: CustomerLogService
  ) {}

  @Output() event = new EventEmitter<boolean>();
  @Output() nextTab = new EventEmitter<string>();

  ngOnInit(): void {
    this.BankForm = this._formBuilder.group({
      BankName: ["", Validators.required],
      IFSC: [
        "",
        [Validators.required, Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")],
      ],
      AccNumber: ["", Validators.required],
      Branch: ["", Validators.required],
      AccHolder: ["", Validators.required],
      NomineeName: ["", Validators.required],
      NomineeRelation: ["", Validators.required],
    });

    this.getLocalStorageData();
    this.getBankInformation();
    // this.validatingBankAutofill();
    if (this._commonService.accessShowHide(this.status, this.role)) {
      this.disableForm();
      this.show = true;
    }

    if (this.role == "ASM" && this.show) {
      this.enableForm();
    } else {
      this.disableForm();
    }
  }

  KeyPressValidation(event, str): boolean {
    const k = event.which ? event.which : event.keyCode;
    if (str == "Name") {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        k == 46
      );
    } else if (str == "Branch") {
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
    } else if (str == "A&N") {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57)
      );
    } else if (str == "ddNumber") {
      return (k >= 48 && k <= 57) || k == 188 || k == 191;
    }
  }

  ClearBankForm(): void {
    this.BankForm.reset();
  }
  saveBankFirm() {
    this.saveBankInfo = true;
    if (!this.BankForm.valid) {
      this.BankForm.markAllAsTouched();
      return;
    } else {
      let bankInfo = new BankDetails();
      bankInfo = this.BankForm.value;
      bankInfo.TransId = this.TransId;
      bankInfo.Id = this.Id;
      this._bankInfoService.createBankInfo(bankInfo).subscribe({
        next: (res) => {
          if (this.Userdata.Role != "ASM" && this.Userdata.Role != "Customer") {
            this._customerLog.createLogDetails(
              this.Userdata,
              "updated bank Information"
            );
          }
          this._commonService.openSnackbar(
            "Bank information saved successfully",
            snackbarStatus.Success,
            2000
          );
          this.nextTab.emit("documents_required");
          this.event.emit(this.BankForm.valid);
          this.disableForm();
        },
        error: (err) => {
          this._commonService.openSnackbar(err, snackbarStatus.Danger, 2000);
        },
      });
    }
  }
  getLocalStorageData() {
    const transId = localStorage.getItem("transID");
    this.TransId = JSON.parse(transId);
    const users = localStorage.getItem("userDetails");
    this.status = localStorage.getItem("status");
    this.Userdata = JSON.parse(users);
    this.role = this.Userdata.Role;
    if (this.role == "DH" || this.role == "NH") {
      this.readable = true;
    }
  }
  getBankInformation() {
    this._bankInfoService.getBankInfoByTransId(this.TransId).subscribe({
      next: (response) => {
        if (response) {
          this.BankForm.patchValue(response);
          var acNo = localStorage.getItem("accNumber");
          if (!acNo && response.AccNumber) {
            localStorage.setItem("accNumber", response.AccNumber);
          } 
          this.Id = response.Id;
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger, 2500);
      },
    });
  }
  editClicked() {
    this.enableForm();
  }
  enableForm() {
    this.editclick = false;
    this.BankForm.enable();
  }
  disableForm() {
    this.editclick = true;
    this.BankForm.disable();
  }
  cancel() {
    this.disableForm();
    this.getBankInformation();
  }

  OnFocusOut(event, str) {
    if (str === "ifsc") {
      if (event.target.value.length >= 11) {
        this.ifsc = event.target.value;
        this.getBankAutoFill(this.ifsc, this.accNumber);
      }
    }
    if (str === "accNumber") {
      if (event.target.value.length >= 5) {
        this.accNumber = event.target.value;
        if (localStorage.getItem("accNumber")) {
          if (localStorage.getItem("accNumber") == this.accNumber) {
            this.getBankAutoFill(this.ifsc, this.accNumber);
          } else {
            this._commonService.openSnackbar(
              "Account number can not be different",
              snackbarStatus.Danger
            );
          }
        } else {
          this.getBankAutoFill(this.ifsc, this.accNumber);
        }
      }
    }
  }

  validatingBankAutofill() {
    this.BankForm.get("IFSC").valueChanges.subscribe((res) => {
      if (res.length >= 11) {
        this.ifsc = res;
        this.getBankAutoFill(this.ifsc, this.accNumber);
      }
    });
    this.BankForm.get("AccNumber").valueChanges.subscribe((res) => {
      if (res.length >= 5) {
        this.accNumber = res;
        this.getBankAutoFill(this.ifsc, this.accNumber);
      }
    });
  }
  getBankAutoFill(ifsc, accNumber) {
    if (ifsc && accNumber) {
      forkJoin([
        this._bankInfoService.ValidateBankAccount(accNumber, ifsc),
        this._bankInfoService.ValidateIfscCode(ifsc),
      ]).subscribe(
        (response) => {
          let isAcNoValid = false;
          if (response[0]["valid"]) {
            isAcNoValid = this.addAcNoToLocalStorage();
          } else {
            this._commonService.openSnackbar(
              response[0]["message"],
              snackbarStatus.Danger
            );
          }
          if (isAcNoValid) {
            this.userDetails = response[0];
            this.branchDetails = response[1];
            if (this.userDetails) {
              if (this.userDetails.name) {
                this.BankForm.get("AccHolder").patchValue(
                  this.userDetails.name
                );
              }
            }
            if (this.branchDetails) {
              this.BankForm.get("BankName").patchValue(this.branchDetails.bank);
              this.BankForm.get("Branch").patchValue(this.branchDetails.branch);
            }
          }
        },
        (err) => {
          this._commonService.openSnackbar(err, snackbarStatus.Danger, 2500);
        }
      );
    }
  }

  addAcNoToLocalStorage() {
    var acNo = localStorage.getItem("accNumber");
    if (!acNo) {
      localStorage.setItem("accNumber", this.accNumber);
      return true;
    } else {
      if (acNo != this.accNumber) {
        this._commonService.openSnackbar(
          "Bank Account Numbers can not be different.",
          snackbarStatus.Danger
        );
        return false;
      }
      return true;
    }
  }
}
