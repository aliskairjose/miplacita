import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  @Input() themeLogo = 'assets/images/marketplace/svg/logo.svg';
  @Input() newsletter = true;
  @Input() store: Store = {};

  menuItems: Category[] = [];
  subCategories = [];
  public today: number = Date.now();

  private storeId = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private categoryService: CategoryService
  ) {

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
          if ( Object.entries( store ).length !== 0 ) {
            this.themeLogo = store.logo;
            this.subCategoryList( store._id );
          }
        }
        if ( queryParams.id ) { this.storeInfo( queryParams.id ); }
      }
    } );
  }

  routerTo( id: string, type: string ): void {
    let path = '';
    ( type === 'category' )
      ? path = `/shop/collection/left/sidebar?category=${id}`
      : path = `/shop/collection/left/sidebar?store=${this.storeId}&subcategory=${id}`;

    this.router.navigateByUrl( path );
  }

  private storeInfo( id: string ) {
    this.shopService.getStore( id ).subscribe( ( store: Store ) => this.themeLogo = store.logo );
  }

  subCategoryList( id: string ): void {
    this.storeId = id;
    const params = `store=${id}`;
    this.categoryService.getSubcategory( params ).subscribe( subcategories => {
      this.subCategories = [ ...subcategories ];
    } );
  }

}
