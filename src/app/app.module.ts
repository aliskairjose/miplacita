import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { NgxSpinnerModule } from 'ngx-spinner';

// AoT requires an exported function for factories
export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, './assets/i18n/', '.json' );
}

@NgModule( {
  declarations: [
    AppComponent,
    ShopComponent,
    PagesComponent,
    ElementsComponent
  ],
  imports: [
    BrowserModule.withServerTransition( { appId: 'serverApp' } ),
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    ToastrModule.forRoot( {
      timeOut: 3000,
      progressBar: false,
      enableHtml: true,
    } ),
    TranslateModule.forRoot( {
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    } ),
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true },
    AuthGuard
  ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

} )
export class AppModule { }
