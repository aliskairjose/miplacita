import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSubmenuComponent } from './shop-submenu.component';

describe('ShopSubmenuComponent', () => {
  let component: ShopSubmenuComponent;
  let fixture: ComponentFixture<ShopSubmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopSubmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
