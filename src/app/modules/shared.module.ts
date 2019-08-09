import { NgModule, forwardRef, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppBootstrapModule } from './app-bootstrap.module';
import { AppMaterialModule } from './app-material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppBootstrapModule,
    AppMaterialModule
  ],
  exports: [
    AppBootstrapModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class SharedModule { }
