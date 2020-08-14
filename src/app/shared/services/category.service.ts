import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Returna la lista de categorias!
   */
  categoryList(): Observable<any> {
    return this.http.get('categories');
  }
}
