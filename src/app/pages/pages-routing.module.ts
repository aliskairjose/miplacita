import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ShopDetailsComponent
} from '../shared/custom-components/shop-details/shop-details.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { CartComponent } from './account/cart/cart.component';
import { ContactComponent } from './account/contact/contact.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
// MarkepPlace Routes
import { LoginComponent } from './account/login/login.component';
import { MyShopComponent } from './account/my-shop/my-shop.component';
import { RegisterComponent } from './account/register/register.component';
import { ErrorComponent } from './error/error.component';
import { FaqComponent } from './faq/faq.component';
import { OrdersComponent } from './orders/orders.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { ProductsComponent } from './products/products.component';
import { ShopDesignComponent } from './shops/shop-design/shop-design.component';
import { ShopProfileComponent } from './shops/shop-profile/shop-profile.component';
import { ShopSuscriptionComponent } from './shops/shop-suscription/shop-suscription.component';
import { ShopWithdrawalComponent } from './shops/shop-withdrawal/shop-withdrawal.component';
import { ShopsComponent } from './shops/shops.component';
import { SearchComponent } from '../pages/search/search.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { AccountManageComponent } from './account/account-manage/account-manage.component';

const routes: Routes = [

  {
    path: 'account/my-shop',
    component: MyShopComponent,
    canActivate: [ AuthGuard ]
  },
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
    path: 'create-product',
    component: CreateProductComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'edit-product/:id',
    component: CreateProductComponent,
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
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin/login',
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
    path: 'shop/profile',
    component: ShopProfileComponent,
    canActivate: [ AuthGuard ]

  },
  {
    path: 'shop/design',
    component: ShopDesignComponent,
    canActivate: [ AuthGuard ]

  },
  {
    path: 'shop/suscription',
    component: ShopSuscriptionComponent,
    canActivate: [ AuthGuard ]

  },
  {
    path: 'shop/withdrawal',
    component: ShopWithdrawalComponent,
    canActivate: [ AuthGuard ]

  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'termsandconditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'account/user/:page',
    component: AccountManageComponent,
    canActivate: [ AuthGuard ],
  },
  {
    path: 'account/user/admin-store/:page',
    component: AccountManageComponent,
    canActivate: [ AuthGuard ],
  }

];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class PagesRoutingModule { }
