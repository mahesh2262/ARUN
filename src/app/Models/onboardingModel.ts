export class CommonData {
  CreatedOn: Date = new Date();
  CreatedBy: string;
  UpdatedOn: Date = new Date();
  UpdatedBy: string;
  IsActive: boolean = true;
}

export class PersonalInfo extends CommonData {
  Id: number;
  TransId: number;
  Category: string;
  Product: string;
  Name: string;
  Address: string;
  City: string;
  Taluk: string;
  Tehsil: string;
  District: string;
  State: string;
  Pincode: string;
  FirmStatus: string;
  Company: string;
  Industry: string;
  Cgrp: string;
  Latitude: string;
  Logitude: string;
  Status: string;
  FirmStatuses: FirmDetails[];
  OrganisationInputs: OrganisationInputs;
  Role: string;
}

export class FirmDetails {
  PersonName: string;
  Email: string;
  Mobile: string;
}

export class OrganisationInputs {
  TransId: number = 0;
  AccountGroup: string = "";
  DistributionChannel: string = "";
  Division: string = "";
  SalesOrg: string = "";
  Region: string = "";
  Company: string = "";
  Industry: string = "";
  CustomerGroup: string = "";
  AccountAssessmentGroupCustomer: string = "";
  Attribute2: string = "";
  Attribute6: string = "";
  Attribute9: string = "";
  CustomerPricingProcedure: string = "";
  CustomerStatisticsGroup: string = "";
  DeliveryPlant: string = "";
  DeliveryPriority: string = "";
  Incoterms: string = "";
  PODTimeFrame: string = "";
  PaymentTerms: string = "";
  PriceGroup: string = "";
  PriceList: string = "";
  ReconciliationAccount: string = "";
  SalesDistrict: string = "";
  SalesGroup: string = "";
  SalesOffice: string = "";
  ShippingCondition: string = "";
  SoldToParty: string = "";
}

export class BusinessInfo {
  Id: number;
  TransId: number;
  Turnover1: number;
  Turnover2: number;
  Turnover3: number;
  CapitalToBeInvest: number;
  VehiclesOwned: number;
  StorageCapacity: number;
  SalesRetail: number;
  SalesWholesale: number;
  NoOfRetailsers: number;
  SalesAndTarget: SalesTarget[];
}

export class SalesTarget {
  BusinessId: number;
  Month: string;
  Value: number;
  Product: string;
}

export class MarketInfo {
  Id: number;
  TransId: number;
  Market: string;
  Population: number;
  PotentialArea: number;
  NoOfExistingStockist: number;
  NearestStockistDistance: number;
  NearestStockistName: string;
  YearOfEstablishment: number;
  ServeArea: string;
  PartyPotential: number;
  ExpectedAvgSale: number;
  PanNo: string;
  GstNo: string;
  CINNo: string;
  PartyBackground: string;
  MarketAvgSales: MarketAvgSales[];
}

export class MarketAvgSales {
  MarketId: number;
  Brand: string;
  Unit: string;
  Business: string;
  AvgMonthlySales: number;
}

export class BankInfo {
  Id: number;
  BankName: string;
  AccHolder: string;
  Branch: string;
  IFSC: string;
  AccNumber: string;
  TransId: number;
}

// export class SecurityDeposits{
//   SecurityDeposit : SecurityDeposit[]
// }

export class SecurityDeposits {
  Id: number;
  TransId: number;
  DocumentNo: string;
  DocumentDate: Date;
  DocumentType: string;
  Amount: number;
  BankName: string;
  AccNumber: string;
  PaymentToJKCLBank: string;
  UTRNumber: string;
  GLAccount: string;
  IsAdvBillingParty: boolean;
  ProductName: string;
}
export class ImageResult {
  _id: string;
  originalName: string;
  mimeType: string;
}

export class PANOCRData {
  pan: string;
  birthDate: string;
  incorporationDate: any;
  name: string;
  father: string;
  category: string;
}

export class PANOCRResult {
  valid: boolean;
  message: any;
  data: PANOCRData;
}

