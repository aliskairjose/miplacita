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
    return this.http.post( 'users/login', data );
  }

  /**
   * @description Cierre de sesion del usuario
   */
  logout(): void {
    localStorage.removeItem('user');
  }

  /**
   * @description Registro de dueño de tienda
   * @param params Datos del registro
   */
  register( params: any ): Observable<any> {
    return this.http.post( 'users/register', params );
  }

  resetPassword( params: any ): Observable<any> {
    return this.http.post( 'users/reset-password', params );
  }

  /**
   * @description Retorna true si el usuario esta autenticado
   * @returns boolean
   */
  isAuthenticated(): boolean {
    const user = localStorage.getItem( 'user' );
    return (user) ? true : false;
  }

}
