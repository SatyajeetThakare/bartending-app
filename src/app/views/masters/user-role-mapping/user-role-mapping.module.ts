import { NgModule, forwardRef, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../modules/shared.module';

import { UserRoleMappingRoutingModule } from './user-role-mapping-routing.module';
import { UserRoleMappingListComponent } from './user-role-mapping-list/user-role-mapping-list.component';
import { AddUserRoleMappingComponent } from './add-user-role-mapping/add-user-role-mapping.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoleMappingRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ UserRoleMappingListComponent, AddUserRoleMappingComponent ]
})
export class UserRoleMappingModule { }
