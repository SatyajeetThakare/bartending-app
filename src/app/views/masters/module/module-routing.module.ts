import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleListComponent } from './module-list/module-list.component';
import { AddModuleComponent } from './add-module/add-module.component';


const routes: Routes = [
  {path: '', redirectTo: 'module-list', pathMatch: 'full'},
  {path: 'module-list', component: ModuleListComponent},
  {path: 'add-module', component: AddModuleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleRoutingModule { }
