import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { User } from '../classes/user';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  $auth: Subject<any> = new Subject<any>();
  selectedUSer: User;
  
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

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   * @param isAuth
   */
  authSubject( isAuth: boolean ): void {
    this.$auth.next( isAuth );
  }

  /**
   * @description Creación del observer mediante el método asObserver(), el cual sera consumido por el componente
   * @returns Observable
   */
  authObserver(): Observable<any> {
    return this.$auth.asObservable();
  }

}
