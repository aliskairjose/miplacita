import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// MarkepPlace Routes
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ErrorComponent } from './error/error.component';
import { FaqComponent } from './faq/faq.component';
import { CartComponent } from './account/cart/cart.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { ContactComponent } from './account/contact/contact.component';
import { ShopsComponent } from './shops/shops.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './create-product/create-product/create-product.component';

const routes: Routes = [

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'shops',
    component: ShopsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
    canActivate: [ AuthGuard ]
  },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forget/password',
    component: ForgetPasswordComponent
  },
  {
    path: 'aboutus',
    component: AboutUsComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: '404',
    component: ErrorComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  }
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class PagesRoutingModule { }
