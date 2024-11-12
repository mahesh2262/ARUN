import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DialogBoxComponent } from "../../../Dialogs/dialog-box/dialog-box.component";
import { PersoanlInfoService } from "../../../Services/persoanl-info.service";
import { MatTableDataSource } from "@angular/material/table";
import {
  CustomerLog,
  FirmDetails,
  OrganisationInputs,
  PersonalInfo,
} from "../../../Models/onboardingModel";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { forkJoin } from "rxjs";
import { MasterService } from "../../../Services/master.service";
import {
  State,
  District,
  AccountGroup,
  DistributionChannel,
  Region,
  Division,
  SalesOrganization,
  TypeOfCategory,
} from "../../../Models/MasterModel";
import { HttpErrorResponse } from "@angular/common/http";
import { CustomerLogService } from "../../../Services/customer-log.service";
import { DocumentsService } from "../../../Services/documents.service";
import { MarketInfoService } from "../../../Services/market-info.service";
import { EmitterService } from "../../../Services/emitter.service";
import {AppConfigService} from "../../../Services/app-config.service";

@Component({
  selector: "ngx-personal-info",
  templateUrl: "./personal-info.component.html",
  styleUrls: ["./personal-info.component.scss"],
})
export class PersonalInfoComponent implements OnInit {
  name: string;
  mobile: number;
  emailId: string;
  displayedColumns: string[] = ["PersonName", "Mobile", "Email", "add"];
  loader: boolean = false;
  contactdataSource: MatTableDataSource<FirmDetails> = new MatTableDataSource();
  latitude: number;
  longitude: number;
  address: string;
  userData: any;
  readable: boolean = false;
  personalInformationForm: FormGroup;
  categories: TypeOfCategory[] = [];
  products: string[] = [];
  states: State[] = [];
  districts: District[] = [];
  accountGroups: AccountGroup[] = [];
  distributionChannels: DistributionChannel[] = [];
  salesOrganizations: SalesOrganization[] = [];
  divisions: Division[] = [];
  regions: Region[] = [];
  statusOfFirms: string[] = [
    "Proprietor",
    "Partnership",
    "Huf",
    "Pvt Ltd",
    "Limited",
  ];
  selectedStatusOfFirm: string;
  transId: number;
  dataFromDialog: any[] = [];
  editIndex: number;
  deleteIndex: number;
  Id: Number;
  CreatedOn: Date;
  CreatedBy: string;
  firmStatus: string;
  role: string;
  savePersonalInformation: boolean = false;
  editClicked: boolean;
  selectedCategory: string;
  selectedDistict: string;
  selectedAccountGroup: string;
  selecteDistributionChannel: string;
  selectedDivision: string;
  selectRegion: string;
  selectedState: string;
  saleOrginization: string;
  pinCode: string;
  channelPartner: any;
  status: string;
  show: boolean = false;
  NepalCode: string[] = [];
  cnt = 0;
  nepalCodes : boolean = false;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  @Output() nextTab = new EventEmitter<string>();
  @Output() event = new EventEmitter<boolean>();
  sharedService: any;

  constructor(
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _personalInfo: PersoanlInfoService,
    private _commonService: CommonService,
    private _masterService: MasterService,
    private _customerLog: CustomerLogService,
    private _emitter: EmitterService,
    private _appConfig: AppConfigService
  ) {}

  ngOnInit(): void {
    this.loader = true;
    this.NepalCode = this._appConfig.get("Nepal_PinCode").split(",");
    this.initializingPersonalForm();
    this.valueChangeEvents();
    this.disableForm();
    this.getAllMasters();

    const users = localStorage.getItem("userDetails");
    const transId = localStorage.getItem("transID");
    this.status = localStorage.getItem("status");
    this.transId = Number(transId);
    if (users) {
      this.userData = JSON.parse(users);
      this.role = this.userData.Role;
      if (this.role == "NH" || this.role == "DH") {
        this.readable = true;
      }
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

    // this.validationPinCode();
  }

  editPersonalDetails(value, dd) {
    const action = "editPersonal";
    const panel = "dialog-box";
    this.openConfirmationDialogBox(action, value, panel);
    this.editIndex = dd;
  }

  deletepersonalDetails(value, dd) {
    const action = "deletePersonal";
    const panel = "delete-dialog";
    this.openConfirmationDialogBox(action, value, panel);
    this.deleteIndex = dd;
  }

  addPersonalDetails() {
    const action = "addPersonal";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: "dialog-box",
      autoFocus: false,
    };
    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (dialogResponse) => {
        if (dialogResponse != false && dialogResponse.action != "close") {
          let dup = false;
          if (
            this.contactdataSource &&
            this.contactdataSource.data != null &&
            this.contactdataSource.data.length > 0
          ) {
            this.contactdataSource.data.forEach((row) => {
              if (
                row.Email == dialogResponse.Email ||
                row.Mobile == dialogResponse.Mobile
              ) {
                dup = true;
              }
            });
            if (!dup) {
              this.contactdataSource.data.push(dialogResponse);
              this.contactdataSource._updateChangeSubscription();
            } else {
              this._commonService.openSnackbar(
                "You can not add duplicate data",
                snackbarStatus.Danger
              );
            }
          } else {
            this.contactdataSource = new MatTableDataSource([dialogResponse]);
          }
        }
      },
      (err) => {}
    );

