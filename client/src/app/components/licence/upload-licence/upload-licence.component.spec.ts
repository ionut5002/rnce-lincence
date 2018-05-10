import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLicenceComponent } from './upload-licence.component';

describe('UploadLicenceComponent', () => {
  let component: UploadLicenceComponent;
  let fixture: ComponentFixture<UploadLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
