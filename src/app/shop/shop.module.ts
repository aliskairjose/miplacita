import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPayPalModule } from 'ngx-paypal';
import { Ng5SliderModule } from 'ng5-slider';
import { SharedModule } from '../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';

// Product Details Components
import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';

// Product Details Widgest Components
import { ServicesComponent } from './product/widgets/services/services.component';
import { CountdownComponent } from './product/widgets/countdown/countdown.component';
import { SocialComponent } from './product/widgets/social/social.component';
import { StockInventoryComponent } from './product/widgets/stock-inventory/stock-inventory.component';

// Collection Components
import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';

// Collection Widgets
import { GridComponent } from './collection/widgets/grid/grid.component';
import { PaginationComponent } from './collection/widgets/pagination/pagination.component';
import { PriceComponent } from './collection/widgets/price/price.component';

import { CartComponent } from './cart/cart.component';
import { CompareComponent } from './compare/compare.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';
import { ShopsComponent } from './collection/widgets/shops/shops.component';
import { ShippingComponent } from './checkout/shipping/shipping.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlertModule } from 'ngx-alerts';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { NgxMaskModule, IConfig } from 'ngx-mask';

// export let options: Partial<IConfig> | (() => Partial<IConfig>);
const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule( {
  declarations: [
    ProductLeftSidebarComponent,
    ServicesComponent,
    CountdownComponent,
    SocialComponent,
    StockInventoryComponent,
    CollectionLeftSidebarComponent,
    GridComponent,
    PaginationComponent,
    PriceComponent,
    CartComponent,
    CompareComponent,
    CheckoutComponent,
    SuccessComponent,
    ShopsComponent,
    ShippingComponent ],
  imports: [
    CommonModule,
    GooglePlaceModule,
    NgxSpinnerModule,
    NgxPayPalModule,
    Ng5SliderModule,
    SharedModule,
    ShopRoutingModule,
    NgxMaskModule.forRoot( maskConfig ),
    AgmCoreModule.forRoot( { apiKey: 'AIzaSyC7YdhqPz4rB-D8U7F4qxVokWDb8EWYOB4' } ),
    AlertModule.forRoot( { maxMessages: 5, timeout: 3000, position: 'left' } ),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

} )
export class ShopModule { }
