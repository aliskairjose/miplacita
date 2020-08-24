import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopWithdrawalComponent } from './shop-withdrawal.component';

describe('ShopWithdrawalComponent', () => {
  let component: ShopWithdrawalComponent;
  let fixture: ComponentFixture<ShopWithdrawalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopWithdrawalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
