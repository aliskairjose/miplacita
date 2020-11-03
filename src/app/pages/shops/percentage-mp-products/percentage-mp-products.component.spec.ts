import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageMpProductsComponent } from './percentage-mp-products.component';

describe('PercentageMpProductsComponent', () => {
  let component: PercentageMpProductsComponent;
  let fixture: ComponentFixture<PercentageMpProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageMpProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageMpProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
