import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleListComponent } from './role-list/role-list.component';
import { AddRoleComponent } from './add-role/add-role.component';

const routes: Routes = [
  {path: '', redirectTo: 'role-list', pathMatch: 'full'},
  {path: 'role-list', component: RoleListComponent},
  {path: 'add-role', component: AddRoleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
