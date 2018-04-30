import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceComponent } from './licence.component';

describe('LicenceComponent', () => {
  let component: LicenceComponent;
  let fixture: ComponentFixture<LicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
