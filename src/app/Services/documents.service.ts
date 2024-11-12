import {
  ImageResult,
  PANOCRResult,
  GSTOCRResult,
  AadharOCRResult,
  ChequeOCRResult,
  BankAccountResult,
  AttachmentDetails,
  DocumentDetails,
} from "./../Models/onboardingModel";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, Subject } from "rxjs";

import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AppConfigService } from "./app-config.service";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class DocumentsService {
  baseAddress: string;
  attestrAddress: string;
  attestrToken: string;
  files: File[] = [];
  NotificationEvent: Subject<any>;
  sample = new Subject();
  // personalInfo: PersonalInfo = null;

  constructor(
    private _httpClient: HttpClient,
    private _appConfig: AppConfigService,
    private _http: HttpService // private _authService: AuthService
  ) {
    this.baseAddress = this._appConfig.get("DOCUMENT_PROCESSING_ENDPOINT");
    this.attestrAddress = environment.attestrAddress;
    this.attestrToken = environment.attestrToken;
  }
  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<any> {
    return throwError(
      error.error instanceof Object
        ? error.error.Error
          ? error.error.Error
          : error.error.Message
          ? error.error.Message
          : error.error.message
        : error.error || error.message || "Server Error"
    );
  }

  UploadImage(selectedFile: File): Observable<ImageResult | string> {
    const formData: FormData = new FormData();
    formData.append("file", selectedFile);
    return this._httpClient
      .post<ImageResult>(
        `${this.attestrAddress}api/v1/public/media/image/multipart`,
        formData,
        {
          headers: new HttpHeaders({
            Authorization: `Basic ${this.attestrToken}`,
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  ExtractPANDetails(src: string): Observable<PANOCRResult | string> {
    return this._httpClient
      .post<PANOCRResult>(
        `${this.attestrAddress}api/v1/public/xtract`,
        { src: `${src}`, additional: null, type: "PAN" },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Basic ${this.attestrToken}`,
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  ExtractGSTDetails(src: string): Observable<GSTOCRResult | string> {
    return this._httpClient
      .post<GSTOCRResult>(
        `${this.attestrAddress}api/v1/public/xtract`,
        { src: `${src}`, additional: null, type: "GST" },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Basic ${this.attestrToken}`,
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  ExtractAadharDetails(src: string): Observable<AadharOCRResult | string> {
    return this._httpClient
      .post<AadharOCRResult>(
        `${this.attestrAddress}api/v1/public/xtract`,
        { src: `${src}`, additional: null, type: "UIDAI" },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Basic ${this.attestrToken}`,
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  ExtractChequeDetails(src: string): Observable<ChequeOCRResult | string> {
    return this._httpClient
      .post<ChequeOCRResult>(
        `${this.attestrAddress}api/v1/public/xtract`,
        { src: `${src}`, additional: null, type: "BANK_CHEQUE" },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Basic ${this.attestrToken}`,
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  uploadDocument(
    transId: string,
    selectedFile: File,
    DocumentType: string
  ): Observable<any> {
    const formData: FormData = new FormData();
    if (selectedFile) {
      formData.append(selectedFile.name, selectedFile, selectedFile.name);
    }
    formData.append("DocumentType", DocumentType);
    formData.append("TransID", transId);
    const URL = `${this.baseAddress}/UploadFile`;
    return this._http.postFile(URL, formData);
  }

  getFiles(transId: number): Observable<any> {
    const URL = `${this.baseAddress}/GetDocumentsByTransId?TransId=${transId}`;
    return this._http.get(URL);
  }

  getDocumentBydocId(docId: number): Observable<any> {
    if (docId == null || docId == undefined) {
      docId = 0;
    }
    const URL = `${this.baseAddress}/GetDocumentsByDocId?docId=${docId}`;
    return this._http.get(URL);
  }

  GetNotification(): Observable<any> {
    return this.NotificationEvent.asObservable();
  }

  TriggerNotification(eventName: string): void {
    this.NotificationEvent.next(eventName);
  }
}
