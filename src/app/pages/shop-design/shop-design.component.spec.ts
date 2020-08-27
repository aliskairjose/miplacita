import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDesignComponent } from './shop-design.component';

describe('ShopDesignComponent', () => {
  let component: ShopDesignComponent;
  let fixture: ComponentFixture<ShopDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
