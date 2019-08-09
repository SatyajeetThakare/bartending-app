import { NgModule, forwardRef, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../modules/shared.module';

import { QuestionsRoutingModule } from './questions-routing.module';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { AddQuestionsComponent } from './add-questions/add-questions.component';

@NgModule({
  imports: [
    CommonModule,
    QuestionsRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [QuestionsListComponent, AddQuestionsComponent]
})
export class QuestionsModule { }
