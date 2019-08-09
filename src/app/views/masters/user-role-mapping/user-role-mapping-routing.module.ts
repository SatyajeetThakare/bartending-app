import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserRoleMappingListComponent } from './user-role-mapping-list/user-role-mapping-list.component';
import { AddUserRoleMappingComponent } from './add-user-role-mapping/add-user-role-mapping.component';

const routes: Routes = [
  {path: '', redirectTo: 'user-role-mapping-list', pathMatch: 'full'},
  {path: 'user-role-mapping-list', component: UserRoleMappingListComponent},
  {path: 'add-user-role-mapping', component: AddUserRoleMappingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoleMappingRoutingModule { }
