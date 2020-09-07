import { NgModule } from '@angular/core';
import { AuthGuard } from '../shared/guard/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { MarketplaceShopComponent } from './marketplace-shop/marketplace-shop.component';
import { LoginComponent } from './marketplace-shop/login/login.component';
import { RegisterComponent } from './marketplace-shop/register/register.component';


const routes: Routes = [
  {
    path: '',
    component: MarketplaceShopComponent
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
    path: 'marketplace',
    component: MarketplaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
