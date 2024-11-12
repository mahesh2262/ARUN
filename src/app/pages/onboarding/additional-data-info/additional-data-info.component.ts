import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable,forkJoin,of } from "rxjs";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import {
  State,
  District,
  AccountGroup,
  DistributionChannel,
  Region,
  Division,
  SalesOrganization,
  TypeOfCategory,
  AdditionalDataCommonMaster,
} from "../../../Models/MasterModel";
import { OrganisationInputs } from "../../../Models/onboardingModel";
import { AdditionalDataService } from "../../../Services/additional-data.service";
import { CommonService } from "../../../Services/common.service";
import { MasterService } from "../../../Services/master.service";
import { AppConfigService } from "../../../Services/app-config.service";
import { EmitterService } from "../../../Services/emitter.service";
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: "ngx-additional-data-info",
  templateUrl: "./additional-data-info.component.html",
  styleUrls: ["./additional-data-info.component.scss"],
})
export class AdditionalDataInfoComponent implements OnInit {
  @Input() customerGrp: string;
  orgGroupForm: FormGroup;
  savePersonalInformation: boolean = false;
  loader: boolean = false;
  editclick: boolean;
  transID: number;
  userData: any;
  accGroup : AccountGroup[] = [];
  accountGroups: AccountGroup[] = [];
  distChannels: DistributionChannel[] = [];
  distributionChannels: DistributionChannel[] = [];
  division: Division[] = [];
  divisions: Division[] = [];
  region: Region[] = [];
  regions: Region[] = [];
  saleOrginization: string;
  salesOrganizations: SalesOrganization[] = [];
  saleOrg: SalesOrganization[] = [];

  accAssignmentGroup: AdditionalDataCommonMaster[] = [];
  accAssGroup : AdditionalDataCommonMaster[] = [];
  customerGroup: AdditionalDataCommonMaster[] = [];
  cGroup: AdditionalDataCommonMaster[] = [];
  customerPricongProcedure: AdditionalDataCommonMaster[] = [];
  cPricongProcedure: AdditionalDataCommonMaster[] = [];
  customerStatistics: AdditionalDataCommonMaster[] = [];
  cStatistics: AdditionalDataCommonMaster[] = [];
  deliveryPriority: AdditionalDataCommonMaster[] = [];
  deliveryPrioritys: AdditionalDataCommonMaster[] = [];
  incoTerms: AdditionalDataCommonMaster[] = [];
  incoTerm: AdditionalDataCommonMaster[] = [];
  paymentMethod: AdditionalDataCommonMaster[] = [];
  paymentTerms: AdditionalDataCommonMaster[] = [];
  paymentTerm: AdditionalDataCommonMaster[] = [];
  priceGroup: AdditionalDataCommonMaster[] = [];
  priceGroups: AdditionalDataCommonMaster[] = [];
  priceList: AdditionalDataCommonMaster[] = [];
  reconcilationAccount: AdditionalDataCommonMaster[] = [];
  reconcilationAccounts: AdditionalDataCommonMaster[] = [];
  salesDistrict: AdditionalDataCommonMaster[] = [];
  salesOffices: AdditionalDataCommonMaster[] = [];
  salesOffice: AdditionalDataCommonMaster[] = [];
  salesGroup: AdditionalDataCommonMaster[] = [];
  salesGrouped: AdditionalDataCommonMaster[] = [];
  shippingCondition: AdditionalDataCommonMaster[] = [];
  shippingConditions: AdditionalDataCommonMaster[] = [];
  companyCode: AdditionalDataCommonMaster[] = [];
  cCode: AdditionalDataCommonMaster[] = [];
  attribute2List: AdditionalDataCommonMaster[] = [];
  attributetwoList: AdditionalDataCommonMaster[] = [];
  attribute6List: AdditionalDataCommonMaster[] = [];
  attributesixList: AdditionalDataCommonMaster[] = [];
  attribute9List: AdditionalDataCommonMaster[] = [];
  attributenineList: AdditionalDataCommonMaster[] = [];
  Industries: AdditionalDataCommonMaster[] = [];
  Industri : AdditionalDataCommonMaster[] = [];
  salesDistrictFilterData: AdditionalDataCommonMaster[] = [];
  salesDistrictData: AdditionalDataCommonMaster[] = [];
  priceListFilterData: AdditionalDataCommonMaster[] = [];
  priceListData: AdditionalDataCommonMaster[] = [];
  status: string;
  role: string;
  show: boolean = false;

