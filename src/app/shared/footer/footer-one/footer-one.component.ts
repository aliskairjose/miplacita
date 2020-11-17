import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavService, Menu } from '../../services/nav.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';

@Component( {
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: [ './footer-one.component.scss' ]
} )
export class FooterOneComponent implements OnInit {

  @Input() class: string = 'footer-light' // Default class 
  @Input() themeLogo: string = 'assets/images/icon/logo.png' // Default Logo
  @Input() newsletter: boolean = true; // Default True
  path = '/shop/collection/left/sidebar?name=&category=';
  menuItems: Category[] = [];
  public today: number = Date.now();

  constructor(
    private router: Router,
    private categoryService: CategoryService ) {

  }

  ngOnInit(): void {
    this.categoryService.categoryList().subscribe( ( result: Category[] ) => {
      result.map( e => {
        if ( e.name === 'Ropa' ||
          e.name === 'joyeria y bisuteria' ||
          e.name === 'Electronica' ||
          e.name === 'Hogar y cocina' ||
          e.name === 'Articulos de belleza' ||
          e.name === 'Salud' ||
          e.name === 'Vehiculos' ) {
          this.menuItems.push( e );
        }
      } )
    } );
  }

  routerTo( id ): void {
    this.router.navigateByUrl( `${this.path}${id}` );
  }

}
