import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductSlider, CollectionSlider } from '../../shared/data/slider';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';
import { ShopService } from '../../shared/services/shop.service';
import { StorageService } from '../../shared/services/storage.service';

@Component( {
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: [ './marketplace.component.scss' ]
} )
export class MarketplaceComponent implements OnInit, OnDestroy {

  themeLogo = 'assets/images/marketplace/svg/logo.svg'; // Change Logo
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
    {
      id: 1,
      isCollapsed: true,
      question: '¿Qué es MiPlacita.com?',
      answer: `Miplacita.shop es una tienda virtual que además de darte la posibilidad de vender tus productos  y/o servicios de forma online en dicha plataforma, te da las herramientas para personalizar tu propia tienda online.
      2 posibilidades de venta desde una misma plataforma virtual, logrando llegar a más clientes.`
    },
    {
      id: 2,
      isCollapsed: true,
      question: '¿Qué podré lograr si abro una tienda virtual dentro de miplacita.shop',
      answer: `Desde tu nueva tienda online podrás vender tus productos o servicios, promocionarlos en redes sociales, cobrarles a tus clientes, manejar tus entregas, manejar descuentos para clientes frecuentes, manejar tus informes de venta, tu inventario y mucho más.`
    },
    {
      id: 3,
      isCollapsed: true,
      question: '¿Cómo creo mi tienda virtual?',
      answer: `Es muy fácil y divertido crear tu tienda virtual dentro de miplacita.shop.  Solo escoge tu plan, crea tu perfil, diseña tu tienda y arranca a vender. Adjunto video. `
    },
    {
      id: 4,
      isCollapsed: true,
      question: '¿Cuánto cuestan los planes y que incluyen?',
      answer: `Hay Dos planes a escoger.
                PRIMERO- ES GRATIS
                SEGUNDO -  $8.88 al mes (Paga anual y ahorra)
                `
    },
    {
      id: 5,
      isCollapsed: true,
      question: '¿Cómo manejo mi tienda?',
      answer: `Podrás manejar tu tienda, tus inventarios, productos y ventas desde tu computadora, tablet y/o teléfonos inteligentes. Solo debes conectarte a la web y listo.`
    },
    {
      id: 6,
      isCollapsed: true,
      question: '¿Cuánto me cuesta vender en mi tienda virtual?',
      answer: `Como sabes, las tarjetas de crédito cobran a las tiendas para poder tener un punto de venta.
              3.4% de la venta + $0.35 por transacción.
              De los mejores precios del mercado local e internacional.`
    },
    {
      id: 7,
      isCollapsed: true,
      question: '¿Puedo promocionar mi tienda o productos específicos en mis redes sociales o WhatsApp?',
      answer: ``
    },
    {
      id: 8,
      isCollapsed: true,
      question: '¿Cómo vendo los productos de mi tienda virtual en la tienda principal de mi miplacita.shop ?',
      answer: `Al crear tu tienda virtual dentro de miplacita.shop, se te preguntará si quieres promocionar y vender los productos de tu tienda en la tienda principal.
              Al optar por la opción SI, podrás vender tus productos en nuestra tienda.  
              Al optar por la opción NO, tus productos no se promocionarán en la tienda principal de miplacita.shop.`
    },
    {
      id: 9,
      isCollapsed: true,
      question: '¿Qué gana la página principal al vender mis productos?',
      answer: `Tú. Al realizarse una venta, te llegará una notificación de lo que se vendió y de los detalles de la entrega que tienes que realizar. La página será únicamente un intermediario y no se hace responsable de las entregas o de los productos.`
    },
    {
      id: 10,
      isCollapsed: true,
      question: '¿Qué porcentaje se queda miplacita.shop si vendo en su perfil?',
      answer: `15% de la venta.`
    },
    {
      id: 11,
      isCollapsed: true,
      question: '¿Cómo y cuándo me pagan mis ventas?',
      answer: `Los pagos de las ventas de tus productos y servicios, tanto en tu tienda virtual como en la página principal, se harán semanales. Cierre los domingos media noche. Pago los lunes. El dinero será transferido a la cuenta bancaria registrada al momento de la apertura de la tienda. Dicha cuenta bancaria deberá tener el nombre del dueño de la tienda de ser una empresa natural, o el nombre de la empresa de ser una empresa jurídica. No se aceptará triangulación de dinero de ningún tipo.`
    },
    {
      id: 12,
      isCollapsed: true,
      question: 'Puedo actualizar mi cuenta de banco?',
      answer: `Claro, solo ve a tu perfil y listo. Deberás seguir las reglas mencionadas en el punto anterior.`
    },
    {
      id: 13,
      isCollapsed: true,
      question: '¿Cuentan con APIs para integrar con otras plataformas como Wix, Uber, etc?',
      answer: `No, por ahora no se pueden realizar integraciones ni tenemos un API, pero está en los planes a futuro.`
    },
    {
      id: 14,
      isCollapsed: true,
      question: '¿Puedo generar cobros recurrentes (mensualidad)?',
      answer: ``
    },
    {
      id: 15,
      isCollapsed: true,
      question: '¿Puedo hacer cobros por redes sociales o WhatsApp?',
      answer: ``
    },
    {
      id: 16,
      isCollapsed: true,
      question: '¿Puedo cobrarle a clientes en el extranjero?',
      answer: `¡Claro Por medio de nuestra plataforma de cobro podrá cobrar a todas partes del mundo. Solo asegúrate de estipular bien tu método de entregas.`
    },
    {
      id: 17,
      isCollapsed: true,
      question: '¿Cómo cobro las entregas?',
      answer: `Podrás ponerles costo a las distintas zonas del país según tu criterio. Mira este video.`
    },
    {
      id: 18,
      isCollapsed: true,
      question: '¿Cómo hago para saber si una persona ya me pagó?',
      answer: `La plataforma emitirá una notificación cada vez que se lleve acabo con éxito una venta.`
    },
    {
      id: 19,
      isCollapsed: true,
      question: '¿Qué método de pago se puede utilizar?',
      answer: `Podrás pagar con tarjeta de crédito mastercard o visa`
    },
    {
      id: 20,
      isCollapsed: true,
      question: '¿Me podrán pagar con tarjeta clave?',
      answer: `Pronto`
    },
  ];

  // beneficios
  basicBenefits = [
    'Catálogo limitado a 10 productos',
    'Inventario de 10 productos',
    'Chat integrado',
    'Url para redes sociales',
    'Edición de tienda',
    'Gestión de clientes'
  ];
  benefits = [
    'Control de inventario',
    'Gestión de clientes',
    'Transacciones ilimitadas',
    'Pasarela de Pago TDC',
    'Gestión de imagen de tienda',
    'Plan de compensaciones a clientes referidos',
    'Cupones de descuentos'
  ];

  isCollapsed = false;
  // banners
  verticalBanners = [
    '../../../../assets/images/marketplace/images/banners/recibe.png',
    '../../../../assets/images/marketplace/images/banners/administra.png',
    '../../../../assets/images/marketplace/images/banners/envia.png'
  ];
  constructor(
    private _sanitizer: DomSanitizer,
    private shopService: ShopService,
    public productService: ProductService,
    private storageService: StorageService,
  ) {
    this.storageService.removeItem( 'isStore' );
  }

  ngOnInit(): void {
    localStorage.removeItem( 'mp-store-shop' );
    this.shopService.storeSubject( {} );
    // Change color for this layout
    document.documentElement.style.setProperty( '--theme-deafult', '#e4604a' );
  }

  ngOnDestroy(): void {
    // Remove Color
    document.documentElement.style.removeProperty( '--theme-deafult' );
  }

  onClick( el: HTMLElement ) {
    el.scrollIntoView( { behavior: 'smooth' } );
  }

}
