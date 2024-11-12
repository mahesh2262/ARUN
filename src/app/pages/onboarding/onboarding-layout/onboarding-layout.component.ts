import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogBoxComponent } from "../../../Dialogs/dialog-box/dialog-box.component";
import { ActivatedRoute, Router } from "@angular/router";
import { BankInfoComponent } from "../bank-info/bank-info.component";
import { BankSecurityDepositComponent } from "../bank-security-deposit/bank-security-deposit.component";
import { BusinessInfoComponent } from "../business-info/business-info.component";
import { MarketInfoComponent } from "../market-info/market-info.component";
import { PersonalInfoComponent } from "../personal-info/personal-info.component";
import { RejectDto, TaskDto } from "../../../Models/onboardingModel";
import { ApprovalService } from "../../../Services/approval.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { CommonService } from "../../../Services/common.service";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LoginService } from "../../../Services/login.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AdditionalDataInfoComponent } from "../additional-data-info/additional-data-info.component";
import { PdfTemplateComponent } from "../../../Templates/pdf-template/pdf-template.component";
import { DocumentScreenComponent } from "../document-screen/document-screen.component";
import { delay } from "rxjs/operators";
import { DashboardService } from "../../../Services/dashboard.service";
import { EmitterService } from "../../../Services/emitter.service";
import { WorkFlowDashboard } from "../../../Models/dashboardModel";

@Component({
  selector: "ngx-onboarding-layout",
  templateUrl: "./onboarding-layout.component.html",
  styleUrls: ["./onboarding-layout.component.scss"],
})
export class OnboardingLayoutComponent implements OnInit, AfterViewInit {
  dialogRef: any;
  userData: any;
  category: string;
  transId: string;
  role: string = "";
  readable: boolean = true;
  personal: boolean = true;
  market: boolean = true;
  business: boolean = true;
  security: boolean = true;
  firm: boolean = true;
  document: boolean = false;
  additionaldatainfo: boolean = true;
  loader: boolean = false;
  checked: boolean = true;
  status: string;
  show: boolean = false;
  additionalView: boolean;
  isDocumentProp: boolean;
  isDocumentMoa: boolean;
  isAllDocument: boolean;
  isAdvBilling: boolean;
  prefix: string;

  workFlow: WorkFlowDashboard[] = [];

  @ViewChild(PersonalInfoComponent, { static: true })
  personalInfo: PersonalInfoComponent;

  @ViewChild(MarketInfoComponent, { static: true })
  marketInfo: MarketInfoComponent;

  @ViewChild(BusinessInfoComponent, { static: true })
  businessInfo: BusinessInfoComponent;

  @ViewChild(BankInfoComponent, { static: true })
  bankInfo: BankInfoComponent;

  @ViewChild(BankSecurityDepositComponent, { static: true })
  securityDeposit: BankSecurityDepositComponent;

  @ViewChild(AdditionalDataInfoComponent, { static: false })
  additionalData: AdditionalDataInfoComponent;

  @ViewChild(DocumentScreenComponent, { static: false })
  documentData: DocumentScreenComponent;

  @ViewChild("Section") section: ElementRef;

  constructor(
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _approvalService: ApprovalService,
    private _dashboardService: DashboardService,
    private _commonService: CommonService,
    private _emitterService: EmitterService,
    private _nav: LoginService
  ) {}

  ngOnInit(): void {
    const users = localStorage.getItem("userDetails");
    this.status = localStorage.getItem("status");
    this.transId = localStorage.getItem("transID");
    if (users) {
      this.userData = JSON.parse(users);
      this.readable = this.userData.isReadonly;
      this.role = this.userData.Role;
    }
    if (this._commonService.accessShowHide(this.status, this.role)) {
      this.show = true;
    }
    this.prefix = "JKW" + "0".repeat(7 - this.transId.length);

    this._emitterService.categoryEmitter.subscribe({
      next: (data) => {
        if (data && this.transId) {
          this.category = data;
          this._dashboardService
            .getWorkFlow(this.category, Number(this.transId))
            .subscribe({
              next: (res) => {
                this.workFlow = res;
              },
            });
        }
      },
    });

    this._emitterService.isAdvBillingEmitter.subscribe({
      next: (res) => {
        this.isAdvBilling = res;
      },
    });
  }

