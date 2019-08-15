import { NgModule, forwardRef, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../modules/shared.module';

import { CourseRoutingModule } from './course-routing.module';
import { CourseListComponent } from './course-list/course-list.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { AddCourseModuleComponent } from './add-course/add-course-module/add-course-module.component';
import { CourseModuleListComponent } from './add-course/course-module-list/course-module-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CourseRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ CourseListComponent, AddCourseComponent, AddCourseModuleComponent, CourseModuleListComponent ]
})
export class CourseModule { }
