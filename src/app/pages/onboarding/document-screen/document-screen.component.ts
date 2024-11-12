import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { DocumentsService } from "../../../Services/documents.service";
import {
  AttachmentDetails,
  ImageResult,
  PANOCRResult,
  DocumentTitleName,
  GSTOCRResult,
  AadharOCRResult,
  ChequeOCRResult,
  BankDetails,
  DocumentDetails,
  FirmDetails,
} from "../../../Models/onboardingModel";
import { snackbarStatus } from "../../../Enums/notification-snack-bar";
import { CommonService } from "../../../Services/common.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { DialogBoxComponent } from "../../../Dialogs/dialog-box/dialog-box.component";
import { HexBase64BinaryEncoding } from "crypto";
import { MasterService } from "../../../Services/master.service";
import { FileSaverService } from "../../../Services/file-saver.service";
import { EmitterService } from "../../../Services/emitter.service";

@Component({
  selector: "ngx-document-screen",
  templateUrl: "./document-screen.component.html",
  styleUrls: ["./document-screen.component.scss"],
})
export class DocumentScreenComponent implements OnInit {
  transId: any;
  PAN: string;
  GST: string;
  PannumberOCR: any;
  PanNameOCR: string;
  GSTinOCR: any;
  GSTnameOCR: any;
  AadharForm!: FormGroup;
  dataFromDialog: any[] = [];
  contactdataSource: MatTableDataSource<FirmDetails>;
  currentTransaction: number;

  //File Variables
  panfile: string = "";
  gstfile: string = "";
  aadharfile: string = "";
  chequefile: string = "";
  photofile: string = "";
  tdsfile: string = "";
  addressfile: string = "";
  agreementfile: string = "";
  MOAfile: string = "";
  SalesTargetfile: string = "";
  partnershipDeedfile: string = "";
  Factoryvisitreportfile: string = "";
  Selfconsumptionfile: string = "";
  Rateapprovalfile: string = "";
  GstPdffile: string = "";

  status: string;
  role: string;
  show: boolean = false;
  properties: string;
  isKamIc : boolean;

  //Global declaration starts***
  public GSTCertificate;
  public AadharCard;
  public CancelledCheque;
  public PartnerPhoto;
  public TDSDeclaration;
  public AddressProof;
  public SignedDocument;

  docList: DocumentDetails[] = [];
  IdentityData: BankDetails[] = [];
  DocumentTitleNames: DocumentTitleName[] = [];
  public listData: BankDetails[] = [];
  files: File[] = [];
  public PanCard;
  apiData: any;
  userData: any;
  loader: boolean = false;

  isSignedAgreementMust: boolean = true;
  isCancelledChequeMust: boolean = false;
  isNepalCode : Boolean ;