export class GSTOCRData {
  gstin: string;
  legalName: string;
  tradeName: string;
  constitution: string;
  address: string;
  type: string;
  registered: string;
  expiry: any;
  issued: string;
  approvingAuthority: string;
  jurisdiction: string;
  provisional: boolean;
  pan: any;
  tin: any;
  slr: any;
}

export class GSTOCRResult {
  valid: boolean;
  message: any;
  data: GSTOCRData;
}
export class AadharOCRData {
  uuid: string;
  vid: any;
  name: string;
  careOf: any;
  dob: string;
  gender: string;
  address: string;
}

export class AadharOCRResult {
  valid: boolean;
  message: any;
  data: AadharOCRData;
}
export class ChequeOCRData {
  signatory: string;
  accountNumber: string;
  bank: string;
  branch: string;
  code: string;
  issued: any;
  issuedTo: any;
  ifsc: string;
}
export class ChequeOCRResult {
  valid: boolean;
  message: any;
  data: ChequeOCRData;
}
export class BankDetails {
  Id: number;
  TransId: number;
  BankName: string;
  Branch: string;
  IFSC: string;
  AccHolder: string;
  AccNumber: string;
  NomineeName: string;
  NomineeRelation: string;
  // filter: any;
  // includes: any;
}
export class BankDetailsView {
  BankDetailInfo: BankDetails[];
  // SecurityDeposit: SecurityDepositDetail;
  // AadharData: AadharDetails;
  Status: string;
  PanNo: string;
  GstNo: string;
  UserId: string;
  ManagerId: string;
}
export class BankAccountResult {
  valid: boolean;
  name: string;
  ifsc: any;
  status: string;
  message: string;
}

export class AttachmentDetails {
  FileName: string;
  blob: Blob;
}

export class DocumentTitleName {
  DocumentTitle: string;
  AttachmentName: string;
}

export class Document {
  TransId: number;
  DocumentName: string;
  DocumentType: string;
  FileName: string;
  FileSize: number;
  FileType: string;
  FileContent: File;
}

export class DocumentDetails {
  Id: number;
  DocumentName: string;
  DocumentType: string;
}

export class TaskDto {
  TransId: number;
  CurrentOwnerPosId: string;
  CurrentOwnerEmpId: string;
  CustomerType: string;
  Role: string;
  StateCode: string;
  CountyCode: string;
}

export class RejectDto {
  TransId: number;
  Message: string;
}

export class GSTResult {
  valid: boolean;
  active: boolean;
  legalName: string;
  tradeName: string;
  pan: string;
  constitution: string;
  nature: string[];
  type: string;
  registered: string;
  updated: string;
  expiry: any;
  state: string;
  stateCode: string;
  center: string;
  centerCode: string;
  message: string;
  addresses: Address[];
  constructor() {
    this.addresses = [];
  }
}

export class Address {
  type: string;
  building: string;
  buildingName: string;
  floor: string;
  street: string;
  locality: string;
  district: string;
  city: string;
  state: string;
  zip: string;
  latitude: string;
  longitude: string;
  nature: string;
}
export class Locations {
  formattedAddress: string;
  lat: number;
  lng: number;
  partialMatch: boolean;
  zipcodeLocalities: string[];
}
export class RecGeoLocation {
  valid: boolean;
  message: any;
  locations: Locations[] | string[];
}

export class DivisionMaterialMap {
  Id: number;
  Division: string;
  MaterialGroup: string;
}

export class CustomerLog {
  TransId: number;
  ActionedDate: Date;
  Action: string;
  ActionedBy: string;
  Role: string | number;
  Transaction: Transaction = new Transaction();
}

export class Transaction {
  TransId: number;
  Status: string;
  CustomerCode: string;
  CreatedOn: Date;
  CreatedBy: string;
  UpdatedOn: Date;
  UpdatedBy: string;
  IsActive: boolean;
}

export class DelegationDto {
  TransId: number;
  OwnerEmployeeId: string;
  DelegatedEmployeeId: string;
  Role: string;
}
