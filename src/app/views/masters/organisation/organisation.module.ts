import { NgModule, forwardRef, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../modules/shared.module';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';
import { AddOrganisationComponent } from './add-organisation/add-organisation.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OrganisationRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ OrganisationListComponent, AddOrganisationComponent ]
})
export class OrganisationModule { }
