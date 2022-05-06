/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { AnalyticsService } from "./@core/utils/analytics.service";
import { SeoService } from "./@core/utils/seo.service";
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from "@azure/msal-angular";
import {
  AuthenticationResult,
  InteractionStatus,
  InteractionType,
  PopupRequest,
  RedirectRequest,
} from "@azure/msal-browser";
import { filter, map, take, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { NbMenuService } from "@nebular/theme";
import { HttpClient } from "@angular/common/http";
import { NbAuthService } from "@nebular/auth";
import { StateService } from "./@core/utils";

const GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0/me";
@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  isIframe = false;
  loginDisplay = false;
  profile: Object;
  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadcastService: MsalBroadcastService,
    private authService: MsalService,
    private stateService: StateService,
    private nbMenuService: NbMenuService,
    private http: HttpClient
  ) {}

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    this.nbMenuService.onItemClick().subscribe((contextMenuItem: any) => {
      if (contextMenuItem?.item?.title == "Profile") {
      } else if (contextMenuItem?.item?.title == "Log out") {
        this.logout();
      }
    });
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        if (!this.loginDisplay) {
          this.login();
        } else {
          this.getProfile();
        }
      });
  }

  getProfile() {
    this.http
      .get(GRAPH_ENDPOINT)
      .pipe(take(1))
      .subscribe((profile) => {
        console.log("user profile", profile);
        this.stateService.setUserState(profile);
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService
          .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService
          .loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({
          ...this.msalGuardConfig.authRequest,
        } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  logout() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
    } else {
      this.authService.logoutRedirect({
        postLogoutRedirectUri: "/",
      });
    }
  }
}
