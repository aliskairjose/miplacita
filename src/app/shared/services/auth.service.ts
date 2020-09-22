import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { User } from '../classes/user';
import { AuthResponse } from '../classes/auth-response';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  $auth: Subject<any> = new Subject<any>();
  selectedUSer: User;

  constructor(
    private router: Router,
    private http: HttpService,
    private toastrService: ToastrService,
  ) { }

  /**
   * @description Login de usuario
   * @param data Email y Password
   */
  login( data: any ): Observable<AuthResponse> {
    return this.http.post( 'users/login', data );
  }

  socialLogin( data: any ): Observable<AuthResponse> {
    return this.http.post( 'users/login/rrss', data );
  }

  /**
   * @description Cierre de sesion del usuario
   */
  logout(): void {
    localStorage.removeItem( 'user' );
    localStorage.removeItem( 'token' );
    localStorage.removeItem( 'products' );
    this.router.navigate( [ '/home' ] );
    this.authSubject( false );
  }

  /**
   * @description Actualización de la perfil del usuario
   * @param data Data del usuario que actualiza
   */
  updateUser( data: any ): Observable<any> {
    return this.http.put( `users`, data );
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
    return ( user ) ? true : false;
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   */
  authSubject( isAuth: boolean ): void {
    if ( !isAuth ) { this.toastrService.info( 'Hasta luego...' ); }
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
