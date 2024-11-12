import { Component, Inject, OnInit } from "@angular/core";
import {
  BankDetails,
  BusinessInfo,
  DocumentDetails,
  MarketInfo,
  PersonalInfo,
  SecurityDeposits,
  OrganisationInputs,
  FirmDetails,
} from "../../Models/onboardingModel";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { forkJoin } from "rxjs";
import { DocumentsService } from "../../Services/documents.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "ngx-pdf-template",
  templateUrl: "./pdf-template.component.html",
  styleUrls: ["./pdf-template.component.scss"],
})
export class PdfTemplateComponent implements OnInit {
  personalInfo: PersonalInfo = new PersonalInfo();
  marketInfo: MarketInfo = new MarketInfo();
  businessInfo: BusinessInfo = new BusinessInfo();
  securityDeposit: SecurityDeposits[] = [];
  bankDetails: BankDetails = new BankDetails();
  documentDetails: DocumentDetails[] = [];
  additionalData: OrganisationInputs = new OrganisationInputs();
  contactDetails: FirmDetails[] = [];
  loader: boolean = false;

  panfile: any = "";
  gstfile: any = "";
  aadharfile: any = "";
  chequefile: any = "";
  photofile: any = "";
  tdsfile: any = "";
  addressfile: any = "";
  agreementfile: any = "";
  partnershipDeedfile: any = "";
  MOAfile: any = "";

  users: any;
  role: string;
  printContent: any;
  currentDateTime: any;

  constructor(
    public dialogRef: MatDialogRef<PdfTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
    private _document: DocumentsService,
    private sanitizer: DomSanitizer
  ) {
    this.currentDateTime = this.datepipe.transform(new Date(), "MM/dd/yyyy");
  }

  async ngOnInit(): Promise<void> {
    let userData = localStorage.getItem("userDetails");
    let transId = parseInt(localStorage.getItem("TransID"));
    this.users = JSON.parse(userData);
    this.role = this.users.Role;
    this.personalInfo = this.data.personalInfo;
    this.marketInfo = this.data.marketInfo;
    this.businessInfo = this.data.businessInfo;
    this.securityDeposit = this.data.securityDeposit;
    this.bankDetails = this.data.bankInfo;
    this.documentDetails = this.data.documentData;
    this.contactDetails = this.data.firmStatus;

    if (this.role == "RA") {
      this.additionalData = this.data.additionalData;
    }
    await this.getAllDocs();
  }

  print(id) {
    var content = document.getElementById(id).innerHTML;
    var a = window.open("", "", "height=500, width=500");
    a.document.write(content);
    a.document.close();
    a.print();
    // a.close();
    this.dialogRef.close();
  }

  async getAllDocs() {
    if (this.documentDetails != null && this.documentDetails.length > 0) {
      this.loader = true;
      forkJoin([
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "PanCard")?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "GSTCertificate")
            ?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "AadharCard")?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "CancelledCheque")
            ?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "PartnerPhoto")?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "TDSDeclaration")
            ?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "AddressProof")?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "SignedDocument")
            ?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "partnershipDeed")
            ?.Id
        ),
        this._document.getDocumentBydocId(
          this.documentDetails.find((x) => x.DocumentType == "MOA")?.Id
        ),
      ]).subscribe({
        next: async (res) => {
          if (res[0] != null) {
            const BASE64 = await this.createBlob(
              res[0].FileName,
              res[0].FileContent,
              res[0].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[0].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.panfile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[1] != null) {
            const BASE64 = await this.createBlob(
              res[1].FileName,
              res[1].FileContent,
              res[1].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[1].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.gstfile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[2] != null) {
            const BASE64 = await this.createBlob(
              res[2].FileName,
              res[2].FileContent,
              res[2].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[2].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.aadharfile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[3] != null) {
            const BASE64 = await this.createBlob(
              res[3].FileName,
              res[3].FileContent,
              res[3].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[3].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.chequefile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[4] != null) {
            const BASE64 = await this.createBlob(
              res[4].FileName,
              res[4].FileContent,
              res[4].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[4].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.photofile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[5] != null) {
            const BASE64 = await this.createBlob(
              res[5].FileName,
              res[5].FileContent,
              res[5].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[5].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.tdsfile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[6] != null) {
            const BASE64 = await this.createBlob(
              res[6].FileName,
              res[6].FileContent,
              res[6].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[6].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.addressfile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[7] != null) {
            const BASE64 = await this.createBlob(
              res[7].FileName,
              res[7].FileContent,
              res[7].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[7].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.agreementfile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[8] != null) {
            const BASE64 = await this.createBlob(
              res[8].FileName,
              res[8].FileContent,
              res[8].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[8].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.partnershipDeedfile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          if (res[9] != null) {
            const BASE64 = await this.createBlob(
              res[9].FileName,
              res[9].FileContent,
              res[9].FileType
            );
            const BLOB = this.dataURItoBlob(BASE64);
            const FILE = new File([BLOB], res[9].AttachmentName);
            const fileURL = URL.createObjectURL(FILE);
            this.MOAfile =
              this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          }
          this.loader = false;
        },
        error: (err) => {
          this.loader = false;
        },
      });
    }
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
}
