import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDashboardComponent } from './user-dashboard.component';
import { CourseExamComponent } from './course-exam/course-exam.component';

const routes: Routes = [
  {path: '', redirectTo: 'user-dashboard', pathMatch: 'full'},
  {path: 'user-dashboard', component: UserDashboardComponent},
  {path: 'course-exam', component:CourseExamComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule { }
