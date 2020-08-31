import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Category } from '../classes/category';

@Injectable( {
  providedIn: 'root'
} )
export class CategoryService {

  constructor(
    private http: HttpService,
  ) { }

  /**
   * @description Agrega una nueva categoria
   * @param data Data de la categoria
   */
  addCategory( data: any ): Observable<any> {
    return this.http.post( 'categories', data );
  }

  /**
   * @description Actualiza la categoria
   * @param data Data de la categoria a actualizar
   */
  updateCategory( id: string, data: Category ): Observable<any> {
    return this.http.put( `categories/${id}`, data );
  }

  /**
   * @description Elimina una categoria por ID
   * @param id Id de la categoria a eliminar
   */
  deleteCategory(id: string): Observable<any> {
    return this.http.delete( `categories/${id}` );
  }
 
  /**
   * @description Lista las categorias existentes
   */
  listCategory(): Observable<any> {
    return this.http.get( `categories` );
  }
}
