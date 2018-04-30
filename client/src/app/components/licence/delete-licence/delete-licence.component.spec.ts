import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLicenceComponent } from './delete-licence.component';

describe('DeleteLicenceComponent', () => {
  let component: DeleteLicenceComponent;
  let fixture: ComponentFixture<DeleteLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
