import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganisationListComponent } from './organisation-list/organisation-list.component';
import { AddOrganisationComponent } from './add-organisation/add-organisation.component';

const routes: Routes = [
  {path: '', redirectTo: 'organisation-list', pathMatch: 'full'},
  {path: 'organisation-list', component: OrganisationListComponent},
  {path: 'add-organisation', component: AddOrganisationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule { }
