import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';


// Widgest Components
import { SliderComponent } from './widgets/slider/slider.component';
import { BlogComponent } from './widgets/blog/blog.component';
import { LogoComponent } from './widgets/logo/logo.component';
import { InstagramComponent } from './widgets/instagram/instagram.component';
import { CollectionComponent } from './widgets/collection/collection.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { MarketplaceShopComponent } from './marketplace-shop/marketplace-shop.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlertModule } from 'ngx-alerts';
import { RegisterComponent } from './marketplace-shop/register/register.component';

@NgModule( {
  declarations: [
    MarketplaceComponent,
    MarketplaceShopComponent,
    // Widgest Components
    LogoComponent,
    BlogComponent,
    SliderComponent,
    RegisterComponent,
    InstagramComponent,
    CollectionComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    AlertModule.forRoot( { maxMessages: 5, timeout: 3000, position: 'left' } ),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

} )
export class HomeModule { }
