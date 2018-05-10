import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostWorksComponent } from './post-works.component';

describe('PostWorksComponent', () => {
  let component: PostWorksComponent;
  let fixture: ComponentFixture<PostWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
