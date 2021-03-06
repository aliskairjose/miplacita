import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopComponent } from './shop/shop.component';
import { PagesComponent } from './pages/pages.component';
import { ElementsComponent } from './elements/elements.component';
import { StorePageComponent } from './pages/shops/store-page/store-page.component';
// import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'pages/login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    redirectTo: 'pages/register',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import( './home/home.module' ).then( m => m.HomeModule )
  },
  {
    path: 'shop',
    component: ShopComponent,
    loadChildren: () => import( './shop/shop.module' ).then( m => m.ShopModule )
  },
  {
    path: 'pages',
    component: PagesComponent,
    loadChildren: () => import( './pages/pages.module' ).then( m => m.PagesModule )
  },
  {
    path: 'elements',
    component: ElementsComponent,
    loadChildren: () => import( './elements/elements.module' ).then( m => m.ElementsModule )
  },
  {
    path: ':name',
    component: StorePageComponent,
  },
  {
    path: '**', // Navigate to Home Page if not found any page
    redirectTo: 'home',
  },
];

@NgModule( {
  imports: [
    RouterModule.forRoot( routes, {
      initialNavigation: 'enabled',
      useHash: false,
      onSameUrlNavigation: 'ignore',
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top'
    } ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