  oldRecord: OrganisationInputs;

  selectedSG: string;
  selectedSD: string;
  selectedPriceList: string;
  category: string = "";

  // accountGroupOptions$: Observable<AccountGroup[]>;


  constructor(
    private _formBuilder: FormBuilder,
    private _masterService: MasterService,
    private _addtDataService: AdditionalDataService,
    private _commonService: CommonService,
    private _appConfig: AppConfigService,
    private _emitter: EmitterService
  ) {}

  ngOnInit(): void {
    this.initializingAdditionaldataForm();
    this.valueChanges();

    this._emitter.categoryEmitter.subscribe({
      next: (res) => {
        if (res != null && res != "" && res != undefined) {
          this.category = res;
          if (res.toLowerCase().includes("ship to")) {
            this.addSoldToPartyValidation();
          } else {
            this.clearSoldToPartyValidation();
          }
          this.getDefaultData(res);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.transID = parseInt(localStorage.getItem("transID"));
    this.status = localStorage.getItem("status");
    this.getAllMasters();






    const users = localStorage.getItem("userDetails");
    if (users) {
      this.userData = JSON.parse(users);
      this.role = this.userData.Role;
    }
    if (this._commonService.accessShowHide(this.status, this.role)) {
      this.disableForm();
      this.show = true;
    }

    if ((this.role == "ASM" || this.role == "RA") && this.show) {
      this.enableForm();
    } else {
      this.disableForm();
    }
  }

  initializingAdditionaldataForm() {
    this.orgGroupForm = this._formBuilder.group({
      AccountGroup: ["", Validators.required],
      DistributionChannel: ["", Validators.required],
      SalesOrg: ["", Validators.required],
      Division: ["", Validators.required],
      Region: ["", Validators.required],
      Company: ["", Validators.required],
      Industry: ["", Validators.required],
      CustomerGroup: ["", Validators.required],
      AccountAssessmentGroupCustomer: ["", Validators.required],
      Attribute2: ["", Validators.required],
      Attribute6: ["", Validators.required],
      Attribute9: ["", Validators.required],
      CustomerPricingProcedure: ["", Validators.required],
      CustomerStatisticsGroup: ["", Validators.required],
      DeliveryPlant: ["", Validators.required],
      DeliveryPriority: ["", Validators.required],
      Incoterms: ["", Validators.required],
      PODTimeFrame: [""],
      PaymentTerms: ["", Validators.required],
      PriceGroup: ["", Validators.required],
      PriceList: ["", Validators.required],
      ReconciliationAccount: ["", Validators.required],
      SalesDistrict: ["", Validators.required],
      SalesGroup: ["", Validators.required],
      SalesOffice: ["", Validators.required],
      ShippingCondition: ["", Validators.required],
      SoldToParty: [""],
    });
  }

  valueChanges() {
    this.orgGroupForm.get("SalesOffice").valueChanges.subscribe({
      next: (res) => {
        if (this.salesGroup.length <= 0) {
          if (res != null && res != "" && res != undefined) {
            this.salesGroup = [];
            this.orgGroupForm.get("SalesGroup").patchValue(null);
            // Get Saled Group Data
            this._masterService.getSalesGroupBysoCode(res).subscribe({
              next: (result) => {
                this.salesGroup = result as AdditionalDataCommonMaster[];
                this.salesGrouped = result as AdditionalDataCommonMaster[];
                if (this.selectedSG)
                  this.orgGroupForm
                    .get("SalesGroup")
                    .patchValue(this.selectedSG);
              },
            });
          }
        }
      },
    });

    this.orgGroupForm.get("Region").valueChanges.subscribe({
      next: (result: string) => {
        if (
          this.salesDistrictFilterData.length <= 0 ||
          this.priceListFilterData.length <= 0
        ) {
          if (result != null && result != "" && result != undefined) {
            this.salesDistrictFilterData = [];
            this.orgGroupForm.get("SalesDistrict").patchValue(null);

            this.salesDistrictFilterData = this.salesDistrict.filter((d) => {
              if (d.Code.startsWith(result.substring(0, 2))) {
                return d;
              }
            });

            this.salesDistrictData = this.salesDistrict.filter((d) => {
              if (d.Code.startsWith(result.substring(0, 2))) {
                return d;
              }
            });
            if (this.selectedSD)
              this.orgGroupForm
                .get("SalesDistrict")
                .patchValue(this.selectedSD);

            this.priceListFilterData = [];
            this.orgGroupForm.get("PriceList").patchValue(null);
            this.priceListFilterData = this.priceList.filter((p) => {
              if (p.Desc.startsWith(result.substring(0, 2))) {
                return p;
              }
            });
            this.priceListData = this.priceList.filter((p) => {
              if (p.Desc.startsWith(result.substring(0, 2))) {
                return p;
              }
            });
            if (this.selectedPriceList)
              this.orgGroupForm
                .get("PriceList")
                .patchValue(this.selectedPriceList);
          }
        }
      },
    });

    // this.orgGroupForm.get("AccountGroup").valueChanges.subscribe({
    //   next: (res) => {
    //     res == "Z100"
    //       ? this.orgGroupForm.get("Attribute2").enable()
    //       : this.orgGroupForm.get("Attribute2").disable();
    //   },
    //   error: (err) => {},
    // });

    // this.accountGroupOptions$ = this.orgGroupForm.get('AccountGroup').valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(filterString => this.filter(filterString)),
    //   );
    //
    // console.log("acc",this.accountGroupOptions$)


  }

  SelectionChanges(event, str) {
    if (str == "salesOffice") {
      if (event != null && event != "" && event != undefined) {
        this.salesGroup = [];
        this.orgGroupForm.get("SalesGroup").patchValue(null);
        // Get Saled Group Data
        this._masterService.getSalesGroupBysoCode(event).subscribe({
          next: (result) => {
            this.salesGroup = result as AdditionalDataCommonMaster[];
            this.salesGrouped = result as AdditionalDataCommonMaster[];
            if (this.selectedSG)
              this.orgGroupForm.get("SalesGroup").patchValue(this.selectedSG);
          },
        });
      }
    }
    if (str == "region") {
      if (event != null && event != "" && event != undefined) {
        this.salesDistrictFilterData = [];
        this.orgGroupForm.get("SalesDistrict").patchValue(null);

        this.salesDistrictFilterData = this.salesDistrict.filter((d) => {
          if (d.Code.startsWith(event.substring(0, 2))) {
            return d;
          }
        });

        this.salesDistrictData = this.salesDistrict.filter((d) => {
          if (d.Code.startsWith(event.substring(0, 2))) {
            return d;
          }
        });
        if (this.selectedSD)
          this.orgGroupForm.get("SalesDistrict").patchValue(this.selectedSD);

        this.priceListFilterData = [];
        this.orgGroupForm.get("PriceList").patchValue(null);
        this.priceListFilterData = this.priceList.filter((p) => {
          if (p.Desc.startsWith(event.substring(0, 2))) {
            return p;
          }
        });
        this.priceListData = this.priceList.filter((p) => {
          if (p.Desc.startsWith(event.substring(0, 2))) {
            return p;
          }
        });
        if (this.selectedPriceList)
          this.orgGroupForm.get("PriceList").patchValue(this.selectedPriceList);
      }
    }
  }

  saveAdditionalData() {
    if (!this.orgGroupForm.valid) {
      this.orgGroupForm.markAllAsTouched();
      return;
    }

    if (this.orgGroupForm.valid) {
      let additionalData = new OrganisationInputs();
      additionalData = this.orgGroupForm.value;
      additionalData.Division = this.orgGroupForm
        .get("Division")
        .value.join(",");
      additionalData.CustomerGroup = this.orgGroupForm
        .get("CustomerGroup")
        .value.join(",");
      additionalData.TransId = parseInt(localStorage.getItem("transID"));
      console.log("value",this.orgGroupForm.value["Company"])
      additionalData.Company = this.orgGroupForm.value["Company"].join(",");
      this.selectedSG = this.orgGroupForm.get("SalesGroup").value;
      this.selectedSD = this.orgGroupForm.get("SalesDistrict").value;
      this.selectedPriceList = this.orgGroupForm.get("PriceList").value;
      this._addtDataService
        .updateAdditionalData(this.orgGroupForm.value)
        .subscribe({
          next: () => {
            this._commonService.openSnackbar(
              "Additional Information Saved Successfully",
              snackbarStatus.Success
            );
            this.disableForm();
          },
          error: (err: any) => {
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
            this.enableForm();
            this.loader = false;
          },
        });
    }
  }

  getAllMasters() {
    forkJoin([
      this._addtDataService.getAdditionalData(this.transID),
      this._masterService.getAccountGroup(),
      this._masterService.getDistributionChannel(),
      this._masterService.getSaleOrgMasters(),
      this._masterService.getDivisions(),
      this._masterService.getRegions(),
      this._masterService.getAccountAssignment(),
      this._masterService.getCustomerGroup(),
      this._masterService.getCustomerPriceProcedure(),
      this._masterService.getCustomerStatistics(),
      this._masterService.getDeliveryPriority(),
      this._masterService.getIncoTerms(),
      this._masterService.getPaymentMethod(),
      this._masterService.getPaymentTerms(),
      this._masterService.getPriceGroup(),
      this._masterService.getPriceList(),
      this._masterService.getRecocilationAccount(),
      this._masterService.getSalesDistrict(),
      this._masterService.getSalesOffice(),
      this._masterService.getShippingCondition(),
      this._masterService.getCompanyCode(),
      this._masterService.getAttributeSix(),
      this._masterService.getAttributeNine(),
      this._masterService.getIndustry(),
      this._masterService.getAttributeTwo(),
    ]).subscribe({
      next: (res) => {
        this.accountGroups = res[1] as AccountGroup[];
        this.accGroup = res[1] as AccountGroup[];
        this.distributionChannels = res[2] as DistributionChannel[];
        this.distChannels = res[2] as DistributionChannel[];
        this.salesOrganizations = res[3] as SalesOrganization[];
        this.saleOrg = res[3] as SalesOrganization[];
        this.divisions = res[4] as Division[];
        this.division = res[4] as Division[];
        this.regions = res[5] as Region[];
        this.region = res[5] as Region[];
        this.accAssignmentGroup = res[6] as AdditionalDataCommonMaster[];
        this.accAssGroup = res[6] as AdditionalDataCommonMaster[];
        this.customerGroup = res[7] as AdditionalDataCommonMaster[];
        this.cGroup = res[7] as AdditionalDataCommonMaster[];
        this.customerPricongProcedure = res[8] as AdditionalDataCommonMaster[];
        this.cPricongProcedure = res[8] as AdditionalDataCommonMaster[];
        this.customerStatistics = res[9] as AdditionalDataCommonMaster[];
        this.cStatistics = res[9] as AdditionalDataCommonMaster[];
        this.deliveryPriority = res[10] as AdditionalDataCommonMaster[];
        this.deliveryPrioritys = res[10] as AdditionalDataCommonMaster[];
        this.incoTerms = res[11] as AdditionalDataCommonMaster[];
        this.incoTerm = res[11] as AdditionalDataCommonMaster[];
        this.paymentMethod = res[12] as AdditionalDataCommonMaster[];
        this.paymentTerms = res[13] as AdditionalDataCommonMaster[];
        this.paymentTerm = res[13] as AdditionalDataCommonMaster[];
        this.priceGroup = res[14] as AdditionalDataCommonMaster[];
        this.priceGroups = res[14] as AdditionalDataCommonMaster[];
        this.priceList = res[15] as AdditionalDataCommonMaster[];
        this.reconcilationAccount = res[16] as AdditionalDataCommonMaster[];
        this.reconcilationAccounts = res[16] as AdditionalDataCommonMaster[];
        this.salesDistrict = res[17] as AdditionalDataCommonMaster[];
        this.salesOffices = res[18] as AdditionalDataCommonMaster[];
        this.salesOffice = res[18] as AdditionalDataCommonMaster[];
        this.shippingCondition = res[19] as AdditionalDataCommonMaster[];
        this.shippingConditions = res[19] as AdditionalDataCommonMaster[];
        this.companyCode = res[20] as AdditionalDataCommonMaster[];
        this.cCode = res[20] as AdditionalDataCommonMaster[];
        this.attribute6List = res[21] as AdditionalDataCommonMaster[];
        this.attributesixList = res[21] as AdditionalDataCommonMaster[];
        this.attribute9List = res[22] as AdditionalDataCommonMaster[];
        this.attributenineList = res[22] as AdditionalDataCommonMaster[];
        this.Industries = res[23] as AdditionalDataCommonMaster[];
        this.Industri = res[23] as AdditionalDataCommonMaster[];
        this.attribute2List = res[24] as AdditionalDataCommonMaster[];
        this.attributetwoList = res[24] as AdditionalDataCommonMaster[];
        this.oldRecord = res[0] as OrganisationInputs;
        if (!res[0] && this.category) {
          this.getDefaultData(this.category);
        } else {
          this.patchValues(res[0]);
        }
        this.loader = false;
      },
    });
  }

  getDefaultData(res) {
    this._masterService.getDefaultDataByCustomerGroup(res).subscribe({
      next: (data) => {
        if (!this.oldRecord) {
          this.patchValues(data);
        }
      },
      error: (err) => {
        console.log(err);
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
        k == 47 ||
        k == 35
      );
    } else if (str == "Number") {
      return k >= 48 && k <= 57;
    }
  }

  editClicked() {
    this.enableForm();
  }

  enableForm() {
    this.editclick = false;
    this.orgGroupForm.enable();
  }

  disableForm() {
    this.editclick = true;
    this.orgGroupForm.disable();
  }

  cancel() {
    this.disableForm();
    this._addtDataService.getAdditionalData(this.transID).subscribe({
      next: (data) => {
        this.patchValues(data);
      },
    });
  }

  patchValues(values: any) {
    if (values) {
      if (!values.ReconciliationAccount) {
        values.ReconciliationAccount = this._appConfig.get(
          "DEFAULT_RECONCILIATION"
        );
      }
      if (!values.Attribute2) {
        values.Attribute2 = this._appConfig.get("DEFAULT_ATTRIBUTE2");
      }
      if (values?.Company != null && values?.Company != "") {
        values.Company = values.Company.split(",");
      } else {
        values.Company = [];
      }
      if (values?.Division != null && values?.Division != "") {
        values.Division = values.Division.split(",");
      } else {
        values.Division = [];
      }
      if (values?.CustomerGroup != null && values?.CustomerGroup != "") {
        values.CustomerGroup = values.CustomerGroup.split(",");
      } else {
        values.CustomerGroup = [];
      }
      this.selectedSD = values.SalesDistrict;
      this.selectedSG = values.SalesGroup;
      this.selectedPriceList = values.PriceList;
      this.orgGroupForm.patchValue(values);
      setTimeout(function () {
        if (this.selectedSD) {
          this.orgGroupForm.get("SalesDistrict").patchValue(this.selectedSD);
        }
        if (this.selectedPriceList) {
          this.orgGroupForm.get("PriceList").patchValue(this.selectedPriceList);
        }
      }, 3500);
    }
  }

  addSoldToPartyValidation() {
    this.orgGroupForm.get("SoldToParty").clearValidators();
    this.orgGroupForm
      .get("SoldToParty")
      .setValidators([Validators.required, Validators.maxLength(10)]);
    this.orgGroupForm.get("SoldToParty").updateValueAndValidity();
  }
  clearSoldToPartyValidation() {
    this.orgGroupForm.get("SoldToParty").clearValidators();
    this.orgGroupForm.get("SoldToParty").updateValueAndValidity();
  }

  private filter(value: string): AccountGroup[] {
    const filterValue = value.toLowerCase();
    return this.accountGroups.filter(optionValue => optionValue.Description.toLowerCase().includes(filterValue));
  }

}