  @Output() event = new EventEmitter<boolean>();
  @Output() nextTab = new EventEmitter<string>();
  categories: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _documentService: DocumentsService,
    private _commonService: CommonService,
    public _dialog: MatDialog,
    private _masterService: MasterService,
    private _fileSaver: FileSaverService,
    private _emitter: EmitterService
  ) {}

  ngOnInit(): void {
    const USER = localStorage.getItem("userDetails");
    const transId = localStorage.getItem("transID");
    this.status = localStorage.getItem("status");
    this.transId = JSON.parse(transId);
    if (USER) {
      this.userData = JSON.parse(USER);
      this.role = this.userData.Role;
      this.getAttachmentsIfany();
    }

    this.AadharForm = this._formBuilder.group({
      aadharname: ["", Validators.required],
      aadharnumber: ["", [Validators.required, Validators.pattern(/^\d{12}$/)]],
      aadharmobile: [
        "",
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      aadharemail: ["", Validators.pattern(/^[a-z0-9.]+@[a-z]+\.[a-z]{2,4}$/)],
    });

    if (this._commonService.accessShowHide(this.status, this.role)) {
      this.show = true;
    }

    // this._masterService.categoryEmitter.subscribe({
    //   next: (res) => {
    //     if (res.toLowerCase().includes("d2r")) {
    //       this.isSignedAgreementMust = false;
    //     }
    //   },
    // });

    this._emitter.isAdvBillingEmitter.subscribe({
      next: (res) => {
        this.isCancelledChequeMust = res;
        if (!res) {
          this.isCancelledChequeMust =
            localStorage.getItem("isAdvBillingParty") == "true";
        }
      },
    });

    // this._emitter.IsNepalCode.subscribe({
    //   next: (res) => {
    //     this.isNepalCode = res;
    //     if (res) {
    //       this.isNepalCode = true;
    //         // localStorage.getItem("isAdvBillingParty") == "true";
    //     }else{
    //       this.isNepalCode = false;
    //     }
    //   },
    // });

    this._emitter.categoryEmitter.subscribe({
      next: (data) => {
        this.categories = data;

      },
    });

    this._emitter.statusOfFirmEmitter.subscribe((value) => {
      this.properties = value;
    });
  }

  FileInputChange(event, str) {
    this.loader = true;
    if (
      str == "PanCard" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this._documentService.UploadImage(event.target.files[0]).subscribe(
        (data) => {
          const res = data as ImageResult;

          if (res) {
            this._documentService.ExtractPANDetails(res._id).subscribe(
              (idata) => {
                const res = idata as PANOCRResult;

                if (res.valid) {
                  this.PannumberOCR = res.data.pan;
                  this.PanNameOCR = res.data.name;
                  if (this.PannumberOCR) {
                    this.uploadFileToAPI(event.target.files[0], "PanCard")
                      .then((res) => {
                        this.loader = false;
                        this.panfile = event.target.files[0].name;

                        this._commonService.openSnackbar(
                          `PAN Uploaded successfully`,
                          snackbarStatus.Success
                        );
                      })
                      .catch((err) => {
                        this.loader = false;
                        this._commonService.openSnackbar(
                          `Unable to upload attachment, Please try after sometime.`,
                          snackbarStatus.Danger
                        );
                      });
                    // this.handleFileInput(event, "PanCard");
                  } else {
                    this.loader = false;
                    this._commonService.openSnackbar(
                      `Mismatched PAN attachment found`,
                      snackbarStatus.Danger
                    );
                    this.PannumberOCR = "";
                    this.PanNameOCR = "";
                  }
                } else {
                  this.loader = false;
                  this._commonService.openSnackbar(
                    `${res.message}`,
                    snackbarStatus.Danger,
                    2000
                  );
                }
              },
              (err) => {
                this.loader = false;
                this._commonService.openSnackbar(
                  `${err}`,
                  snackbarStatus.Danger,
                  2000
                );
              }
            );
          } else {
            this.loader = false;
            this._commonService.openSnackbar(
              "Something went wrong!!",
              snackbarStatus.Danger,
              2000
            );
          }
        },
        (err) => {
          this.loader = false;
          if (err == "Incompatible file type") {
            this._commonService.openSnackbar(
              "Please upload PNG/JPEG image format.",
              snackbarStatus.Danger,
              2000
            );
          } else {
            this._commonService.openSnackbar(
              `${err}`,
              snackbarStatus.Danger,
              2000
            );
          }
        }
      );
    } else if (
      str == "GSTCertificate" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this._documentService.UploadImage(event.target.files[0]).subscribe(
        (data) => {
          const res = data as ImageResult;
          if (res) {
            this._documentService.ExtractGSTDetails(res._id).subscribe(
              (idata) => {
                const res1 = idata as GSTOCRResult;
                if (res1.valid) {
                  this.GSTinOCR = res1.data.gstin;
                  this.GSTnameOCR = res1.data.legalName;

                  this.uploadFileToAPI(event.target.files[0], "GSTCertificate")
                    .then((res) => {
                      this.loader = false;
                      this.gstfile = event.target.files[0].name;
                      this._commonService.openSnackbar(
                        `GST Uploaded successfully`,
                        snackbarStatus.Success,
                        2000
                      );
                    })
                    .catch((err) => {
                      this.loader = false;
                      this._commonService.openSnackbar(
                        `Unable to upload attachment, Please try after sometime.`,
                        snackbarStatus.Danger
                      );
                    });
                  // this.handleFileInput(event, "GSTCertificate");
                } else {
                  this.loader = false;
                  this._commonService.openSnackbar(
                    `${res1.message}`,
                    snackbarStatus.Danger
                  );
                }
              },
              (err1) => {
                this.loader = false;
                console.error(err1);
              }
            );
          }
        },
        (err) => {
          this.loader = false;
          if (err == "Incompatible file type") {
            this._commonService.openSnackbar(
              "Please upload PNG/JPEG image format.",
              snackbarStatus.Danger,
              2000
            );
          } else {
            this._commonService.openSnackbar(
              `${err}`,
              snackbarStatus.Danger,
              2000
            );
          }
        }
      );
    } else if (
      str == "AadharCard" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this._documentService.UploadImage(event.target.files[0]).subscribe(
        (data) => {
          const res = data as ImageResult;

          if (res) {
            this._documentService.ExtractAadharDetails(res._id).subscribe(
              (idata) => {
                const res = idata as AadharOCRResult;
                if (res.valid) {
                  this.AadharForm.get("aadharname").patchValue(res.data.name);
                  this.AadharForm.get("aadharnumber").patchValue(
                    res.data.uuid.replace(/ /g, "")
                  );

                  this.uploadFileToAPI(event.target.files[0], "AadharCard")
                    .then((res) => {
                      this.loader = false;
                      this.aadharfile = event.target.files[0].name;
                      this._commonService.openSnackbar(
                        "Aadhar uploaded successfully",
                        snackbarStatus.Success,
                        2000
                      );
                    })
                    .catch((err) => {
                      this.loader = false;
                      this._commonService.openSnackbar(
                        `Unable to upload attachment, Please try after sometime.`,
                        snackbarStatus.Danger
                      );
                    });
                  // this.handleFileInput(event, "AadharCard");
                } else {
                  this.loader = false;
                  this._commonService.openSnackbar(
                    `${res.message}`,
                    snackbarStatus.Danger,
                    2000
                  );
                }
              },
              (err) => {
                this.loader = false;
                this._commonService.openSnackbar(
                  `${err.message}`,
                  snackbarStatus.Danger,
                  2000
                );
              }
            );
          } else {
            this.loader = false;
            this._commonService.openSnackbar(
              "Something went wrong!!",
              snackbarStatus.Danger,
              2000
            );
          }
        },
        (err) => {
          this.loader = false;
          if (err == "Incompatible file type") {
            this._commonService.openSnackbar(
              "Please upload PNG/JPEG image format.",
              snackbarStatus.Danger,
              2000
            );
          } else {
            this._commonService.openSnackbar(
              `${err}`,
              snackbarStatus.Danger,
              2000
            );
          }
        }
      );
    } else if (
      str == "CancelledCheque" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this._documentService.UploadImage(event.target.files[0]).subscribe(
        (data) => {
          const res = data as ImageResult;
          if (res) {
            this._documentService.ExtractChequeDetails(res._id).subscribe(
              (data1) => {
                const res1 = data1 as ChequeOCRResult;
                if (res1.valid) {
                  this.uploadFileToAPI(event.target.files[0], "CancelledCheque")
                    .then((res) => {
                      this.loader = false;
                      this.chequefile = event.target.files[0].name;
                      this._commonService.openSnackbar(
                        `Cheque uploaded successfully`,
                        snackbarStatus.Success,
                        2000
                      );
                    })
                    .catch((err) => {
                      this.loader = false;
                      this._commonService.openSnackbar(
                        `Unable to upload attachment, Please try after sometime.`,
                        snackbarStatus.Danger
                      );
                    });
                  // this.handleFileInput(event, "CancelledCheque");
                } else {
                  this.loader = false;
                  this._commonService.openSnackbar(
                    `${res1.message}`,
                    snackbarStatus.Danger,
                    2000
                  );
                }
              },
              (err1) => {
                this.loader = false;
                console.error(err1);
              }
            );
          }
        },
        (err) => {
          this.loader = false;
          if (err == "Incompatible file type") {
            this._commonService.openSnackbar(
              "Please upload PNG/JPEG image format.",
              snackbarStatus.Danger,
              2000
            );
          } else {
            this._commonService.openSnackbar(
              `${err}`,
              snackbarStatus.Danger,
              2000
            );
          }
        }
      );
    } else if (
      str == "PartnerPhoto" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "PartnerPhoto")
        .then((res) => {
          this.loader = false;
          this.photofile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Photo uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Success
          );
        });
      // this.handleFileInput(event, "PartnerPhoto");
    } else if (
      str == "TDSDeclaration" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "TDSDeclaration")
        .then((res) => {
          this.loader = false;
          this.tdsfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "TDS uploaded Successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
      // this.handleFileInput(event, "TDSDeclaration");
    } else if (
      str == "AddressProof" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "AddressProof")
        .then((res) => {
          this.loader = false;
          this.addressfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Addressproof uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
      // this.handleFileInput(event, "AddressProof");
    } else if (
      str == "SignedDocument" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "SignedDocument")
        .then((res) => {
          this.loader = false;
          this.agreementfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Document uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
      // this.handleFileInput(event, "SignedDocument");
    } else if (
      str == "partnershipDeed" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "partnershipDeed")
        .then((res) => {
          this.loader = false;
          this.partnershipDeedfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Document uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
      // this.handleFileInput(event, "SignedDocument");
    } else if (
      str == "MOA" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "MOA")
        .then((res) => {
          this.loader = false;
          this.MOAfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Document uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
      // this.handleFileInput(event, "SignedDocument");
    } else if (
      str == "SalesTarget" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "SalesTarget")
        .then((res) => {
          this.loader = false;
          this.SalesTargetfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Document uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
      // this.handleFileInput(event, "SignedDocument");
    } else if (
      str == "Factoryvisitreport" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "Factoryvisitreport")
        .then((res) => {
          this.loader = false;
          this.Factoryvisitreportfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Document uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
    } else if (
      str == "Selfconsumption" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "Selfconsumption")
        .then((res) => {
          this.loader = false;
          this.Selfconsumptionfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Document uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
    } else if (
      str == "Rateapproval" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "Rateapproval")
        .then((res) => {
          this.loader = false;
          this.Rateapprovalfile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Document uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
    } else if (
      str == "GstPdf" &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      this.uploadFileToAPI(event.target.files[0], "GstPdf")
        .then((res) => {
          this.loader = false;
          this.GstPdffile = event.target.files[0].name;
          this._commonService.openSnackbar(
            "Document uploaded successfully",
            snackbarStatus.Success,
            2000
          );
        })
        .catch((err) => {
          this.loader = false;
          this._commonService.openSnackbar(
            `Unable to upload attachment, Please try after sometime.`,
            snackbarStatus.Danger
          );
        });
    }
  }

  uploadFileToAPI(file: File, docType: string): Promise<any> {
    this.loader = true;
    return new Promise<any>((resolve, reject) => {
      if (file.size / (1024 * 1024) > 10) {
        this.loader = false;
        this._commonService.openSnackbar(
          `File size is too large (max 10 MB)`,
          snackbarStatus.Danger
        );
      } else {
        this._documentService
          .uploadDocument(this.transId, file, docType)
          .subscribe({
            next: (res) => {
              this.loader = false;
              this.getAttachmentsIfany();
              resolve(res);
            },
            error: (err) => {
              this.loader = false;
              reject(err);
            },
          });
      }
    });
  }

  openAttachmentDialog(FileType: string): void {
    let doc = this.docList.find((x) => x.DocumentType === FileType);
    if (doc != null || doc != undefined) {
      if (FileType == "SalesTarget") {
        this.loader = true;
        this._documentService.getDocumentBydocId(doc.Id).subscribe({
          next: async (res) => {
            await this._fileSaver.downloadFile(res);
            this.loader = false;
          },
          error: (err) => {
            this.loader = false;
          },
        });
      } else {
        const action = "documentEdit";
        const dialogconfig: MatDialogConfig = {
          data: {
            Action: action,
            FileName: doc.DocumentName,
            docId: doc.Id,
          },
          panelClass: "dialog-box-document",
          autoFocus: false,
        };
        const dialogRef = this._dialog.open(DialogBoxComponent, dialogconfig);
      }
    }
  }

  fileUpload() {
    document.getElementById("panErrorMsg").innerHTML = null;
    document.getElementById("gstErrorMsg").innerHTML = null;
    document.getElementById("adharErrorMsg").innerHTML = null;
    document.getElementById("chequeErrorMsg").innerHTML = null;
    document.getElementById("photoErrorMsg").innerHTML = null;
    document.getElementById("tdsErrorMsg").innerHTML = null;
    document.getElementById("addressErrorMsg").innerHTML = null;
    document.getElementById("agreementErrorMsg").innerHTML = null;
    document.getElementById("partnershipDeedErrorMsg").innerHTML = null;
    document.getElementById("MOAErrorMsg").innerHTML = null;
    document.getElementById("FactoryvisitreportErrorMsg").innerHTML = null;
    document.getElementById("SelfconsumptionErrorMsg").innerHTML = null;
    document.getElementById("RateapprovalErrorMsg").innerHTML = null;
    document.getElementById("GstPdfErrorMsg").innerHTML = null;

    if (this.panfile == "" || this.panfile == null) {
      document.getElementById("panErrorMsg").innerHTML = "PAN file is Required";
    }

    if (this.gstfile == "" || this.gstfile == null) {
      document.getElementById("gstErrorMsg").innerHTML = "GST file is Required";
    }

    if (this.aadharfile == "" || this.aadharfile == null) {
      document.getElementById("adharErrorMsg").innerHTML =
        "Adhar file is Required";
    }

    if (this.chequefile == "" || this.chequefile == null) {
      document.getElementById("chequeErrorMsg").innerHTML =
        "Cheque is Required";
    }

    if (this.photofile == "" || this.photofile == null) {
      document.getElementById("photoErrorMsg").innerHTML = "Photo is Required";
    }

    if (this.tdsfile == "" || this.tdsfile == null) {
      document.getElementById("tdsErrorMsg").innerHTML = "TDS file is Required";
    }

    if (this.addressfile == "" || this.addressfile == null) {
      document.getElementById("addressErrorMsg").innerHTML =
        "Address proof is Required";
    }

    // if (
    //   (this.agreementfile == "" || this.agreementfile == null) &&
    //   this.isSignedAgreementMust
    // ) {
    //   document.getElementById("agreementErrorMsg").innerHTML =
    //     "Agreement is Required";
    // }
    if (this.properties == "Partnership") {
      if (this.partnershipDeedfile == "" || this.partnershipDeedfile == null) {
        document.getElementById("partnershipDeedErrorMsg").innerHTML =
          "partnershipDeed is Required";
      }
    }

    if (this.properties == "Pvt Ltd" || this.properties == "Limited") {
      if (this.MOAfile == "" || this.MOAfile == null) {
        document.getElementById("MOAErrorMsg").innerHTML = "MOA is Required";
      }
    }

    if (this.categories == "KAM IC" || this.categories == "IC") {
      if (
        this.Factoryvisitreportfile == "" ||
        this.Factoryvisitreportfile == null
      ) {
        document.getElementById("FactoryvisitreportErrorMsg").innerHTML =
          "Factory Visit Report is Required";
      }
      if (this.Selfconsumptionfile == "" || this.Selfconsumptionfile == null) {
        document.getElementById("SelfconsumptionErrorMsg").innerHTML =
          "Self consumption certificate is Required";
      }
      if (this.Rateapprovalfile == "" || this.Rateapprovalfile == null) {
        document.getElementById("RateapprovalErrorMsg").innerHTML =
          "Rate approval is Required";
      }
      if (this.GstPdffile == "" || this.GstPdffile == null) {
        document.getElementById("GstPdfErrorMsg").innerHTML =
          "GST Document(in PDF format) is Required";
      }
    }

    if (
      this.agreementfile &&
      this.addressfile &&
      this.tdsfile &&
      this.photofile &&
      this.chequefile &&
      this.aadharfile &&
      this.gstfile &&
      this.panfile
    ) {
      this._commonService.openSnackbar(
        `Document has Successfully Added`,
        snackbarStatus.Success,
        2000
      );

      if (this.userData.Role == "RA") {
        this.nextTab.emit("additional_data_info");
      }
    }
  }

  getAttachmentsIfany() {
    this._documentService.getFiles(parseInt(this.transId)).subscribe({
      next: (res) => {
        // if (res.length == 8) {
        //   this.event.emit(true);
        // }
        if (res.length > 0) {
          this.docList = res as DocumentDetails[];
          res.forEach((element) => {
            element.DocumentType == "PanCard"
              ? (this.panfile = element.DocumentName)
              : "";
            element.DocumentType == "GSTCertificate"
              ? (this.gstfile = element.DocumentName)
              : "";
            element.DocumentType == "AadharCard"
              ? (this.aadharfile = element.DocumentName)
              : "";
            element.DocumentType == "CancelledCheque"
              ? (this.chequefile = element.DocumentName)
              : "";
            element.DocumentType == "PartnerPhoto"
              ? (this.photofile = element.DocumentName)
              : "";
            element.DocumentType == "TDSDeclaration"
              ? (this.tdsfile = element.DocumentName)
              : "";
            element.DocumentType == "AddressProof"
              ? (this.addressfile = element.DocumentName)
              : "";
            element.DocumentType == "SignedDocument"
              ? (this.agreementfile = element.DocumentName)
              : "";
            element.DocumentType == "partnershipDeed"
              ? (this.partnershipDeedfile = element.DocumentName)
              : "";
            element.DocumentType == "MOA"
              ? (this.MOAfile = element.DocumentName)
              : "";
            element.DocumentType == "SalesTarget"
              ? (this.SalesTargetfile = element.DocumentName)
              : "";
            element.DocumentType == "Factoryvisitreport"
              ? (this.Factoryvisitreportfile = element.DocumentName)
              : "";
            element.DocumentType == "Selfconsumption"
              ? (this.Selfconsumptionfile = element.DocumentName)
              : "";
            element.DocumentType == "Rateapproval"
              ? (this.Rateapprovalfile = element.DocumentName)
              : "";
            element.DocumentType == "GstPdf"
              ? (this.GstPdffile = element.DocumentName)
              : "";
          });
          this.isAllDocsUploaded();
        }
      },
    });
  }

  isAllDocsUploaded(): boolean {
    document.getElementById("panErrorMsg").innerHTML = null;
    document.getElementById("gstErrorMsg").innerHTML = null;
    document.getElementById("adharErrorMsg").innerHTML = null;
    document.getElementById("chequeErrorMsg").innerHTML = null;
    document.getElementById("photoErrorMsg").innerHTML = null;
    document.getElementById("tdsErrorMsg").innerHTML = null;
    document.getElementById("addressErrorMsg").innerHTML = null;
    document.getElementById("agreementErrorMsg").innerHTML = null;
    document.getElementById("partnershipDeedErrorMsg").innerHTML = null;
    document.getElementById("MOAErrorMsg").innerHTML = null;
    document.getElementById("SalesTargetErrorMsg").innerHTML = null;
    document.getElementById("FactoryvisitreportErrorMsg").innerHTML = null;
    document.getElementById("SelfconsumptionErrorMsg").innerHTML = null;
    document.getElementById("RateapprovalErrorMsg").innerHTML = null;
    document.getElementById("GstPdfErrorMsg").innerHTML = null;

    if (
      !this.categories.toLowerCase().includes("ship to") &&
      (this.panfile == "" || this.panfile == null)
    ) {
      // console.log("pan",this.panfile)
      // console.log("pan",this.categories.toLowerCase().includes("ship to"))
      // console.log("this.isNepalCode",this.isNepalCode)
      document.getElementById("panErrorMsg").innerHTML = "PAN file is required";
      return false;
    } else if (this.gstfile == "" || this.gstfile == null) {
      // console.log("gst")
      document.getElementById("gstErrorMsg").innerHTML = "GST file is required";
      return false;
    } else if (
      !this.categories.toLowerCase().includes("ship to") &&
      (this.aadharfile == "" || this.aadharfile == null)
    ) {
      // console.log("aadhar")
      document.getElementById("adharErrorMsg").innerHTML =
        "Adhar file is required";
      return false;
    } else if (
      !this.categories.toLowerCase().includes("ship to") &&
      (this.chequefile == "" || this.chequefile == null) &&
      !this.isCancelledChequeMust
    ) {

      // console.log("cheque")
      document.getElementById("chequeErrorMsg").innerHTML =
        "Cheque is required";
      return false;
    } else if (
      !this.categories.toLowerCase().includes("ship to") &&
      (this.photofile == "" || this.photofile == null)
    ) {
      // console.log("photo")
      document.getElementById("photoErrorMsg").innerHTML = "Photo is required";
      return false;
    } else if (
      !this.categories.toLowerCase().includes("ship to") &&
      (this.tdsfile == "" || this.tdsfile == null)
    ) {
      // console.log("tds")
      document.getElementById("tdsErrorMsg").innerHTML = "TDS file is required";
      return false;
    } else if (
      (!this.categories.toLowerCase().includes("ship to") &&
        this.addressfile == "") ||
      this.addressfile == null
    ) {
      // console.log("addre")
      document.getElementById("addressErrorMsg").innerHTML =
        "Address proof is required";
      return false;
    }
    else if (
      !this.categories.toLowerCase().includes("ship to") &&
      (this.partnershipDeedfile == "" || this.partnershipDeedfile == null) &&
      this.properties == "Partnership"
    ) {
      // console.log("patner")
      document.getElementById("partnershipDeedErrorMsg").innerHTML =
        "partnership Deed document is required";
      return false;
    } else if (
      !this.categories.toLowerCase().includes("ship to") &&
      (this.MOAfile == "" || this.MOAfile == null) &&
      (this.properties == "Pvt Ltd" || this.properties == "Limited")
    ) {
      // console.log("Moa")
      document.getElementById("MOAErrorMsg").innerHTML =
        "MOA document is required";
      return false;
    } else if (
      (this.categories == "Stockist" ||
        this.categories == "Retail Stockist" ||
        this.categories == "D2R Channel Partner" ||
        this.categories == "PRABHARI"
      ) &&
      (this.SalesTargetfile == "" || this.SalesTargetfile == null)
    ) {
      // console.log("sales")
      document.getElementById("SalesTargetErrorMsg").innerHTML =
        "Sales and Target file is required";
      return false;
    } else if (
      (this.Factoryvisitreportfile == "" ||
        this.Factoryvisitreportfile == null) &&
      (this.categories == "KAM IC" || this.categories == "IC")
    ) {
      // console.log("factory")
      document.getElementById("FactoryvisitreportErrorMsg").innerHTML =
        "Factory Visit document is required";
      return false;
    } else if (
      (this.Selfconsumptionfile == "" || this.Selfconsumptionfile == null) &&
      (this.categories == "KAM IC" || this.categories == "IC")
    ) {
      // console.log("self")
      document.getElementById("SelfconsumptionErrorMsg").innerHTML =
        "Self-Consumption file  is required";
      return false;
    } else if (
      (this.Rateapprovalfile == "" || this.Rateapprovalfile == null) &&
      (this.categories == "KAM IC" || this.categories == "IC")
    ) {
      // console.log("rate")
      document.getElementById("RateapprovalErrorMsg").innerHTML =
        "Rate approval file  is required";
      return false;
    }
    else if (this.GstPdffile == "" || this.GstPdffile == null) {
      document.getElementById("GstPdfErrorMsg").innerHTML =
        "GST Document(in PDF format) is Required";
    } else return true;
  }

  documentFileDetails() {
    // this.openConfirmationDialogBox(action,value)
  }
}
