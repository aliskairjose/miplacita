import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BarRatingModule } from 'ngx-bar-rating';
import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';

// Header and Footer Components
import { HeaderOneComponent } from './header/header-one/header-one.component';
import { FooterOneComponent } from './footer/footer-one/footer-one.component';
import { HeaderTwoComponent } from './header/header-two/header-two.component';
import { FooterTwoComponent } from './footer/footer-two/footer-two.component';
import { HeaderThreeComponent } from './header/header-three/header-three.component';
import { FooterThreeComponent } from './footer/footer-three/footer-three.component';
import { HeaderFourComponent } from './header/header-four/header-four.component';
import { FooterFourComponent } from './footer/footer-four/footer-four.component';

// Components
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { MenuComponent } from './components/menu/menu.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ProductBoxOneComponent } from './components/product/product-box-one/product-box-one.component';
// custom components
import { RegisterStoreComponent } from './components/register-store/register-store.component';

// Modals Components
import { NewsletterComponent } from './components/modal/newsletter/newsletter.component';
import { QuickViewComponent } from './components/modal/quick-view/quick-view.component';
import { CartModalComponent } from './components/modal/cart-modal/cart-modal.component';
import { CartVariationComponent } from './components/modal/cart-variation/cart-variation.component';
import { VideoModalComponent } from './components/modal/video-modal/video-modal.component';
import { AgeVerificationComponent } from './components/modal/age-verification/age-verification.component';

// Skeleton Loader Components
import { SkeletonProductBoxComponent } from './components/skeleton/skeleton-product-box/skeleton-product-box.component';

// Layout Box
import { LayoutBoxComponent } from './components/layout-box/layout-box.component';

// Tap To Top
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';

// Pipes
import { FilterPipe } from './pipes/filter.pipe';
import { DiscountPipe } from './pipes/discount.pipe';

import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { AlertModule } from 'ngx-alerts';
import { NgxCurrencyModule, CurrencyMaskInputMode } from 'ngx-currency';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { ShopDetailsComponent } from './components/shop-details/shop-details.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { ShopSubmenuComponent } from './components/shop-submenu/shop-submenu.component';
import { TimelineComponent } from './components/timeline/timeline.component';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './services/confirmation-dialog.service';
import { SearchComponent } from './components/search/search.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ShopCardComponent } from './components/shop-card/shop-card.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CommentsComponent } from './components/comments/comments.component';
import { ModalNewElementComponent } from './components/modal-new-element/modal-new-element.component';
import { AddressComponent } from './components/address/address.component';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { ClipboardModule } from 'ngx-clipboard';
import { FiltersComponent } from './components/filters/filters.component';
import { SearchStoreComponent } from './components/search-store/search-store.component';
import { ShopDesignComponent } from './components/shop-design/shop-design.component';

// export let options: Partial<IConfig> | (() => Partial<IConfig>);
const maskConfig: Partial<IConfig> = {
  validation: false,
};

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};
@NgModule( {
  declarations: [
    ShopDesignComponent,
    AddressComponent,
    HeaderOneComponent,
    FooterOneComponent,
    HeaderTwoComponent,
    FooterTwoComponent,
    HeaderThreeComponent,
    FooterThreeComponent,
    HeaderFourComponent,
    FooterFourComponent,
    LeftMenuComponent,
    MenuComponent,
    SettingsComponent,
    BreadcrumbComponent,
    CategoriesComponent,
    ProductBoxOneComponent,
    NewsletterComponent,
    QuickViewComponent,
    CartModalComponent,
    CartVariationComponent,
    VideoModalComponent,
    AgeVerificationComponent,
    SkeletonProductBoxComponent,
    LayoutBoxComponent,
    TapToTopComponent,
    RegisterStoreComponent,
    CustomPaginationComponent,
    PaymentComponent,
    SuccessModalComponent,
    ShopDetailsComponent,
    ConfirmationDialogComponent,
    // Pipes
    DiscountPipe,
    FilterPipe,
    OrderDetailsComponent,
    UploadImageComponent,
    ShopSubmenuComponent,
    TimelineComponent,
    SearchComponent,
    ShopCardComponent,
    PaymentComponent,
    CommentsComponent,
    ModalNewElementComponent,
    AddressComponent,
    FiltersComponent,
    SearchStoreComponent,
  ],
  imports: [
    ClipboardModule,
    NgxCurrencyModule.forRoot( customCurrencyMaskConfig ),
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    NgxSpinnerModule,
    BarRatingModule,
    NgxMaskModule.forRoot( maskConfig ),
    AlertModule.forRoot( { maxMessages: 5, timeout: 3000, position: 'left' } ),
    LazyLoadImageModule.forRoot( {
      // preset: scrollPreset // <-- tell LazyLoadImage that you want to use scrollPreset
    } ),
    NgxSkeletonLoaderModule,
    TranslateModule,
    GooglePlaceModule,
    ColorPickerModule,
    AgmCoreModule.forRoot( { apiKey: 'AIzaSyC7YdhqPz4rB-D8U7F4qxVokWDb8EWYOB4' } )
  ],
  exports: [
    ShopDesignComponent,
    AddressComponent,
    NgxSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    BarRatingModule,
    LazyLoadImageModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
    HeaderOneComponent,
    FooterOneComponent,
    HeaderTwoComponent,
    FooterTwoComponent,
    HeaderThreeComponent,
    FooterThreeComponent,
    HeaderFourComponent,
    FooterFourComponent,
    BreadcrumbComponent,
    CategoriesComponent,
    ProductBoxOneComponent,
    NewsletterComponent,
    QuickViewComponent,
    CartModalComponent,
    CartVariationComponent,
    VideoModalComponent,
    AgeVerificationComponent,
    SkeletonProductBoxComponent,
    LayoutBoxComponent,
    TapToTopComponent,
    RegisterStoreComponent,
    CustomPaginationComponent,
    PaymentComponent,
    SuccessModalComponent,
    UploadImageComponent,
    ConfirmationDialogComponent,
    // Pipes
    DiscountPipe,
    FilterPipe,
    ShopDetailsComponent,
    OrderDetailsComponent,
    ShopSubmenuComponent,
    TimelineComponent,
    SearchComponent,
    ShopCardComponent,
    CommentsComponent,
    ModalNewElementComponent,
    FiltersComponent
  ],
  providers: [ ConfirmationDialogService ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

} )
export class SharedModule { }