    // this.openConfirmationDialogBox(action,value)
  }

  openConfirmationDialogBox(Action: string, value: any, panel: string): void {
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: Action,
        PersonName: value.PersonName,
        Mobile: value.Mobile,
        Email: value.Email,
      },
      panelClass: panel,
    };

    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (dialogResponse) => {
        if (dialogResponse != false && dialogResponse.action != "close") {
          if (Action == "editPersonal") {
            let dup = false;
            if (this.contactdataSource.data.length > 0) {
              this.contactdataSource.data.forEach((row, i) => {
                if (
                  (row.Email == dialogResponse.Email ||
                    row.Mobile == dialogResponse.Mobile) &&
                  i != this.editIndex
                ) {
                  dup = true;
                }
              });
              if (!dup) {
                this.contactdataSource.data.splice(this.editIndex, 1);
                this.contactdataSource.data.push(dialogResponse);
                this.contactdataSource._updateChangeSubscription();
              } else {
                this._commonService.openSnackbar(
                  "You can not add duplicate data",
                  snackbarStatus.Danger
                );
              }
            } else {
              this.contactdataSource = new MatTableDataSource([dialogResponse]);
            }
          } else if (Action == "deletePersonal") {
            this.contactdataSource.data.splice(this.deleteIndex, 1);
            this.contactdataSource._updateChangeSubscription();
          }
        }
      },
      (err) => {}
    );
  }

  reject(value) {
    const action = "reject";
    const panel = "delete-dialog";
    this.openConfirmationDialogBox(action, value, panel);
  }

  getGeoLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position) {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          this.personalInformationForm.controls["Latitude"].setValue(
            this.latitude
          );
          this.personalInformationForm.controls["Logitude"].setValue(
            this.longitude
          );
        }
      },
      (err) => {}
    );
  }
  value() {}

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
        k == 47 ||
        k == 35
      );
    } else if (str == "Number") {
      return k >= 48 && k <= 57;
    }
  }

  getpersonalFormDetails() {
    this._personalInfo
      .getPersonalInfoByTransId(this.transId)
      .subscribe((response) => {
        const pincode  = response.Pincode;

        this.NepalCode.forEach((code)=>{
          if(pincode.startsWith(code)){
            this.nepalCodes = true;
          }
        })
        this._emitter.emitNepalCode(this.nepalCodes)

        // this.NepalCode.forEach((code)=>{
        //   if(pincode.startsWith(code)){
        //     this._emitter.emitNepalCode(true);
        //   }else{
        //     if(response.Logitude || response.Latitude){
        //       this._emitter.emitNepalCode(true);
        //     }else{
        //       this._emitter.emitNepalCode(false);
        //     }
        //   }
        // });

        // this._masterService.categoryEmitter(response.category);
        this.dropDownData(response);
        this.personalInfoPatchvalue(response);
        this.saveLocalStorage(response);
        this.contactdataSource = new MatTableDataSource(response.FirmStatuses);
        this.firmStatus = response.firmStatus;
      });
  }

  initializingPersonalForm() {
    this.personalInformationForm = this._formBuilder.group({
      Category: ["", [Validators.required]],
      Product: [[], Validators.required],
      Name: ["", [Validators.required]],
      State: ["", [Validators.required]],
      District: ["", [Validators.required]],
      Address: ["", Validators.required],
      City: ["", [Validators.required]],
      Pincode: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{5,6}$")],
      ],
      Taluk: ["", [Validators.required]],
      FirmStatus: [""],
      Latitude: [""],
      Logitude: [""],
      Tehsil: [""],
    });
  }

  personalInfoPatchvalue(personalValues) {
    if (personalValues?.Product) {
      personalValues.Product = personalValues.Product.split(",");
    } else {
      personalValues.Product = [];
    }
    this.personalInformationForm.patchValue(personalValues);
    this._emitter.emitCategory(personalValues.Category);
    this._emitter.emitFirmStatus(personalValues.FirmStatus);

   // console.log("personalinfoForm",personalValues.Pincode)
    const pincode  = personalValues.Pincode
    this.NepalCode.forEach((code)=>{
      if(pincode.startsWith(code)){
        this._emitter.emitNepalCode(true);
        // localStorage.setItem("IsNepal",String(true));
      }else{
        this._emitter.emitNepalCode(false);
        // localStorage.setItem("IsNepal",String(false));
      }
    })

  }

  orgInfoPatchvalue(additionalData) {
    this.personalInformationForm.patchValue(additionalData);
  }

  savePersonalInfo(): void {
    let personalForm = new PersonalInfo();
    personalForm = this.formPersnalDetails();
    // console.log("personal", personalForm);
    this.savePersonalInformation = true;
    if (!this.personalInformationForm.valid) {
      this.personalInformationForm.markAllAsTouched();
      return;
    } else {
      const pincode = personalForm.Pincode


      this.NepalCode.forEach((code)=>{
        if(pincode.startsWith(code)){
          this.nepalCodes = true;
        }
        // else{
        //   if(personalForm.Latitude || personalForm.Logitude){
        //           this.nepalCodes = false;
        //         }else{
        //           this.nepalCodes = true;
        //         }
        // }
      })
      // console.log("nepalCOdesSave",this.nepalCodes)
      this._emitter.emitNepalCode(this.nepalCodes)
      // this.NepalCode.forEach((code)=>{
      //   if(pincode.startsWith(code)){
      //     this._emitter.emitNepalCode(true);
      //     // localStorage.setItem("IsNepal",String(true));
      //   }else{
      //     if(personalForm.Latitude || personalForm.Logitude){
      //       this._emitter.emitNepalCode(true);
      //     }else{
      //       this._emitter.emitNepalCode(false);
      //     }
      //
      //     // localStorage.setItem("IsNepal",String(false));
      //   }
      // })
      this._personalInfo.createPersonalInfo(personalForm).subscribe(
        (response) => {
          localStorage.setItem("firmstatus", personalForm.FirmStatus);
          localStorage.setItem("categorytype", personalForm.Category);
          if (this.userData.Role != "ASM" && this.userData.Role != "Customer") {
            this._customerLog.createLogDetails(
              this.userData,
              "updated personal Information"
            );
          }

          this._commonService.openSnackbar(
            "Personal information saved successfully",
            snackbarStatus.Success,
            2000
          );
          this.nextTab.emit("market_information");
          this.getpersonalFormDetails();
          this.disableForm();
          this.event.emit(this.personalInformationForm.valid);
        },
        (err) => {
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
          this.enableForm();
        }
      );
    }
  }

  formPersnalDetails(): PersonalInfo {
    let personalDetails = new PersonalInfo();
    personalDetails = this.formingPersonalInformationForm();
    const contDetails = [];

    for (let i = 0; i < this.contactdataSource.data.length; i++) {
      contDetails[i] = this.contactdataSource.data[i];
    }
    personalDetails.FirmStatuses = contDetails;
    personalDetails.OrganisationInputs = new OrganisationInputs();
    return personalDetails;
  }

  contactDetailsBuild(value): FirmDetails {
    const firmStatuses = new FirmDetails();
    firmStatuses.PersonName = value.PersonName;
    firmStatuses.Email = value.Email;
    firmStatuses.Mobile = value.mobile;
    return firmStatuses;
  }

  formingPersonalInformationForm(): PersonalInfo {
    let personalData = new PersonalInfo();
    personalData = this.personalInformationForm.value;
    if (
      this.personalInformationForm.get("Product").value != null &&
      this.personalInformationForm.get("Product").value.length > 0
    ) {
      personalData.Product = this.personalInformationForm
        .get("Product")
        .value.join(",");
    } else personalData.Product = null;

    personalData.Id = Number(this.Id);
    personalData.TransId = this.transId;
    personalData.Status = "Initiated";
    personalData.Role = this.role;
    personalData.CreatedBy = this.CreatedBy;
    personalData.CreatedOn = this.CreatedOn;
    personalData.UpdatedOn = new Date();
    personalData.UpdatedBy = this.userData.PositionId;
    personalData.Latitude = this.personalInformationForm
      .get("Latitude")
      .value.toString();
    personalData.Logitude = this.personalInformationForm
      .get("Logitude")
      .value.toString();
    personalData.Pincode = this.personalInformationForm
      .get("Pincode")
      .value.toString();
    return personalData;
  }

  saveLocalStorage(value) {
    this.transId = value.TransId;
    this.Id = value.Id;
    this.CreatedOn = new Date(value.CreatedOn);
    this.CreatedBy = value.CreatedBy;
  }

  getAllMasters() {
    forkJoin([
      this._masterService.getStates(),
      this._masterService.getCategories(),
      this._masterService.getDivisionMaterialMap(),
    ]).subscribe({
      next: (res) => {
        this.states = res[0] as State[];
        this.categories = res[1] as TypeOfCategory[];
        res[2].forEach((ele) => {
          ele.MaterialGroup != null
            ? this.products.push(ele.MaterialGroup)
            : {};
        });
        this.getpersonalFormDetails();
        this.loader = false;
      },
    });
  }

  getDistrictsByStCode(stCode: string) {
    this._masterService.getDistrictsByStateCode(stCode).subscribe({
      next: (res) => {
        this.personalInformationForm.get("District").patchValue(null);
        this.districts = res as District[];
        if (this.selectedDistict != null && this.selectedDistict != "") {
          this.personalInformationForm
            .get("District")
            .patchValue(this.selectedDistict);
        }
      },
    });
  }

  OnFocusOut(event, str) {
    if (str == "pincode") {
      if (event.target.value.length >= 5) {
        this._personalInfo.GetRecGeoLocation(event.target.value).subscribe({
          next: (res) => {
            if (res.valid) {
              this.personalInformationForm
                .get("Latitude")
                .patchValue(res.locations[0].lat);
              this.personalInformationForm
                .get("Logitude")
                .setValue(res.locations[0].lng);
            }
          },
          error: (error) => {
            this._commonService.openSnackbar(
              error instanceof HttpErrorResponse
                ? error.message
                : "Something went wrong",
              snackbarStatus.Danger
            );
          },
        });
      }
    }
  }

  // OnFocusOut(event, str) {
  //   if (str == "pincode") {
  //     if (event.target.value.length >= 5) {
  //       this.NepalCode.forEach((code)=>{
  //         if(event.target.value.startsWith(code)){
  //
  //
  //         }else{
  //           this._personalInfo.GetRecGeoLocation(event.target.value).subscribe({
  //             next: (res) => {
  //               if (res.valid) {
  //                 this.personalInformationForm
  //                   .get("Latitude")
  //                   .patchValue(res.locations[0].lat);
  //                 this.personalInformationForm
  //                   .get("Logitude")
  //                   .setValue(res.locations[0].lng);
  //               }
  //             },
  //             error: (error) => {
  //               this._commonService.openSnackbar(
  //                 error instanceof HttpErrorResponse
  //                   ? error.message
  //                   : "Something went wrong",
  //                 snackbarStatus.Danger
  //               );
  //             },
  //           });
  //         }
  //       })
  //
  //
  //     }
  //   }
  // }

  valueChangeEvents() {
    this.personalInformationForm.get("State").valueChanges.subscribe({
      next: (res) => {
        if (this.districts.length <= 0) {
          if (res != null && res != "") this.getDistrictsByStCode(res);
        }
      },
    });

    this.personalInformationForm.get("Category").valueChanges.subscribe({
      next: (res) => {
        this._emitter.emitCategory(res);
      },
    });
    this.personalInformationForm.get("FirmStatus").valueChanges.subscribe({
      next: (res) => {
        this._emitter.emitFirmStatus(res);
      },
    });
  }

  SelectionChanges(event, str) {
    if (event != null && event != "") this.getDistrictsByStCode(event);
  }

  editClick() {
    this.enableForm();
  }

  dropDownData(response) {
    this.selectedCategory = response.Category;
    this.selectedDistict = response.District;
    this.selectedState = response.State;
    this.selectedStatusOfFirm = response.FirmStatus;
  }

  toggleSelection(checked: boolean): void {
    if (this.personalInformationForm) {
      if (checked) {
        this.personalInformationForm.get("Product").setValue(this.products);
      } else {
        this.personalInformationForm.get("Product").setValue([]);
      }
    }
  }

  isChecked(): boolean {
    if (this.personalInformationForm) {
      return (
        this.personalInformationForm.get("Product").value &&
        this.products.length &&
        this.personalInformationForm.get("Product").value.length ===
          this.products.length
      );
    }
  }

  cancel() {
    this.disableForm();
    this.getpersonalFormDetails();
  }

  disableForm() {
    this.editClicked = true;
    this.personalInformationForm.disable();
  }
  enableForm() {
    this.editClicked = false;
    this.personalInformationForm.enable();
  }
  onDropdownChange(value: string): void {
    const isMandatory = value === "Pvt Ltd";

    this._commonService.mandatorySubject.next(isMandatory);
  }
}
