import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class HttpInterceptor implements HttpInterceptor {

  constructor() { }

  intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
    // return next.handle(request);
    const token = JSON.parse( localStorage.getItem( 'token' ) );
    if ( token ) {
      request = request.clone( { headers: request.headers.set( 'Authorization', `JWT ${token}` ) } );
    }

    if ( !request.headers.has( 'Content-Type' ) ) {
      request = request.clone( { headers: request.headers.set( 'Content-Type', 'application/json' ) } );
    }

    request = request.clone( { headers: request.headers.set( 'Accept', 'application/json' ) } );
   
    return next.handle( request ).pipe(
      map( ( event: HttpEvent<any> ) => {
        if ( event instanceof HttpResponse ) {
          // console.log( 'event--->>>', event );
        }
        return event;
      } ),
      catchError( ( error: HttpErrorResponse ) => {
        console.log( error );
        return throwError( error );
      } )
    );
  }
}
