import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

// Pages Components
import { WishlistComponent } from './account/wishlist/wishlist.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ContactComponent } from './account/contact/contact.component';
import { CheckoutComponent } from './account/checkout/checkout.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SearchComponent } from './search/search.component';
import { TypographyComponent } from './typography/typography.component';
import { ReviewComponent } from './review/review.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { CompareOneComponent } from './compare/compare-one/compare-one.component';
import { CompareTwoComponent } from './compare/compare-two/compare-two.component';
import { CollectionComponent } from './collection/collection.component';
import { LookbookComponent } from './lookbook/lookbook.component';
import { ErrorComponent } from './error/error.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { FaqComponent } from './faq/faq.component';
// Blog Components
import { BlogLeftSidebarComponent } from './blog/blog-left-sidebar/blog-left-sidebar.component';
import { BlogRightSidebarComponent } from './blog/blog-right-sidebar/blog-right-sidebar.component';
import { BlogNoSidebarComponent } from './blog/blog-no-sidebar/blog-no-sidebar.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
// Portfolio Components
import { GridTwoComponent } from './portfolio/grid-two/grid-two.component';
import { GridThreeComponent } from './portfolio/grid-three/grid-three.component';
import { GridFourComponent } from './portfolio/grid-four/grid-four.component';
import { MasonryGridTwoComponent } from './portfolio/masonry-grid-two/masonry-grid-two.component';
import { MasonryGridThreeComponent } from './portfolio/masonry-grid-three/masonry-grid-three.component';
import { MasonryGridFourComponent } from './portfolio/masonry-grid-four/masonry-grid-four.component';
import { MasonryFullWidthComponent } from './portfolio/masonry-full-width/masonry-full-width.component';
import { AlertModule } from 'ngx-alerts';
import { NgxSpinnerModule } from 'ngx-spinner';

import { GoogleChartsModule } from 'angular-google-charts';
import { ShopProfileComponent } from './shops/shop-profile/shop-profile.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ShopsComponent } from './shops/shops.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { NgxCurrencyModule, CurrencyMaskInputMode } from 'ngx-currency';
import { MyShopComponent } from './account/my-shop/my-shop.component';
import { ShopWithdrawalComponent } from './shops/shop-withdrawal/shop-withdrawal.component';
import { ShopSuscriptionComponent } from './shops/shop-suscription/shop-suscription.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { FormsModule } from '@angular/forms';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { AccountManageComponent } from './account/account-manage/account-manage.component';
import { UserOrdersComponent } from './account/user-orders/user-orders.component';
import { ChartsModule } from 'ng2-charts';
import { ShippingZonesComponent } from './shops/shipping-zones/shipping-zones.component';
import { SupportComponent } from './support/support.component';
import { CreateReferralsComponent } from './shops/create-referrals/create-referrals.component';
import { ReferralsComponent } from './shops/referrals/referrals.component';
import { ReportsComponent } from './shops/reports/reports.component';
import { DailySalesReportComponent } from './shops/daily-sales-report/daily-sales-report.component';
import { ClientsComponent } from './shops/clients/clients.component';
import { BestSellersComponent } from './shops/best-sellers/best-sellers.component';
import { TotalSalesComponent } from './shops/total-sales/total-sales.component';
import { InterestsComponent } from './interests/interests.component';
import { StoresListComponent } from './shops/stores-list/stores-list.component';
import { StorePageComponent } from './shops/store-page/store-page.component';
import { AdminReportsComponent } from './shops/admin-reports/admin-reports.component';
import { StorePaymentsComponent } from './shops/store-payments/store-payments.component';
import { StockComponent } from './shops/stock/stock.component';
import { SalesTdcComponent } from './shops/sales-tdc/sales-tdc.component';
import { PercentageMpProductsComponent } from './shops/percentage-mp-products/percentage-mp-products.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { MembershipsComponent } from './memberships/memberships.component';
import { CreateMembershipComponent } from './create-membership/create-membership.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PaymentManagerComponent } from './payment-manager/payment-manager.component';
import { InactiveStoreComponent } from './inactive-store/inactive-store/inactive-store.component';
// export let options: Partial<IConfig> | (() => Partial<IConfig>);
const maskConfig: Partial<IConfig> = {
  validation: false,
};

export const customCurrencyMaskConfig = {
  align: 'left',
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
    WishlistComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ProfileComponent,
    ContactComponent,
    CheckoutComponent,
    AboutUsComponent,
    SearchComponent,
    TypographyComponent,
    ReviewComponent,
    OrderSuccessComponent,
    CompareOneComponent,
    CompareTwoComponent,
    CollectionComponent,
    LookbookComponent,
    ErrorComponent,
    ComingSoonComponent,
    FaqComponent,
    BlogLeftSidebarComponent,
    BlogRightSidebarComponent,
    BlogNoSidebarComponent,
    BlogDetailsComponent,
    GridTwoComponent,
    GridThreeComponent,
    GridFourComponent,
    MasonryGridTwoComponent,
    MasonryGridThreeComponent,
    MasonryGridFourComponent,
    MasonryFullWidthComponent,
    ProductsComponent,
    ShopsComponent,
    OrdersComponent,
    CreateProductComponent,
    OrdersComponent,
    MyShopComponent,
    ShopProfileComponent,
    ShopsComponent,
    ShopWithdrawalComponent,
    ShopSuscriptionComponent,
    TermsAndConditionsComponent,
    AccountManageComponent,
    UserOrdersComponent,
    ShippingZonesComponent,
    SupportComponent,
    CreateReferralsComponent,
    ReferralsComponent,
    ReportsComponent,
    DailySalesReportComponent,
    ClientsComponent,
    BestSellersComponent,
    TotalSalesComponent,
    InterestsComponent,
    StoresListComponent,
    StorePageComponent,
    AdminReportsComponent,
    StorePaymentsComponent,
    StockComponent,
    SalesTdcComponent,
    PercentageMpProductsComponent,
    CommissionsComponent,
    MembershipsComponent,
    CreateMembershipComponent,
    PaymentManagerComponent,
    InactiveStoreComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    GalleryModule.forRoot(),
    PagesRoutingModule,
    NgxMaskModule.forRoot( maskConfig ),
    GoogleChartsModule.forRoot(),
    NgxCurrencyModule.forRoot( customCurrencyMaskConfig ),
    ColorPickerModule,
    AlertModule.forRoot( { maxMessages: 5, timeout: 3000, position: 'left' } ),
    ChartsModule,
    EditorModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

} )
export class PagesModule { }
