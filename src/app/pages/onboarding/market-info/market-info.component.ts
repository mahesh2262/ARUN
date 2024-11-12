import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DialogBoxComponent } from "../../../Dialogs/dialog-box/dialog-box.component";
import { MatTableDataSource } from "@angular/material/table";
import { MarketInfoService } from "../../../Services/market-info.service";
import {
  GSTResult,
  MarketAvgSales,
  MarketInfo,
} from "../../../Models/onboardingModel";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { CustomerLogService } from "../../../Services/customer-log.service";
import { AppConfigService } from "../../../Services/app-config.service";
import { DocumentsService } from "../../../Services/documents.service";

import {
  isZeroValidation,
  isnonZeroValidation,
} from "../../../Customize/Validators/zeroValidation";
import { EmitterService } from "../../../Services/emitter.service";
export interface averageSales {
  Business: string;
  Brand: string;
  Unit: string;
  AvgMonthlySales: number;
}

@Component({
  selector: "ngx-market-info",
  templateUrl: "./market-info.component.html",
  styleUrls: ["./market-info.component.scss"],
})
export class MarketInfoComponent implements OnInit {
  displayedColoumns: string[] = [
    "BusinessType",
    "BrandName",
    "Unit",
    "AvgMonthlySales",
    "add",
  ];
  averageDataSource: MatTableDataSource<averageSales>;
  dataFromDialog: any[] = [];
  userData: any;
  readable: boolean = false;
  marketInformationForm: FormGroup;
  partyBackgrounds: string[] = [];
  selectPartyBackground: string[] = [];
  partyBackgroundData: any;
  deleteIndex: number;
  editIndex: number;
  saveMarketInformation: boolean = false;
  apiData: any;
  transId: number;
  Id: number;
  aversale: MarketAvgSales;
  partyBackgroundsData: any;
  editclick: boolean;
  GstResponse: any;
  selectedYear: number;
  currentYear = new Date().getFullYear();
  minYear: number;
  yearValidation: boolean = false;
  yearsList: number[] = [];
  panReadOnly: boolean = false;
  role: string;
  status: string;
  show: boolean = false;
  isPartyBackground: boolean = false;
  firmstatus: any;
  category: string;
  CINNoValidation: boolean;
  NepalCodeValidation : boolean;

  isGstMandatory: boolean = true;

  constructor(
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _marketInfoService: MarketInfoService,
    private _commonService: CommonService,
    private _customerLog: CustomerLogService,
    private _appConfig: AppConfigService,
    private _documentsService: DocumentsService,
    private _emitter: EmitterService
  ) {
    this.partyBackgrounds = this._appConfig.get("PARTY_BACKGROUND").split(",");
  }

  @Output() event = new EventEmitter<boolean>();
  @Output() nextTab = new EventEmitter<string>();
  ngOnInit(): void {
    const users = localStorage.getItem("userDetails");
    const transId = localStorage.getItem("transID");
    this.minYear = this._appConfig.get("MIN_YEAROFESTABLISHMENT_VALUE");
    this.transId = JSON.parse(transId);
    this.status = localStorage.getItem("status");
    if (users) {
      this.userData = JSON.parse(users);
      this.role = this.userData.Role;
      if (this.role == "NH" || this.role == "DH") {
        this.readable = true;
      }
    }
    this.getListOfYears();
    this.initiaizeMarketForm();
    this.panAndGstvalidation();
    this.getMarketInformation();
    // this.NepalCodeValid();

    if (this._commonService.accessShowHide(this.status, this.role)) {
      this.disableForm();
      this.show = true;
    }

    if (this.role == "ASM" && this.show) {
      this.enableForm();
    } else {
      this.disableForm();
    }

    this._emitter.statusOfFirmEmitter.subscribe({
      next: (data) => {
        this.firmstatus = data;
        if (this.firmstatus == "Pvt Ltd" || this.firmstatus == "Limited") {
          this.setCINValidation();
        } else {
          this.clearCINValidation();
        }
      },
    });

    this._emitter.categoryEmitter.subscribe({
      next: (res) => {
        this.category = res;
        if (res && res.toLowerCase().includes("ship to")) {
          this.clearPanMandatory();
        }
        if (
          res &&
          (res == "Stockist" ||
            res == "D2R Channel Partner" ||
            res == "Retail Stockist" ||
            res == "KAM" ||
            res == "IC" ||
            res == "KAM IC"||
            res == "PRABHARI")
        ) {
          this.setGSTValidation();
        } else {
          this.clearGSTValidation();
        }
      },
    });
  }

