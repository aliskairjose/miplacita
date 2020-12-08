import { Component, Injectable, PLATFORM_ID, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { map, delay, withLatestFrom, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
declare var gtag;
@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent implements OnChanges {

  // For Progressbar
  loaders = this.loader.progress$.pipe(
    delay( 1000 ),
    withLatestFrom( this.loader.progress$ ),
    map( v => v[ 1 ] ),
  );

  constructor(
    @Inject( PLATFORM_ID ) private platformId: Object,
    private loader: LoadingBarService,
    translate: TranslateService,
    private router: Router
  ) {
    if ( isPlatformBrowser( this.platformId ) ) {
      translate.setDefaultLang( 'es' );
      translate.addLangs( [ 'en', 'fr', 'es' ] );
    }
    const navEndEvents$ = this.router.events.pipe(
      filter( event => event instanceof NavigationEnd )
    );

    navEndEvents$.subscribe( ( event: NavigationEnd ) => {
      gtag( 'config', 'G-FNK35J6HGH', {
        page_path: event.urlAfterRedirects
      } );
    } );
  }
  ngOnChanges( changes: SimpleChanges ): void {
  }

}
