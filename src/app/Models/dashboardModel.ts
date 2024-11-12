export class DashboardModel {
  TransId?: number;
  State?: string;
  FirmStatus?: string;
  Name?: string;
  Status?: string;
  CreatedOn?: string;
  Category?: string;
}

export class DashboardTiles {
  All: number;
  Draft: number;
  Initiated: number;
  Pending: number;
  Approved: number;
  Rejected: number;

  constructor() {
    this.All = 0;
    this.Draft = 0;
    this.Initiated = 0;
    this.Pending = 0;
    this.Approved = 0;
    this.Rejected = 0;
  }
}


export class DashboardTable {
  All: DashboardModel[] = [];
  Draft: DashboardModel[] = [];
  Initiated: DashboardModel[] = [];
  Pending: DashboardModel[] = [];
  Approved: DashboardModel[] = [];
  Rejected: DashboardModel[] = [];
}

export class WorkFlowDashboard{
  Level: number;
  Role: string;
  Name: string;
}

