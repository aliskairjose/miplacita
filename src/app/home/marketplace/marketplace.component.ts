import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductSlider, CollectionSlider } from '../../shared/data/slider';
import { Product } from '../../shared/classes/tm.product';
import { ProductService } from '../../shared/services/tm.product.service';

@Component( {
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: [ './marketplace.component.scss' ]
} )
export class MarketplaceComponent implements OnInit, OnDestroy {

  themeLogo = 'assets/images/marketplace/images/logo-m.png'; // Change Logo
  products: Product[] = [];
  productCollections: any[] = [];
  ProductSliderConfig: any = ProductSlider;
  CollectionSliderConfig: any = CollectionSlider;
  sliders = [
    {
      image: 'assets/images/marketplace/images/banners/banner_rosa.jpg'
    }
  ];

  // Logo
  logos = [
    {
      image: 'assets/images/logos/1.png',
    }, {
      image: 'assets/images/logos/2.png',
    }, {
      image: 'assets/images/logos/3.png',
    }, {
      image: 'assets/images/logos/4.png',
    }, {
      image: 'assets/images/logos/5.png',
    }, {
      image: 'assets/images/logos/6.png',
    }, {
      image: 'assets/images/logos/7.png',
    }, {
      image: 'assets/images/logos/8.png',
    }
  ];

  // Collection
  categories = [
    {
      image: 'assets/images/categories/1.png',
      title: 'watch models',
      text: this._sanitizer.bypassSecurityTrustHtml( '<li><a href="#">d1 milano</a></li><li><a href="#">damaskeening</a></li><li><a href="#">diving watch</a></li><li><a href="#">dollar watch</a></li>' ),
    }, {
      image: 'assets/images/categories/2.png',
      title: 'calculator watch',
      text: this._sanitizer.bypassSecurityTrustHtml( '<li><a href="#">Shock-resistant watch</a></li><li><a href="#">Skeleton watch</a></li><li><a href="#">Slow watch</a></li><li><a href="#">Solar-powered watch</a></li>' ),
    }, {
      image: 'assets/images/categories/3.png',
      title: 'Antimagnetic watch',
      text: this._sanitizer.bypassSecurityTrustHtml( '<li><a href="#">Watchmaking conglomerates</a></li><li><a href="#">Breitling SA</a></li><li><a href="#">Casio watches</a></li><li><a href="#">Citizen Watch</a></li>' ),
    }, {
      image: 'assets/images/categories/4.png',
      title: 'History of watches',
      text: this._sanitizer.bypassSecurityTrustHtml( '<li><a href="#">Manufacture dhorlogerie</a></li><li><a href="#">Mechanical watch</a></li><li><a href="#">Microbrand watches</a></li><li><a href="#">MIL-W-46374</a></li>' ),
    }, {
      image: 'assets/images/categories/1.png',
      title: 'watch models',
      text: this._sanitizer.bypassSecurityTrustHtml( '<li><a href="#">d1 milano</a></li><li><a href="#">damaskeening</a></li><li><a href="#">diving watch</a></li><li><a href="#">dollar watch</a></li>' ),
    }
  ];

  // collection
  collections = [
    {
      image: 'assets/images/collection/watch/1.jpg',
      title: 'minimum 10% off',
      text: 'new watch'
    }, {
      image: 'assets/images/collection/watch/2.jpg',
    }, {
      image: 'assets/images/collection/watch/3.jpg',
      title: 'minimum 10% off',
      text: 'gold watch`'
    }
  ];

  // Blog
  blogs = [
    {
      image: 'assets/images/blog/10.jpg',
      date: '25 January 2018',
      title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
      by: 'John Dio'
    }, {
      image: 'assets/images/blog/11.jpg',
      date: '26 January 2018',
      title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
      by: 'John Dio'
    }, {
      image: 'assets/images/blog/12.jpg',
      date: '27 January 2018',
      title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
      by: 'John Dio'
    }, {
      image: 'assets/images/blog/13.jpg',
      date: '28 January 2018',
      title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
      by: 'John Dio'
    }
  ];

