import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { FashionOneComponent } from './fashion/fashion-one/fashion-one.component';
import { FashionTwoComponent } from './fashion/fashion-two/fashion-two.component';
import { FashionThreeComponent } from './fashion/fashion-three/fashion-three.component';
import { VegetableComponent } from './vegetable/vegetable.component';
import { WatchComponent } from './watch/watch.component';
import { FurnitureComponent } from './furniture/furniture.component';
import { FlowerComponent } from './flower/flower.component';
import { BeautyComponent } from './beauty/beauty.component';
import { ElectronicsComponent } from './electronics/electronics.component';
import { PetsComponent } from './pets/pets.component';
import { GymComponent } from './gym/gym.component';
import { ToolsComponent } from './tools/tools.component';
import { ShoesComponent } from './shoes/shoes.component';
import { BagsComponent } from './bags/bags.component';
import { MarijuanaComponent } from './marijuana/marijuana.component';

// Widgest Components
import { SliderComponent } from './widgets/slider/slider.component';
import { BlogComponent } from './widgets/blog/blog.component';
import { LogoComponent } from './widgets/logo/logo.component';
import { InstagramComponent } from './widgets/instagram/instagram.component';
import { ServicesComponent } from './widgets/services/services.component';
import { CollectionComponent } from './widgets/collection/collection.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { MarketplaceShopComponent } from './marketplace-shop/marketplace-shop.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlertModule } from 'ngx-alerts';
import { RegisterComponent } from './marketplace-shop/register/register.component';

@NgModule({
  declarations: [
    FashionOneComponent,
    FashionTwoComponent,
    FashionThreeComponent,
    VegetableComponent,
    WatchComponent,
    FurnitureComponent,
    FlowerComponent,
    BeautyComponent,
    ElectronicsComponent,
    PetsComponent,
    GymComponent,
    ToolsComponent,
    ShoesComponent,
    BagsComponent,
    MarijuanaComponent,
    MarketplaceComponent,
    MarketplaceShopComponent,
    // Widgest Components
    LogoComponent,
    BlogComponent,
    SliderComponent,
    RegisterComponent,
    ServicesComponent,
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

})
export class HomeModule { }