  NepalCodeValid(){
    this._emitter.IsNepalCode.subscribe((val)=>{
      // console.log("vals",val)
      this.NepalCodeValidation = val;
    })
  }

  valueChanges() {
    this.marketInformationForm
      .get("YearOfEstablishment")
      .valueChanges.subscribe({
        next: (data) => {
          if (data != null && data != "") {
            if (Number(data) < 1950 || Number(data) > 2100)
              this.yearValidation = true;
            else this.yearValidation = false;
          } else this.yearValidation = false;
        },
      });
  }

  getListOfYears() {
    for (let i = this.currentYear; i >= this.minYear; i--) {
      if (i < this.minYear) {
        break;
      } else {
        this.yearsList.push(i);
      }
    }
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
    } else if (str == "Pan") {
      return (k > 64 && k < 91) || (k >= 48 && k <= 57);
    } else if (str == "NumberAndName") {
      return (k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57);
    }
  }

  initiaizeMarketForm() {
    this.marketInformationForm = this._formBuilder.group({
      Market: [""],
      YearOfEstablishment: ["", Validators.required],
      Population: [0, [isnonZeroValidation]],
      ServeArea: [""],
      PotentialArea: ["", [Validators.required, isZeroValidation]],
      PartyPotential: ["", [Validators.required, isZeroValidation]],
      NoOfExistingStockist: [0, [isnonZeroValidation]],
      ExpectedAvgSale: ["", [Validators.required, isZeroValidation]],
      NearestStockistDistance: [0, [isnonZeroValidation]],
      PanNo: [
        "",
        [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
      ],
      NearestStockistName: [""],
      GstNo: [
        "",
        [
          Validators.pattern(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
          ),
        ],
      ],

      PartyBackground: [[]],
      CINNo: [""],
    });
  }

  partyBackground(event) {
    this.selectPartyBackground = event;
    if (this.selectPartyBackground) this.isPartyBackground = true;
    else this.isPartyBackground = false;
    // if (
    //   this.selectPartyBackground.includes("Wall Putty") ||
    //   this.selectPartyBackground.includes("White cement")
    // ) {
    //   this.isPartyBackground = true;
    // } else {
    //   this.isPartyBackground = false;
    // }
  }

  openDialogBox(type, partyBackground, panel) {
    const dialogconfig: MatDialogConfig = {
      data: {
        Action: type,
        partyBackground: partyBackground,
        partyBackgroundvalue: this.partyBackgroundData,
      },
      panelClass: panel,
    };
    const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(
      (dialogResponse) => {
        if (
          dialogResponse != false &&
          dialogResponse != "delete" &&
          dialogResponse.Actions != "edit"
        ) {
          if (
            this.averageDataSource != null &&
            this.averageDataSource != undefined &&
            this.averageDataSource.data.length > 0
          ) {
            this.averageDataSource.data.push(dialogResponse);
            this.averageDataSource._updateChangeSubscription();
          } else {
            this.averageDataSource = new MatTableDataSource([dialogResponse]);
          }
        } else if (dialogResponse == "delete") {
          this.averageDataSource.data.splice(this.deleteIndex, 1);
          this.averageDataSource._updateChangeSubscription();
        } else if (dialogResponse.Actions == "edit") {
          this.averageDataSource.data[this.editIndex] = dialogResponse;
          this.averageDataSource._updateChangeSubscription();
        }
      },
      (err) => {}
    );
  }

  addBrandDetails(partyBackgrounds) {
    const panel = "dialog-box";
    this.partyBackgroundData = [];
    this.openDialogBox("addBrand", partyBackgrounds, panel);
  }
  editBrandDeatils(partyBackgrounds, value, dd) {
    const panel = "dialog-box";
    this.partyBackgroundData = value;
    this.editIndex = dd;
    this.openDialogBox("editBrand", partyBackgrounds, panel);
  }
  deleteBrandDetails(dd) {
    const panel = "delete-dialog";
    this.openDialogBox("deleteBrand", "deleteBrand", panel);
    this.deleteIndex = dd;
  }

  saveMarketInfo(): void {
    this.saveMarketInformation = true;
    if (!this.marketInformationForm.valid) {
      this.marketInformationForm.markAllAsTouched();
      return;
    } else {
      let marketInformation = new MarketInfo();
      marketInformation = this.formMarketInformation();

      this._marketInfoService.createMarketInfo(marketInformation).subscribe({
        next: (res) => {
          if (this.userData.Role != "ASM" && this.userData.Role != "Customer") {
            this._customerLog.createLogDetails(
              this.userData,
              "updated market Information"
            );
          }
          this._commonService.openSnackbar(
            "Market information saved successfully",
            snackbarStatus.Success,
            2000
          );
          this.nextTab.emit("business_information");
          this.disableForm();
          this.event.emit(this.marketInformationForm.valid);
        },
        error: (err) => {
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
          this.enableForm();
        },
      });
    }
  }

  getMarketInformation() {
    this._marketInfoService.getMarketInfoByTransId(this.transId).subscribe(
      (response) => {
        if (response) {
          this.Id = response.Id;
          if (response.PartyBackground != null) {
            response.PartyBackground = response.PartyBackground.split(",");
          }
          this.marketInformationForm.patchValue(response);
          if (response.MarketAvgSales && response.MarketAvgSales.length > 0) {
            this.setMarketAvgSale(response.MarketAvgSales);
          }
        }
      },
      (err) => {}
    );
  }

  setMarketAvgSale(value) {
    this.averageDataSource = new MatTableDataSource(value);
  }

  formMarketInformation(): MarketInfo {
    let marketInformation = new MarketInfo();
    marketInformation = this.marketInformationForm.value;
    marketInformation.PartyBackground =
      this.marketInformationForm.value["PartyBackground"].join(",");
    marketInformation.TransId = this.transId;
    marketInformation.Id = this.Id;
    var avgmonthlySale: MarketAvgSales[] = [];

    if (this.averageDataSource && this.averageDataSource.data.length > 0) {
      this.averageDataSource.data.forEach((data) => {
        let temp: MarketAvgSales = new MarketAvgSales();
        temp.MarketId = 0;
        temp.Business = data["Business"];
        temp.Brand = data["Brand"];
        temp.Unit = data["Unit"];
        temp.AvgMonthlySales =
          typeof data["AvgMonthlySales"] != "number"
            ? Number(data["AvgMonthlySales"])
            : data["AvgMonthlySales"];
        avgmonthlySale.push(temp);
      });
    }
    marketInformation.MarketAvgSales = avgmonthlySale;
    return marketInformation;
  }

  editClicked() {
    this.enableForm();
  }

  enableForm() {
    this.editclick = false;
    this.marketInformationForm.enable();
  }
  disableForm() {
    this.editclick = true;
    this.marketInformationForm.disable();
  }

  cancel() {
    this.disableForm();
    this.getMarketInformation();
  }

  // OnFocusOut(event, str) {
  //   if (str === "gst") {
  //     if (
  //       event.target.value.length == 15 &&
  //       this.marketInformationForm.get("GstNo").valid
  //     ) {
  //       this._emitter.IsNepalCode.subscribe((val)=>{
  //         // console.log("val",val)
  //         if(val){
  //           this._marketInfoService.ValidateGST(event.target.value).subscribe({
  //             next: (response) => {
  //               var res = response as GSTResult;
  //               if (res.valid) {
  //                 this.GstResponse = response as GSTResult;
  //                 this.panReadOnly = true;
  //                 if (!this.marketInformationForm.get("PanNo").valid) {
  //                   this.marketInformationForm
  //                     .get("PanNo")
  //                     .patchValue(this.GstResponse.pan);
  //                 }
  //               } else {
  //                 this.panReadOnly = false;
  //               }
  //             },
  //           });
  //         }else{
  //           this.panReadOnly = false;
  //         }
  //       })
  //     } else {
  //       this.panReadOnly = false;
  //     }
  //   }
  // }
  //
  // panAndGstvalidation() {
  //   console.log("gst")
  //
  //   this._emitter.IsNepalCode.subscribe((res)=>{
  //     // console.log("val",res)
  //     if(res){
  //       this.marketInformationForm.get("GstNo").valueChanges.subscribe((value) => {
  //         if (
  //           value?.length == 15 &&
  //           this.marketInformationForm.get("GstNo").valid
  //         ) {
  //           this._marketInfoService.ValidateGST(value).subscribe({
  //             next: (response) => {
  //               var res = response as GSTResult;
  //               if (res.valid) {
  //                 this.GstResponse = response as GSTResult;
  //                 this.panReadOnly = true;
  //                 if (!this.marketInformationForm.get("PanNo").valid) {
  //                   this.marketInformationForm
  //                     .get("PanNo")
  //                     .patchValue(this.GstResponse.pan);
  //                 }
  //               } else {
  //                 this.panReadOnly = false;
  //               }
  //             },
  //           });
  //         } else {
  //           this.panReadOnly = false;
  //         }
  //       });
  //     }else{
  //       this.panReadOnly = true;
  //     }
  //
  //
  //     this.marketInformationForm.get("PanNo").valueChanges.subscribe((value) => {
  //       if (this.isCinRequired()) {
  //         this.setCINValidation();
  //       } else {
  //         this.clearCINValidation();
  //       }
  //     });
  //   })
  //
  // }

  OnFocusOut(event, str) {

    if (str === "gst") {
      if (
        event.target.value.length == 15 &&
        this.marketInformationForm.get("GstNo").valid
      ) {
        this.NepalCodeValid();
        this._marketInfoService.ValidateGST(event.target.value).subscribe({
          next: (response) => {
            var res = response as GSTResult;
            if (res.valid) {
              this.GstResponse = response as GSTResult;
              this.panReadOnly = true;
              if (!this.marketInformationForm.get("PanNo").valid) {
                this.marketInformationForm
                  .get("PanNo")
                  .patchValue(this.GstResponse.pan);
              }
            } else {
              this.panReadOnly = false;
            }
          },
        });
      } else {
        this.panReadOnly = false;
      }
    }
  }

  panAndGstvalidation() {
    this.NepalCodeValid();
    this.marketInformationForm.get("GstNo").valueChanges.subscribe((value) => {
      if (
        value?.length == 15 &&
        this.marketInformationForm.get("GstNo").valid
      ) {

        // console.log("nepall",this.NepalCodeValidation)
        if(!this.NepalCodeValidation){
          this._marketInfoService.ValidateGST(value).subscribe({
            next: (response) => {
              var res = response as GSTResult;
              if (res.valid) {
                this.GstResponse = response as GSTResult;
                this.panReadOnly = true;
                if (!this.marketInformationForm.get("PanNo").valid) {
                  this.marketInformationForm
                    .get("PanNo")
                    .patchValue(this.GstResponse.pan);
                }
              } else {
                this.panReadOnly = false;
              }
            },
          });
        }else{
          this.panReadOnly = true;
        }
      } else {
        this.panReadOnly = false;
      }
    });

    this.marketInformationForm.get("PanNo").valueChanges.subscribe((value) => {
      if (this.isCinRequired()) {
        this.setCINValidation();
      } else {
        this.clearCINValidation();
      }
    });
  }

  setCINValidation() {
    this.marketInformationForm.get("CINNo")?.clearValidators();
    this.marketInformationForm
      .get("CINNo")
      ?.addValidators([
        Validators.required,
        Validators.pattern(
          /^[LUu]{1}[0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}$/
        ),
      ]);
    this.marketInformationForm.get("CINNo")?.updateValueAndValidity();
  }

  clearCINValidation() {
    this.marketInformationForm.get("CINNo")?.clearValidators();
    this.marketInformationForm.get("CINNo")?.updateValueAndValidity();
  }

  setGSTValidation() {
    this.isGstMandatory = true;
    this.marketInformationForm.get("GstNo")?.clearValidators();
    this.marketInformationForm
      .get("GstNo")
      ?.addValidators([
        Validators.required,
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
        ),
      ]);
    this.marketInformationForm.get("GstNo")?.updateValueAndValidity();
  }

  clearGSTValidation() {
    this.isGstMandatory = false;
    this.marketInformationForm.get("GstNo")?.clearValidators();
    this.marketInformationForm.get("GstNo")?.updateValueAndValidity();
  }

  setPanMandatory() {
    this.marketInformationForm.get("PanNO").clearValidators();
    this.marketInformationForm
      .get("PanNo")
      .addValidators([
        Validators.required,
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
      ]);
    this.marketInformationForm.get("PanNo").updateValueAndValidity();
  }

  clearPanMandatory() {
    this.marketInformationForm.get("PanNo").clearValidators();
    this.marketInformationForm.get("PanNo").updateValueAndValidity();
  }

  isCinRequired(): boolean {
    let val = this.marketInformationForm.get("PanNo").value;
    return (
      (val.length == 10 && val.split("")[3] == "C") ||
      this.firmstatus == "Pvt Ltd" ||
      this.firmstatus == "Limited"
    );
  }
}