  // preguntas frecuentes 
  questions = [
    { id:1,
      isCollapsed: true,
      question: '¿Cómo Empiezo?',
      answer: 'Muy fácil! Descarga el app, Crea tu Tienda Online en sólo 3 pasos y empieza a vender.'+
              'Sólo te toma 3 minutos!' + 'Agrega tus primeros productos, empieza a compartir tu catálogo y a Vender.' 
    },
    { id:2,
      isCollapsed: true,
      question: '¿Cómo puedo cobrar a mi cliente?',
      answer: 'Muy fácil! Descarga el app, Crea tu Tienda Online en sólo 3 pasos y empieza a vender.'+
              'Sólo te toma 3 minutos!' + 'Agrega tus primeros productos, empieza a compartir tu catálogo y a Vender.' 
    },
    { id:3,
      isCollapsed: true,
      question: '¿Cómo cuesta la aplicación?',
      answer: 'Muy fácil! Descarga el app, Crea tu Tienda Online en sólo 3 pasos y empieza a vender.'+
              'Sólo te toma 3 minutos!' + 'Agrega tus primeros productos, empieza a compartir tu catálogo y a Vender.' 
    },
    { id:4,
      isCollapsed: true,
      question: '¿Hay alguna comisión adicional?',
      answer: 'Muy fácil! Descarga el app, Crea tu Tienda Online en sólo 3 pasos y empieza a vender.'+
              'Sólo te toma 3 minutos!' + 'Agrega tus primeros productos, empieza a compartir tu catálogo y a Vender.' 
    },
    { id:5,
      isCollapsed: true,
      question: '¿Cómo puedo crear y compartir mi catálogo?',
      answer: 'Muy fácil! Descarga el app, Crea tu Tienda Online en sólo 3 pasos y empieza a vender.'+
              'Sólo te toma 3 minutos!' + 'Agrega tus primeros productos, empieza a compartir tu catálogo y a Vender.' 
    },
    { id:6,
      isCollapsed: true,
      question: '¿Puedo tener tenderos propios?',
      answer: 'Muy fácil! Descarga el app, Crea tu Tienda Online en sólo 3 pasos y empieza a vender.'+
              'Sólo te toma 3 minutos!' + 'Agrega tus primeros productos, empieza a compartir tu catálogo y a Vender.' 
    },
    { id:7,
      isCollapsed: true,
      question: '¿Cómo puedo generar más ingresos?',
      answer: 'Muy fácil! Descarga el app, Crea tu Tienda Online en sólo 3 pasos y empieza a vender.'+
              'Sólo te toma 3 minutos!' + 'Agrega tus primeros productos, empieza a compartir tu catálogo y a Vender.' 
    },
    { id:8,
      isCollapsed: true,
      question: '¿Tengo algún soporte, si necesito ayuda?',
      answer: 'Muy fácil! Descarga el app, Crea tu Tienda Online en sólo 3 pasos y empieza a vender.'+
              'Sólo te toma 3 minutos!' + 'Agrega tus primeros productos, empieza a compartir tu catálogo y a Vender.' 
    }
  ]
  isCollapsed =false;
  // banners 
  verticalBanners = [
    '../../../../assets/images/marketplace/images/banners/recibe.png',
    '../../../../assets/images/marketplace/images/banners/administra.png',
    '../../../../assets/images/marketplace/images/banners/envia.png'
  ];
  constructor(
    private _sanitizer: DomSanitizer,
    public productService: ProductService,
  ) {
    this.productService.getProducts.subscribe( response => {
      this.products = response.filter( item => item.type === 'watch' );
      // Get Product Collection
      this.products.filter( ( item ) => {
        item.collection.filter( ( collection ) => {
          const index = this.productCollections.indexOf( collection );
          if ( index === -1 ) { this.productCollections.push( collection ); }
        } );
      } );
    } );
  }



  ngOnInit(): void {
    // Change color for this layout
    document.documentElement.style.setProperty( '--theme-deafult', '#e4604a' );
  }

  ngOnDestroy(): void {
    // Remove Color
    document.documentElement.style.removeProperty( '--theme-deafult' );
  }

  // Product Tab collection
  getCollectionProducts( collection ) {
    return this.products.filter( ( item ) => {
      if ( item.collection.find( i => i === collection ) ) {
        return item;
      }
    } );
  }

}
