import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./Guards/auth.guard";
import { ErrorsComponent } from "./errors/errors.component";

export const routes: Routes = [
  {
    path: "pages",
    loadChildren: () =>
      import("./Pages/web-pages/web-pages.module").then(
        (m) => m.WebPagesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "onboarding",
    loadChildren: () =>
      import("./Pages/onboarding/onboarding.module").then(
        (o) => o.OnboardingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./Pages/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./Pages/admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "error", component: ErrorsComponent },
];

// export const routes: Routes = [
//   {
//     path: 'pages',
//     loadChildren: () => import('./Pages/pages.module')
//       .then(m => m.PagesModule),
//   },
//   { path: '', redirectTo: 'pages', pathMatch: 'full' },
//   { path: '**', redirectTo: 'pages' },
// ];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  bootstrap: [AppComponent],
})
export class AppRoutingModule {}
