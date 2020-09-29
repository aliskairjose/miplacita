import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReferralsComponent } from './create-referrals.component';

describe('CreateReferralsComponent', () => {
  let component: CreateReferralsComponent;
  let fixture: ComponentFixture<CreateReferralsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReferralsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
