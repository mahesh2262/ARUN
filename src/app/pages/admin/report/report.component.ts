import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  selectedItemNgModel;

  constructor() { }

  ngOnInit(): void {
  }

}
