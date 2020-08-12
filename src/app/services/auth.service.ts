import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Login de usuario
   * @param data Email y Password
   */
  login( data: any ): Observable<any> {
    return this.http.post( 'endpoint', data );
    // return this.http.post( '/users/login', data ).pipe(
    //   map( resp => resp.user as IUser )
    // );
  }

  /**
   * @description Registro de dueño de tienda
   * @param params Datos del registro
   */
  register( params: any ): Observable<any> {
    return this.http.post( '/users', params );
  }

  resetPassword( params: any ): Observable<any> {
    return this.http.post( '/users/reset-password', params );
  }

  /**
   * @description Retorna true si el usuario esta autenticado
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return true;
  }

}
