import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseModuleListComponent } from './course-module-list.component';

describe('CourseModuleListComponent', () => {
  let component: CourseModuleListComponent;
  let fixture: ComponentFixture<CourseModuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseModuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseModuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
