import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';

import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';

import { CartComponent } from './cart/cart.component';
import { CompareComponent } from './compare/compare.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';

import { Resolver } from '../shared/services/resolver.service';
import { ShippingComponent } from './checkout/shipping/shipping.component';

const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductLeftSidebarComponent
  },
  {
    path: 'collection/left/sidebar',
    component: CollectionLeftSidebarComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'compare',
    component: CompareComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'checkout/shipping',
    component: ShippingComponent
  },
  {
    path: 'checkout/success',
    component: SuccessComponent
  },
  {
    path: 'register/success',
    component: SuccessComponent
  }
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class ShopRoutingModule { }
