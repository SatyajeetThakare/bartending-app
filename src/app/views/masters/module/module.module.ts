import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleRoutingModule } from './module-routing.module';
import { ModuleListComponent } from './module-list/module-list.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { SharedModule } from 'src/app/modules/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,    
    ModuleRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ ModuleListComponent, AddModuleComponent ]
})
export class ModuleModule { }
