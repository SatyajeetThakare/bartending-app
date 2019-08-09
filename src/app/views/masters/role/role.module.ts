import { NgModule, forwardRef, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../modules/shared.module';

import { RoleRoutingModule } from './role-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { AddRoleComponent } from './add-role/add-role.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RoleRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ RoleListComponent, AddRoleComponent ]
})
export class RoleModule { }
