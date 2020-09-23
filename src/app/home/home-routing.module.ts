import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { MarketplaceShopComponent } from './marketplace-shop/marketplace-shop.component';
import { RegisterComponent } from './marketplace-shop/register/register.component';


const routes: Routes = [
  {
    path: '',
    component: MarketplaceShopComponent
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
