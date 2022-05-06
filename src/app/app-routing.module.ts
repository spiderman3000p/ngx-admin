import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MsalGuard } from "@azure/msal-angular";

export const routes: Routes = [
  {
    path: "pages",
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
    canActivate: [MsalGuard],
  },
  { path: "", redirectTo: "pages", pathMatch: "full" },
  { path: "**", redirectTo: "pages" },
];
const isIframe = window !== window.parent && !window.opener;
const config: ExtraOptions = {
  useHash: false,
  initialNavigation: !isIframe ? "enabled" : "disabled", // Don't perform initial navigation in iframes
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
