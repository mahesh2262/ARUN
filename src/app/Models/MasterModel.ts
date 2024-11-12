import { CommonData } from "./onboardingModel";

export class State {
  StateCode: string;
  StateName: string;
}

export class District {
  CountyCode: string;
  CountytName: string;
}

export class AccountGroup {
  Id: number;
  AccountGroup: string;
  Description: string;
  IsActive: boolean;
  CreatedOn: Date;
  CreatedBy: string;
  ModifiedOn: Date;
  ModifiedBy: string;
}

export class DistributionChannel {
  Id: number;
  DistributionChannel: string;
  Description: string;
  IsActive: boolean;
  CreatedOn: Date;
  CreatedBy: string;
  ModifiedOn: Date;
  ModifiedBy: string;
}

export class SalesOrganization {
  Id: number;
  SalesOrg: string;
  Description: string;
  IsActive: boolean;
  CreatedOn: Date;
  CreatedBy: string;
  ModifiedOn: Date;
  ModifiedBy: string;
}

export class Division {
  Id: number;
  Division: string;
  Description: string;
}

export class AdditionalDataCommonMaster {
  Id: number;
  Code: string;
  Desc: string;
}

export class Region {
  Id: number;
  Country: string;
  Region: string;
  Description: string;
  IsActive: boolean;
  CreatedOn: Date;
  CreatedBy: string;
  ModifiedOn: Date;
  ModifiedBy: string;
}

export class DivisionMaterialMap {
  Id: number;
  Division: string;
  MaterialGroup: string;
}

export class TypeOfCategory {
  Id: number;
  Name: string;
  Desc: string;
}

export class Territory {
  Id: number;
  DistChannel: number;
  StateCode: string;
  StateName: string;
  CountyCode: string;
  CountyName: string;
  RAEmployeeId: string;
  RAEmployeeName: string;
  RAEmailId: string;
  RAPositionId: string;
}

export class ChannelPartner {
  Id: number;
  CreatedOn: number;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
  IsActive: boolean;
  TransId: number;
  State: string;
  FirmName: string;
  Status: string;
  SAPCode: string;
  VirtualCode : string;
  IsAppointmentLetter : boolean;
  IsEmail : boolean;
}

export class Roles {
  RoleId: number;
  Desc: string;
}

export class User extends CommonData{
  EmpId: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Mobile: string;
  Email: string;
  Password: string;
  PositionId: string;
  ManagerId: string;
  RoleId: number;
}

export class ApprovalNotificationList {
  Id: number;
  RoleId: number;
  Name: string;
  Mail: string;
}

export class EmailSetting{
  Name : string;
  Email : string;
}

export class ApprovalRoleList {
  Id: number;
  RoleId: number;
  Role: string;
  Name: string;
  Mail: string;
}

export class DefaultAdditionalData {
  AccountGroup: string = "";
  DistributionChannel: string = "";
  Division: string = "";
  SalesOrg: string = "";
  Region: string = "";
  Company: string = "";
  Industry: string = "";
  CustomerGroup: string = "";
  AccountAssessmentGroupCustomer: string = "";
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
}

export class UserDetailsTemplate {
  EmployeeId : string;
  ExecutiveName : string;
  EmailId: string;
  MobileNo :string;
  Role : string;
  PositionId: string;
  ManagerPositionId : string;
  ManagerName : string;
  UserAccountStatus : boolean;
}

export class AdminDetails {
  TransID: string;
  DealerName: string;
  FormSubmissionDate : string;
  ASMName : string;
  ASMEmailId : string;
  ASMApprovalDate : string;
  ZHName : string;
  ZHEmailId : string;
  ZHApprovalDate : string;
  NHName : string;
  NHEmailId : string;
  NHApprovalDate : string;
  RAName : string;
  RAEmailId : string;
  RAApprovalDate : string;
}

export class  AdminDashboardDetails {
  TransId : number;
  Category : string;
  DealerName : string;
}

