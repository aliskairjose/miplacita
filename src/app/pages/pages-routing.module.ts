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
import { ShopComponent } from '../shop/shop.component';
import { ProductsComponent } from './products/products.component';
import { ShopsComponent } from './shops/shops.component';

const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'productos',
    component: ProductsComponent
  },
  {
    path: 'shops',
    component: ShopComponent,
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
  },
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [ AuthGuard ]
  }
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class PagesRoutingModule { }
