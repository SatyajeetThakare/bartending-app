import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionsListComponent } from './questions-list/questions-list.component';
import { AddQuestionsComponent } from './add-questions/add-questions.component';

const routes: Routes = [
  {path: '', redirectTo: 'questions-list', pathMatch: 'full'},
  {path: 'questions-list', component: QuestionsListComponent},
  {path: 'add-questions', component: AddQuestionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }
