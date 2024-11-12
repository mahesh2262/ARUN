import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  PersonalInfo,
  FirmDetails,
  OrganisationInputs,
} from "../../../Models/onboardingModel";
import { PersoanlInfoService } from "../../../Services/persoanl-info.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { DialogBoxComponent } from "../../../Dialogs/dialog-box/dialog-box.component";
import { MatTableDataSource } from "@angular/material/table";
import { MasterService } from "../../../Services/master.service";
import { forkJoin } from "rxjs";
import { MarketInfoService } from "../../../Services/market-info.service";
import {
  State,
  AccountGroup,
  DistributionChannel,
  Division,
  Region,
  TypeOfCategory,
  District,
  SalesOrganization,
} from "../../../Models/MasterModel";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import {AppConfigService} from "../../../Services/app-config.service";

@Component({
  selector: "ngx-initiator-screen",
  templateUrl: "./initiator-screen.component.html",
  styleUrls: ["./initiator-screen.component.scss"],
})
export class InitiatorScreenComponent implements OnInit {
  name: string;
  mobile: number;
  emailId: string;
  displayedColumns: string[] = ["PersonName", "Mobile", "Email", "add"];
  contactdataSource: MatTableDataSource<FirmDetails> = new MatTableDataSource();
  Latitude: number;
  Longitude: number;
  Address: string;
  readonly position = { lat: 51.678418, lng: 7.809007 };
  userData: any;
  readable: boolean = false;
  personalInfoForm: FormGroup;
  categories: TypeOfCategory[] = [];
  products: string[] = [];
  states: State[] = [];
  districts: District[] = [];
  accountGroups: AccountGroup[] = [];
  distributionChannels: DistributionChannel[] = [];
  salesOrganizations: SalesOrganization[] = [];
  divisions: Division[] = [];
  regions: Region[] = [];
  selectedCategory: string;
  selectedProduct: string;
  selectedState: string;
  selectedDistrict: string;
  selectedAccountGroup: string;
  selectedDistributionChannel: string;
  selectedsaleOrganization: string;
  selectedDivision: string;
  selectedRegion: string;
  statusOfFirms: string[] = [
    "Proprietor",
    "Partnership",
    "Huf",
    "Pvt Ltd",
    "Limited",
  ];
  selectedStatusOfFirm: string;
  loader: boolean = false;
  addButton: boolean = true;
  dataFromDialog: any[] = [];
  editIndex: number;
  deleteIndex: number;
  Id: Number;
  firmStatus: string;
  role: string;
  submitted: boolean = false;
  drafted: boolean = false;
  status: string;
  users: any;
  positionId: string;
  NepalCode: string[] = [];

  @ViewChild("search")
  public searchElementRef: ElementRef;
  constructor(
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private personalService: PersoanlInfoService,
    private _commonService: CommonService,
    private _masterService: MasterService,
    private _router: Router,
    private _marketInfoService : MarketInfoService,
    private _appConfig: AppConfigService
  ) {}

  ngOnInit(): void {
    this.getAllMasters();
    this.initializingPersonalForm();
    this.getLocalStorageData();
    this.valueChangeEvents();
    this.NepalCode = this._appConfig.get("Nepal_PinCode").split(",");

  }

  getGeoLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position) {
          this.Latitude = position.coords.latitude;
          this.Longitude = position.coords.longitude;

          this.personalInfoForm.controls["Latitude"].setValue(this.Latitude);
          this.personalInfoForm.controls["Logitude"].setValue(this.Longitude);
        }
      },
      (err) => {}
    );
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
        k == 47 ||
        k == 35
      );
    } else if (str == "Number") {
      return k >= 48 && k <= 57;
    }
  }

  initializingPersonalForm() {
    this.personalInfoForm = this._formBuilder.group({
      Category: ["", Validators.required],
      Product: [[], Validators.required],
      Name: ["", Validators.required],
      State: ["", Validators.required],
      District: ["", Validators.required],
      Address: ["", Validators.required],
      City: ["", Validators.required],
      Pincode: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{5,6}$")],
      ],
      Taluk: ["", Validators.required],
      Latitude: [""],
      Logitude: [""],
      FirmStatus: ["", Validators.required],
    });
  }

  addPersonalDetails() {
    const action = "addPersonal";
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: action,
      },
      panelClass: "dialog-box",
    };
    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (dialogResponse) => {
        if (dialogResponse != false && dialogResponse.action != "close") {
          let dup = false;
          if (this.contactdataSource.data.length > 0) {
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

  clearForm() {
    this.contactdataSource = new MatTableDataSource();
    this.personalInfoForm.reset();
  }

  changeLocation(selectedValue) {
    if (selectedValue != null && selectedValue != "") {
      this.addButton = false;
    }
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

  getAllMasters() {
    forkJoin([
      this._masterService.getStates(),
      this._masterService.getAccountGroup(),
      this._masterService.getDistributionChannel(),
      this._masterService.getDivisionMaterialMap(),
      this._masterService.getDivisions(),
      this._masterService.getRegions(),
      this._masterService.getCategories(),
    ]).subscribe({
      next: (res) => {
        this.states = res[0] as State[];
        this.accountGroups = res[1] as AccountGroup[];
        this.distributionChannels = res[2] as DistributionChannel[];
        res[3].forEach((ele) => {
          ele.MaterialGroup != null
            ? this.products.push(ele.MaterialGroup)
            : {};
        });
        this.divisions = res[4] as Division[];
        this.regions = res[5] as Region[];
        this.categories = res[6] as TypeOfCategory[];
      },
    });
  }

  submit(value) {
    this.status = value;
    if (value == "Draft") {
      this.drafted = this.isValidForDraft();
      if (!this.drafted) {
        return;
      } else {
        if (
          this.contactdataSource == null ||
          this.contactdataSource.data.length == 0
        ) {
          this._commonService.openSnackbar(
            `Please add contact Details`,
            snackbarStatus.Warning,
            3000
          );
          return;
        }
        this.loader = true;
        let personalForm = new PersonalInfo();
        personalForm = this.formPersnalDetails();
        this.personalService.createPersonalInfo(personalForm).subscribe(
          (response) => {
            this.loader = false;
            this._commonService.openSnackbar(
              `Drafted successfully`,
              snackbarStatus.Success,
              3000
            );
            this._router.navigate(["/pages/dashboard"]);
          },
          (err) => {
            this.loader = false;
            this._commonService.openSnackbar(err, snackbarStatus.Danger, 2000);
          }
        );
      }
    } else if ("Initiated") {
      this.submitted = true;
      // this.drafted = false;
      if (!this.personalInfoForm.valid) {
        this._commonService.openSnackbar(
          "Please fill all the fields",
          snackbarStatus.Warning,
          2500
        );
        return;
      } else {
        if (!this.submitted) {
          return;
        } else {
          if (
            this.contactdataSource == null ||
            this.contactdataSource.data.length == 0
          ) {
            this._commonService.openSnackbar(
              `Please add contact Details`,
              snackbarStatus.Warning,
              3000
            );
            return;
          }
          this.loader = true;
          let personalForm: PersonalInfo;
          personalForm = this.formPersnalDetails();

          this.personalService.createPersonalInfo(personalForm).subscribe(
            (response) => {
              this.loader = false;
              this._commonService.openSnackbar(
                `Created successfully`,
                snackbarStatus.Success,
                3000
              );
              this._router.navigate(["/pages/dashboard"]);
            },
            (err) => {
              this.loader = false;
              this._commonService.openSnackbar(
                err,
                snackbarStatus.Danger,
                2000
              );
            }
          );
        }
      }
    }
  }

  isValidForDraft(): boolean {
    if (
      this.personalInfoForm.get("Category").valid &&
      this.personalInfoForm.get("Name").valid &&
      this.personalInfoForm.get("FirmStatus").valid
    ) {
      return true;
    } else {
      this.personalInfoForm.get("Category").markAsTouched();
      this.personalInfoForm.get("Name").markAsTouched();
      this.personalInfoForm.get("FirmStatus").markAsTouched();

      return false;
    }
  }

  formPersnalDetails(): PersonalInfo {
    let personalDetails: PersonalInfo;
    personalDetails = this.formingpersonalInfoForm();
    const contDetails = [];
    for (let i = 0; i < this.contactdataSource.data.length; i++) {
      contDetails[i] = this.contactDetailsBuild(this.contactdataSource.data[i]);
    }
    personalDetails.FirmStatuses = contDetails;
    personalDetails.OrganisationInputs = new OrganisationInputs();
    return personalDetails;
  }

  contactDetailsBuild(value): FirmDetails {
    const firmStatuses = new FirmDetails();
    firmStatuses.PersonName = value.PersonName;
    firmStatuses.Email = value.Email;
    firmStatuses.Mobile = value.Mobile;
    return firmStatuses;
  }

  formingpersonalInfoForm(): PersonalInfo {
    const personalData = new PersonalInfo();
    personalData.Address = this.personalInfoForm.get("Address").value;
    personalData.Category = this.personalInfoForm.get("Category").value;
    personalData.City = this.personalInfoForm.get("City").value;
    personalData.District = this.personalInfoForm.get("District").value;
    if (
      this.personalInfoForm.get("Product").value != null &&
      this.personalInfoForm.get("Product").value.length > 0
    ) {
      personalData.Product = this.personalInfoForm
        .get("Product")
        .value.join(",");
    } else {
      personalData.Product = null;
    }
    personalData.Latitude = this.personalInfoForm
      .get("Latitude")
      .value.toString();
    personalData.Logitude = this.personalInfoForm
      .get("Logitude")
      .value.toString();
    personalData.Pincode = this.personalInfoForm
      .get("Pincode")
      .value.toString();
    personalData.Name = this.personalInfoForm.get("Name").value;
    personalData.State = this.personalInfoForm.get("State").value;
    personalData.Taluk = this.personalInfoForm.get("Taluk").value;
    personalData.FirmStatus = this.personalInfoForm.get("FirmStatus").value;
    personalData.Status = this.status;
    personalData.Role = this.role;
    personalData.CreatedBy = this.positionId;
    return personalData;
  }

  getLocalStorageData() {
    const users = localStorage.getItem("userDetails");
    this.users = JSON.parse(users);
    this.role = this.users.Role;
    this.positionId = this.users.PositionId;
  }

  getDistrictsByStCode(stCode: string) {
    this._masterService.getDistrictsByStateCode(stCode).subscribe({
      next: (res) => {
        this.personalInfoForm.get("District").patchValue(null);
        this.districts = res as District[];
      },
    });
  }

  OnFocusOut(event, str) {
    if (str == "pincode") {
      if (event.target.value.length >= 5) {
        this.NepalCode.forEach((code)=>{
          if(event.target.value.startsWith(code)){
            // this._commonService.openSnackbar(
            //   "Kindly",
            //   snackbarStatus.Danger
            // );
          }else{
            this.personalService.GetRecGeoLocation(event.target.value).subscribe({
              next: (res) => {
                if (res.valid) {
                  this.personalInfoForm
                    .get("Latitude")
                    .patchValue(res.locations[0].lat);
                  this.personalInfoForm
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
        })


      }
    }
  }

  valueChangeEvents() {
    this.personalInfoForm.get("State").valueChanges.subscribe({
      next: (res) => {
        if (res != null && res != "") this.getDistrictsByStCode(res);
      },
    });

    // this.personalInfoForm.get("Pincode").valueChanges.subscribe({
    //   next: (res) => {
    //     if (res.length == 6) {
    //       this.personalService.GetRecGeoLocation(res).subscribe({
    //         next: (res) => {
    //           if (res.valid) {
    //             this.personalInfoForm
    //               .get("Latitude")
    //               .patchValue(res.locations[0].lat);
    //             this.personalInfoForm
    //               .get("Logitude")
    //               .setValue(res.locations[0].lng);
    //           }
    //         },
    //         error: (error) => {
    //           this._commonService.openSnackbar(
    //             error instanceof HttpErrorResponse
    //               ? error.message
    //               : "Something went wrong",
    //             snackbarStatus.Danger
    //           );
    //         },
    //       });
    //     }
    //   },
    // });
  }

  toggleSelection(checked: boolean): void {
    if (this.personalInfoForm) {
      if (checked) {
        this.personalInfoForm.get("Product").setValue(this.products);
      } else {
        this.personalInfoForm.get("Product").setValue([]);
      }
    }
  }

  isChecked(): boolean {
    if (this.personalInfoForm) {
      return (
        this.personalInfoForm.get("Product").value &&
        this.products.length &&
        this.personalInfoForm.get("Product").value.length ===
          this.products.length
      );
    }
  }
}
