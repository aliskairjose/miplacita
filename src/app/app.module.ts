import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
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
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-alerts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData( localeEs );

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
    FormsModule,
    SharedModule,
    HttpClientModule,
    NgxSpinnerModule,
    AppRoutingModule,
    GooglePlaceModule,
    SocialLoginModule,
    LoadingBarRouterModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp( firebaseConfig ),
    AngularFireAuthModule,
    NgxMaskModule.forRoot( maskConfig ),
    LoadingBarHttpClientModule,
    AgmCoreModule.forRoot( { apiKey: 'AIzaSyC7YdhqPz4rB-D8U7F4qxVokWDb8EWYOB4' } ),
    NgxCurrencyModule.forRoot( customCurrencyMaskConfig ),
    AlertModule.forRoot( { maxMessages: 5, timeout: 3000, position: 'left' } ),
    BrowserModule.withServerTransition( { appId: 'serverApp' } ),
    ToastrModule.forRoot( { timeOut: 1500, progressBar: false, enableHtml: true, } ),
    TranslateModule.forRoot( {
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    } ),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider( '335844084556891' ), // ID Alfredo
          }
        ],
      } as SocialAuthServiceConfig,
    },
    AuthGuard
  ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

} )
export class AppModule { }
