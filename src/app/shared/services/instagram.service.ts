import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { INSTAGRAM_TOKEN } from '../classes/global-constants';

@Injectable( {
  providedIn: 'root'
} )
export class InstagramService {

  // Initialize
  constructor( private http: HttpClient ) { }

  // Instagram Array
  public get getInstagramData() {
    return this.http.get( 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + INSTAGRAM_TOKEN + '&count=15' );
  }

}
