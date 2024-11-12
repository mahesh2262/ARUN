import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { snackbarStatus } from "../../Enums/notification-snack-bar";
import { CommonService } from "../../Services/common.service";
import { DocumentsService } from "../../Services/documents.service";
import { saveAs } from "file-saver";
import { Roles } from "../../Models/MasterModel";
import { RoleService } from "../../Services/role.service";
import { isValidEmail } from "../../Customize/Validators/emailChecker";
import { isZeroValidation } from "../../Customize/Validators/zeroValidation";
import { FileSaverService } from "../../Services/file-saver.service";
import { AppConfigService } from "../../Services/app-config.service";
import { ChangePassword } from "../../Models/authModel";

@Component({
  selector: "ngx-dialog-box",
  templateUrl: "./dialog-box.component.html",
  styleUrls: ["./dialog-box.component.scss"],
})
export class DialogBoxComponent implements OnInit {
  addForm: FormGroup;
  passwordForm: FormGroup;
  PersonName: string;
  Mobile: number;
  Email: string;
  boxContent: string;
  newPassword: string;
  currentPassword: string;
  conformPassword: string;
  amount: number;
  bankName: string;
  date: string;
  depositType: string;
  number: number;
  SecurityForm: FormGroup;
  selectedDepositType: string;
  TerritoryForm: FormGroup;
  partyBackgroundForm: FormGroup;
  type: string;
  textValid: boolean = false;
  FileName: string;
  AttachmentData: any;
  docResponse: any;

  reectFormControl: FormControl = new FormControl("", Validators.required);
  isInValidMobile: boolean = false;

  brandNames: string[] = [];
  unitList: string[] = [];
  loader: boolean = false;
  ApprovalForm: FormGroup;
  EmailForm: FormGroup;
  RolesData: Roles[] = [];
  ApprovalId: number;
  isWallPutty: boolean = false;
  isWhiteCement: boolean = false;
  partyBackgroundData: string[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    public _dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _commonService: CommonService,
    private _documentService: DocumentsService,
    private sanitizer: DomSanitizer,
    private _roleService: RoleService,
    private _fileSaver: FileSaverService,
    private _appConfig: AppConfigService
  ) {
    _dialogRef.disableClose = true;
    this.brandNames = this._appConfig.get("BRAND_NAMES").split(",");
    this.unitList = this._appConfig.get("UNITS").split(",");
  }

  ngOnInit(): void {
    this.ApprovalId = this.data.ID;
    this.boxContent = this.data.Action;
    this.depositType = this.data.depositType;
    this.number = this.data.number;
    this.type = this.data.type;
    this.FileName = this.data.FileName;
    this.partyBackgroundData = this.data.partyBackground;
    this.initialpersonalFormDetails();
    this.initialpartyBackgroundDetails();
    this.initailSecurityDetails();
    this.initaialTerritoryDetails();
    this.initialForgotPasswordDetails();
    this.initializingApprovalNotification();
    this.initializingEmailNotification();

    if (this.data.docId != null) {
      this.loader = true;
      this._documentService.getDocumentBydocId(this.data.docId).subscribe({
        next: async (res) => {
          this.docResponse = res;
          this.AttachmentData = await this._fileSaver.getAttachmentData(res);
          this.loader = false;
        },
        error: (err) => {
          this.loader = false;
        },
      });
    }
  }

