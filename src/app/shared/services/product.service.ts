import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../classes/product';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpService
  ) { }

  productList(): Observable<Product[]> {
    return this.http.get<Product[]>('');
  }
}