  ngAfterViewInit() {
    window.addEventListener("scroll", this.activeScroll, true);
  }

  activeScroll() {
    let menuItems = document.querySelectorAll(".nav-link") as NodeList;
    let sectionList = document.querySelectorAll(
      ".tab-content section"
    ) as NodeList;
    (sectionList as NodeList).forEach((v, i) => {
      let rect = (v as HTMLElement).getBoundingClientRect().y;
      if (rect < window.innerHeight - 555) {
        (menuItems as NodeList).forEach((v) =>
          (v as HTMLButtonElement).classList.remove("active")
        );
        ((menuItems as NodeList)[i] as HTMLButtonElement).classList.add(
          "active"
        );
      }
    });
  }

  openConfirmationDialogBox(Action: string, panel: string): void {
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: Action,
      },
      panelClass: panel,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result == "Rejected") {
          this.router.navigate(["/pages/dashboard"]);
        }
      },
      (err) => {}
    );
  }

  scroll(tab: HTMLElement) {
    tab.scrollIntoView();
  }

  scrollToAddData(id: any) {
    let tab = id as HTMLElement;
  }

  nextTab(tab: any) {
    let tablet = document.getElementById(tab + "-tab");
    tablet.click();
  }

  reject(value) {
    const action = "reject";
    const panel = "delete-dialog";
    this.openConfirmationDialogBox(action, value);
  }

  personalvalid($event) {
    this.personal = $event;
  }

  marketvalid($event) {
    this.market = $event;
  }

  businessvalid($event) {
    this.business = $event;
  }

  securityvalid($event) {
    this.security = $event;
  }

  firmvalid($event) {
    this.firm = $event;
  }

  documentvalid($event) {
    this.document = $event;
  }

  additional($event) {
    this.additionaldatainfo = $event;
  }

  approveClicked() {
    const action = "approvalDialog";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: "dialog-box-approval",
      autoFocus: false,
    };
    // this.toggle(this.checked);
    if (this.checked) {
      const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);

      dialogRef.afterClosed().subscribe((response) => {
        this.enableForms();
        if (response == "Yes") {
          let taskDto = new TaskDto();
          taskDto.TransId = parseInt(localStorage.getItem("transID"));
          taskDto.CurrentOwnerPosId = this.userData.PositionId;
          taskDto.CurrentOwnerEmpId = this.userData.EmpId;
          if (this.userData.Role == "Customer") {
            taskDto.CurrentOwnerPosId = "";
            taskDto.CurrentOwnerEmpId = "";
          }
          taskDto.Role = this.userData.Role;
          taskDto.StateCode =
            this.personalInfo.personalInformationForm.get("State").value;
          taskDto.CountyCode =
            this.personalInfo.personalInformationForm.get("District").value;
          taskDto.CustomerType =
            this.personalInfo.personalInformationForm.get("Category").value;
          this.loader = true;
          // console.log("approval",this.checkValidForApproval())
          if (this.checkValidForApproval()) {
            this.loader = true;
            this._approvalService.approveTask(taskDto).subscribe({
              next: (res) => {
                this._commonService.openSnackbar(
                  this.role == "Customer" || this.role == "ASM"
                    ? "Form Submitted Successfully"
                    : "Approved Successfully",
                  snackbarStatus.Success
                );
                this.loader = false;
                if (this.userData.Role == "Customer") {
                  this.router.navigate(["/auth/otp"]);
                } else {
                  this.router.navigate(["/pages/dashboard"]);
                }
              },
              error: (err) => {
                this.loader = false;
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
                this.disableForms();
              },
            });
          } else {
            this.loader = false;
          }
        }
      });
    } else {
      this._commonService.openSnackbar(
        "Please Ensure the CheckBox Has Selected",
        snackbarStatus.Warning
      );
      this.loader = false;
    }
  }

  rejectClicked() {
    const action = "rejectDialog";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: "dialog-box-approval",
      autoFocus: true,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          let rejectDto = new RejectDto();
          rejectDto.TransId = Number(this.transId);
          rejectDto.Message = res;
          this._approvalService.rejectTask(rejectDto).subscribe({
            next: () => {
              this._commonService.openSnackbar(
                "Rejected Successfully",
                snackbarStatus.Success
              );
              this.router.navigate(["pages/dashboard"]);
            },
            error: (err) => {},
          });
        }
      },
    });
  }

  checkValidForApproval(): boolean {
    // console.log("AdvBill",this.isAdvBilling);

    // console.log("11this.personalInfo.personalInformationForm.valid",this.personalInfo.personalInformationForm.valid)
    // console.log("11this.marketInfo.marketInformationForm.valid",this.marketInfo.marketInformationForm.valid)
    // console.log("11this.businessInfo.businessInformationForm.valid",this.businessInfo.businessInformationForm.valid)
    // console.log("11this.bankInfo.BankForm.valid",this.bankInfo.BankForm.valid)
    // console.log("11this.isAdvBilling",this.isAdvBilling)
    // console.log("11this.securityDeposit.depositSource.data.length",this.securityDeposit.depositSource.data.length)
    // console.log("11this.documentData.isAllDocsUploaded()",this.documentData.isAllDocsUploaded())

    if (this.userData.Role != "RA") {
      if (
        this.personalInfo.personalInformationForm.valid &&
        this.marketInfo.marketInformationForm.valid &&
        this.businessInfo.businessInformationForm.valid &&
        this.bankInfo.BankForm.valid &&
        (this.isAdvBilling ||
          this.securityDeposit.depositSource.data.length > 0) &&
        this.documentData.isAllDocsUploaded()
      ) {
        return this.checkAllSaved();
      } else {
        this.markAllasTouched();
        return false;
      }
    } else {




      if (
        this.personalInfo.personalInformationForm.valid &&
        this.marketInfo.marketInformationForm.valid &&
        this.businessInfo.businessInformationForm.valid &&
        this.bankInfo.BankForm.valid &&
        (this.isAdvBilling ||
          this.securityDeposit.depositSource.data.length > 0) &&
        this.documentData.isAllDocsUploaded() &&
        this.additionalData.orgGroupForm.valid
      ) {
        return this.checkAllSaved();
      } else {
        this.markAllasTouched();
        return false;
      }
    }
  }

  checkAllSaved() {
    let message = "Please Save";
    let cnt = 0;
    if (!this.personalInfo.editClicked) {
      cnt += 1;
      message += `\n\t${cnt}.Personal Information`;
    }
    if (!this.marketInfo.editclick) {
      cnt += 1;
      message += `\n\t${cnt}.Market Information`;
    }
    if (!this.businessInfo.editclick) {
      cnt += 1;
      message += `\n\t${cnt}.Business Information`;
    }
    if (!this.bankInfo.editclick) {
      cnt += 1;
      message += `\n\t${cnt}.Bank Information`;
    }
    if (!this.securityDeposit.editclick) {
      cnt += 1;
      message += `\n\t${cnt}.Security Deposits`;
    }
    if (this.userData.Role == "RA") {
      if (!this.additionalData.editclick) {
        cnt += 1;
        message += `\n\t${cnt}.Additional Data`;
      }
    }
    if (cnt == 0) {
      return true;
    } else {
      this._commonService.openSnackbar(message, snackbarStatus.Warning, 3000);
      return false;
    }
  }

  checkIsadvBilling() {
    if (this.securityDeposit.IsAdvBillingParty) {
      return true;
    } else if (localStorage.getItem("isAdvBillingParty") == "true") {
      return true;
    } else if (this.securityDeposit.depositSource.data.length) {
      return true;
    } else {
      return false;
    }
  }

  enableForms() {
    if (this.userData.Role == "RA") {
      this.additionalData.orgGroupForm.enable();
    }
    this.personalInfo.personalInformationForm.enable();
    this.marketInfo.marketInformationForm.enable();
    this.businessInfo.businessInformationForm.enable();
    this.bankInfo.BankForm.enable();
  }

  disableForms() {
    if (this.userData.Role == "RA") {
      this.additionalData.orgGroupForm.disable();
    }
    this.personalInfo.personalInformationForm.disable();
    this.marketInfo.marketInformationForm.disable();
    this.businessInfo.businessInformationForm.disable();
    this.bankInfo.BankForm.disable();
  }

  markAllasTouched() {

    // console.log("this.personalInfo.personalInformationForm.valid",this.personalInfo.personalInformationForm.valid)
    // console.log("this.marketInfo.marketInformationForm.valid",this.marketInfo.marketInformationForm.valid)
    // console.log("this.businessInfo.businessInformationForm.valid",this.businessInfo.businessInformationForm.valid)
    // console.log("this.bankInfo.BankForm.valid",this.bankInfo.BankForm.valid)
    // console.log("this.isAdvBilling",this.isAdvBilling)
    // console.log("this.securityDeposit.depositSource.data.length",this.securityDeposit.depositSource.data.length)
    // console.log("this.additionalData.orgGroupForm.valid",this.additionalData.orgGroupForm.valid)

    if (!this.personalInfo.personalInformationForm.valid) {
      this.personalInfo.editClick();
      this.personalInfo.personalInformationForm.markAllAsTouched();
    }
    if (!this.marketInfo.marketInformationForm.valid) {
      this.marketInfo.editClicked();
      this.marketInfo.marketInformationForm.markAllAsTouched();
    }
    if (!this.businessInfo.businessInformationForm.valid) {
      this.businessInfo.editClicked();
      this.businessInfo.businessInformationForm.markAllAsTouched();
    }
    if (!this.bankInfo.BankForm.valid) {
      this.bankInfo.editClicked();
      this.bankInfo.BankForm.markAllAsTouched();
    }
    if (!this.isAdvBilling && this.securityDeposit.depositSource.data.length == 0) {
      this.securityDeposit.editClicked();
      this.securityDeposit.addSecurityDepositForm.markAllAsTouched();
    }

    if (this.userData.Role == "RA") {
      if (!this.additionalData.orgGroupForm.valid) {
        this.additionalData.editClicked();
        this.additionalData.orgGroupForm.markAllAsTouched();
      }
    }
    this._commonService.openSnackbar(
      "Please fill all the required details",
      snackbarStatus.Danger
    );
  }

  print2Pdf() {
    let personal = this.personalInfo.personalInformationForm.value;

    personal.State = this.personalInfo.states.find(
      (x) =>
        x.StateCode ==
        this.personalInfo.personalInformationForm.get("State").value
    )["StateName"];

    personal.District = this.personalInfo.districts.find(
      (x) =>
        x.CountyCode ==
        this.personalInfo.personalInformationForm.get("District").value
    )["CountyName"];
    const dialogconfig: MatDialogConfig = {
      data: {
        personalInfo: personal,
        firmStatus: this.personalInfo.contactdataSource.data,
        marketInfo: this.marketInfo.marketInformationForm.value,
        businessInfo: this.businessInfo.businessInformationForm.value,
        securityDeposit: this.securityDeposit.depositSource.data,
        bankInfo: this.bankInfo.BankForm.value,
        documentData: this.documentData.docList,
        additionalData: this.additionalData?.orgGroupForm?.value,
      },

      panelClass: "dialog-box",
      autoFocus: false,
    };
    const dialogRef = this._dialog.open(PdfTemplateComponent, dialogconfig);
    this._dialog.afterAllClosed.subscribe({
      next: () => {},
    });
  }

  toggle(checked: boolean) {
    if (this.role == "ASM" || this.role == "Customer") {
      this.checked = checked;
    } else {
      this.checked = true;
    }
  }
  checkDocumentRequired() {
    let documentName = [
      "GSTCertificate",
      "PanCard",
      "AadharCard",
      "CancelledCheque",
      "PartnerPhoto",
      "TDSDeclaration",
      "AddressProof",
      "SignedDocument",
    ];
    let valid;
    this.documentData.docList.forEach((value) => {
      documentName.forEach((values) => {
        if (value.DocumentType.includes(values)) {
          valid = true;
        } else {
          valid = false;
        }
      });
    });
    if (valid) {
      this.isAllDocument = true;
    } else {
      this.isAllDocument = false;
    }

    let firmStatus =
      this.personalInfo.personalInformationForm.get("FirmStatus").value;
    if (firmStatus == "Proprietor") {
      this.documentData.docList.forEach((value) => {
        if (value.DocumentType == "partnershipDeed") {
          this.isDocumentProp = true;
        } else {
          this.isDocumentProp = false;
        }
      });
    } else {
      this.isDocumentProp = true;
    }

    if (firmStatus == "Pvt Ltd" || firmStatus == "Limited") {
      this.documentData.docList.forEach((value) => {
        if (value.DocumentType == "MOA") {
          this.isDocumentMoa = true;
        } else {
          this.isDocumentMoa = false;
        }
      });
    } else {
      this.isDocumentMoa = true;
    }
  }
}