  initialpersonalFormDetails() {
    this.addForm = this._formBuilder.group({
      PersonName: ["", Validators.required],
      Email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._-]+@[a-z]+\\.[a-z]{2,3}$"),
          isValidEmail,
        ],
      ],
      Mobile: [
        "",
        [Validators.required, Validators.pattern("^[6-9]{1}[0-9]{9}$")],
      ],
      Action: [""],
    });
    if (this.data.Action == "editPersonal") {
      this.addForm.patchValue(this.data);
    }
  }

  initialpartyBackgroundDetails() {
    this.partyBackgroundForm = this._formBuilder.group({
      Business: [""],
      Brand: [""],
      Unit: [""],
      AvgMonthlySales: [0],
      Actions: [""],
    });

    if (
      this.data.partyBackgroundvalue != undefined &&
      this.data.Action == "editBrand"
    ) {
      this.partyBackgroundForm.patchValue(this.data.partyBackgroundvalue);
    }
  }

  initailSecurityDetails() {
    this.SecurityForm = this._formBuilder.group({
      bankNumber: ["", Validators.required],
      date: [""],
      amount: ["", Validators.required],
      bankName: ["", Validators.required],
      depositType: [""],
      number: ["", Validators.required],
    });
  }

  initaialTerritoryDetails() {
    this.TerritoryForm = this._formBuilder.group({
      DistChannel: ["", Validators.required],
      StateCode: ["", Validators.required],
      StateName: ["", Validators.required],
      CountyCode: ["", Validators.required],
      CountyName: ["", Validators.required],
      RAEmployeeId: ["", Validators.required],
      RAEmployeeName: ["", Validators.required],
      RAEmailId: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._-]+@[a-z]+\\.[a-z]{2,3}$"),
          isValidEmail,
        ],
      ],
      RAPositionId: [""],
    });

    this.TerritoryForm.patchValue(this.data.territoryData);
  }

  initialForgotPasswordDetails() {
    this.passwordForm = this._formBuilder.group({
      newPassword: ["", Validators.required],
      currentPassword: ["", Validators.required],
      conformPassword: ["", Validators.required],
    });
  }

  initializingApprovalNotification() {
    this.ApprovalForm = this._formBuilder.group({
      Role: ["", Validators.required],
      Name: ["", Validators.required],
      Mail: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._-]+@[a-z]+\\.[a-z]{2,3}$"),
          isValidEmail,
        ],
      ],
    });

    if (this.data.Action == "Approval" && this.data.Name != "") {
      this.getRoles(this.data);
    }
  }


  initializingEmailNotification() {
    this.EmailForm = this._formBuilder.group({
      Name: ["", Validators.required],
      Mail: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._-]+@[a-z]+\\.[a-z]{2,3}$"),
          isValidEmail,
        ],
      ],
    });

    // if (this.data.Action == "Email" && this.data.Name != "") {
    //   this.getRoles(this.data);
    // }
  }

  value(action) {
    if (action == "add") {
      if (
        this.addForm.valid &&
        !this.isMobileValid(this.addForm.value["Mobile"])
      ) {
        this.addForm.controls["Action"].setValue(this.boxContent);

        this._dialogRef.close(this.addForm.value);
      } else {
        this.addForm.markAllAsTouched();
      }
    } else if (action == "close") {
      this._dialogRef.close(false);
    }
  }

  isMobileValid(mobile: string) {
    const first = mobile.split("")[0];
    if (mobile.split("").every((x) => first == x)) {
      this.isInValidMobile = true;
    } else {
      this.isInValidMobile = false;
    }
    return this.isInValidMobile;
  }

  delete(result) {
    if (result == "yes") {
      this._dialogRef.close("delete");
    } else if (result == "no") {
      this._dialogRef.close(false);
    }
  }

  passwordChange(value) {
    if (value == "add") {
      this.conformPassword = this.passwordForm.get("conformPassword").value;
      this.currentPassword = this.passwordForm.get("currentPassword").value;
      this.newPassword = this.passwordForm.get("newPassword").value;

      if (this.newPassword != this.conformPassword) {
        this._commonService.openSnackbar(
          "New Passwords are not same",
          snackbarStatus.Danger
        );
      } else {
        let changePassword = new ChangePassword();
        changePassword.CurrentPassword =
          this.passwordForm.get("currentPassword").value;
        changePassword.NewPassword = this.passwordForm.get("newPassword").value;
        this._dialogRef.close(changePassword);
      }
    } else {
      this._dialogRef.close(false);
    }
  }

  reject(action) {
    this._dialogRef.close(action);
  }

  addSecurityDetails(value) {
    if (value == "addSecurity") {
      this.SecurityForm.controls["depositType"].setValue(
        this.selectedDepositType
      );
      this._dialogRef.close(this.SecurityForm.value);
    } else {
      this._dialogRef.close("close");
    }
  }

  addOreditTerritory() {
    if (this.TerritoryForm.valid) {
      const territory = this.TerritoryForm.value;
      if (this.data.Action == "editTerritory")
        territory["Id"] = this.data.territoryData["Id"];
      else territory["Id"] = 0;
      this._dialogRef.close(territory);
    } else {
      this.TerritoryForm.markAllAsTouched();
    }
  }

  cancel(value) {
    this._dialogRef.close(false);
  }

  createBlob(
    fileName: string,
    fileContent: string,
    fileExtention: string
  ): Promise<any> {
    return new Promise((resolve) => {
      const FILETYPE = fileName.toLowerCase().includes("pdf")
        ? "application/pdf"
        : fileName.toLowerCase().includes("xml")
        ? "application/xml"
        : fileName.toLowerCase().includes("csv")
        ? "text/csv"
        : fileName.toLowerCase().includes("png")
        ? "image/png"
        : "text/plain";
      const BASE64 = `data:${FILETYPE};base64,` + fileContent;
      resolve(BASE64);
    });
  }

  dataURItoBlob(dataURI: string): Blob {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(dataURI.split(",")[1]);
    } else {
      byteString = unescape(dataURI.split(",")[1]);
    }

    // separate out the mime component
    const MIMESTRING = dataURI.split(",")[0].split(":")[1].split(";")[0];
    // write the bytes of the string to a typed array
    const IA = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      IA[i] = byteString.charCodeAt(i);
    }

    return new Blob([IA], { type: MIMESTRING });
  }

  downloadFile(): void {
    this._fileSaver.downloadFile(this.docResponse);
  }

  partybackground(value) {
    if (value == "add") {
      if (this.data.Action == "editBrand") {
        this.partyBackgroundForm.controls["Actions"].setValue("edit");
      }

      this._dialogRef.close(this.partyBackgroundForm.value);
    }
  }

  closeRemainder(value) {
    this._dialogRef.close(value);
  }

  getRoles(value) {
    this._roleService.getRoles().subscribe(
      (response) => {
        this.RolesData = response;
        this.ApprovalForm.patchValue(value);
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  addApproval(value) {
    if (value == "add") {
      if (this.ApprovalForm.valid) {
        this._dialogRef.close(this.ApprovalForm.value);
      } else this.ApprovalForm.markAllAsTouched();
    } else if (value == "close") {
      this._dialogRef.close(false);
    }
  }

  keyPressValidation(event, str): boolean {
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
        k == 47 ||
        k == 35
      );
    } else if (str == "A&N") {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57)
      );
    } else if (str == "Number") {
      return k >= 48 && k <= 57;
    }
  }

  RejectForm(action) {
    if (action == "ok") {
      if (this.reectFormControl.valid) {
        this._dialogRef.close(this.reectFormControl.value);
      } else {
        this._commonService.openSnackbar(
          "Please enter the reason for rejection",
          snackbarStatus.Danger
        );
      }
    } else {
      this._dialogRef.close(false);
    }
  }

  addEmail(action){

    if (action == "add") {
      if (this.EmailForm.valid) {
        this._dialogRef.close(this.EmailForm.value);
      } else this.EmailForm.markAllAsTouched();
    } else if (action == "close") {
      this._dialogRef.close(false);
    }
  }
}
