import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSuscriptionComponent } from './shop-suscription.component';

describe('ShopSuscriptionComponent', () => {
  let component: ShopSuscriptionComponent;
  let fixture: ComponentFixture<ShopSuscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopSuscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSuscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
