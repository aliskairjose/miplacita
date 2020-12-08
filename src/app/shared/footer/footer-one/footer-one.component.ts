import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService, Menu } from '../../services/nav.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';
import { Store } from '../../classes/store';
import { ShopService } from '../../services/shop.service';

@Component( {
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: [ './footer-one.component.scss' ]
} )
export class FooterOneComponent implements OnInit {

  @Input() class = 'footer-light';
  @Input() themeLogo = 'assets/images/icon/logo.png';
  @Input() newsletter = true;
  path = '/shop/collection/left/sidebar?name=&category=';
  menuItems: Category[] = [];

  public today: number = Date.now();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private categoryService: CategoryService ) {

  }

  ngOnInit(): void {
    this.categoryService.categoryList().subscribe( ( result: Category[] ) => {
      result.map( e => {
        this.menuItems.push( e );
      } );
    } );

    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        if ( queryParams.config ) {
          const decod = window.atob( queryParams.config );
          const store: Store = JSON.parse( decod );
          if ( Object.entries( store ).length !== 0 ) { this.themeLogo = store.logo; }
        }
        if ( queryParams.id ) { this.storeInfo( queryParams.id ); }
      }
    } );
  }

  routerTo( id ): void {
    this.router.navigateByUrl( `${this.path}${id}` );
  }

  private storeInfo( id: string ) {
    this.shopService.getStore( id ).subscribe( res => {
      this.themeLogo = res.result.logo;
    } );
  }

}
