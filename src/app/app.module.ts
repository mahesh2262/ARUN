/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  APP_INITIALIZER,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ThemeModule } from "./@theme/theme.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from "@nebular/theme";
import { AppConfigService } from "./Services/app-config.service";

import { DialogBoxComponent } from "./Dialogs/dialog-box/dialog-box.component";
import { MaterialModule } from "./Pages/material/material.module";
import { TokenInterceptor } from "./Interceptors/token.interceptor";
import { PdfTemplateComponent } from "./Templates/pdf-template/pdf-template.component";
import { ErrorsComponent } from "./errors/errors.component";
import { BnNgIdleService } from "bn-ng-idle";
import {UserTemplateComponent} from "./user-template/user-template.component";
import {TeritoryTemplateComponent} from "./teritory-template/teritory-template.component";


@NgModule({
  declarations: [
    AppComponent,
    DialogBoxComponent,
    PdfTemplateComponent,
    ErrorsComponent,
    UserTemplateComponent,
    TeritoryTemplateComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    ThemeModule.forRoot(),
    MaterialModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      },
    },
    BnNgIdleService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
