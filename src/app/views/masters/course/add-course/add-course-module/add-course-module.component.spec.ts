import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseModuleComponent } from './add-course-module.component';

describe('AddCourseModuleComponent', () => {
  let component: AddCourseModuleComponent;
  let fixture: ComponentFixture<AddCourseModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCourseModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCourseModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
