import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import { AuthGuard } from './services/auth.guard';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: '', component: LoginComponent, pathMatch: "full" },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'questions', loadChildren: './views/masters/questions/questions.module#QuestionsModule'},
  { path: 'user-dashboard', loadChildren: './views/user-dashboard/user-dashboard.module#UserDashboardModule'},
  { path: 'course', loadChildren: './views/masters/course/course.module#CourseModule', canActivate: [AuthGuard] },
  { path: 'organisation', loadChildren: './views/masters/organisation/organisation.module#OrganisationModule', canActivate: [AuthGuard] },
  { path: 'module', loadChildren:'./views/masters/module/module.module#ModuleModule', canActivate:  [AuthGuard]},
  { path: 'role', loadChildren: './views/masters/role/role.module#RoleModule', canActivate: [AuthGuard] },
  { path: 'user', loadChildren: './views/masters/user/user.module#UserModule', canActivate: [AuthGuard] },
  { path: 'user-role-mapping', loadChildren: './views/masters/user-role-mapping/user-role-mapping.module#UserRoleMappingModule', canActivate: [AuthGuard] },
  // { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,
    {
      enableTracing: false, // <-- debugging purposes only
      preloadingStrategy: SelectivePreloadingStrategyService,
    }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
