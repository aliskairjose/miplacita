import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { PagesComponent } from './pages/pages.component';
import { ElementsComponent } from './elements/elements.component';

import 'hammerjs';
import 'mousetrap';
import { HttpInterceptor } from './shared/interceptor/http.interceptor';
import { AuthGuard } from './shared/guard/auth.guard';
import { NgxCurrencyModule, CurrencyMaskInputMode } from 'ngx-currency';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from '../environments/firebaseConfig';
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';

// export let options: Partial<IConfig> | (() => Partial<IConfig>);
const maskConfig: Partial<IConfig> = {
  validation: false,
};

// AoT requires an exported function for factories
export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, './assets/i18n/', '.json' );
}

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule( {
  declarations: [
    AppComponent,
    ShopComponent,
    PagesComponent,
    ElementsComponent
  ],
  imports: [
    NgbModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    LoadingBarRouterModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp( firebaseConfig ),
    AngularFireAuthModule,
    NgxMaskModule.forRoot( maskConfig ),
    LoadingBarHttpClientModule,
    NgxCurrencyModule.forRoot( customCurrencyMaskConfig ),
    BrowserModule.withServerTransition( { appId: 'serverApp' } ),
    ToastrModule.forRoot( { timeOut: 3000, progressBar: false, enableHtml: true, } ),
    TranslateModule.forRoot( { loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [ HttpClient ] } } ),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider( '1067702780312136' ),
          }
        ],
      } as SocialAuthServiceConfig,
    },
    AuthGuard
  ],
  bootstrap: [ AppComponent ]

} )
export class AppModule { }
