import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedLicenceComponent } from './closed-licence.component';

describe('ClosedLicenceComponent', () => {
  let component: ClosedLicenceComponent;
  let fixture: ComponentFixture<ClosedLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
