import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';

export interface QuestionElement {
  QuestionDescription: string;
  Marks: string;
}

const ELEMENT_DATA: QuestionElement[] = [];

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  displayedColumns: string[] = ['QuestionDescription', 'Marks','action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private router: Router,
    private snackbarService: SnackbarService,
    private httpService: HttpService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit() {
    this.getSessionItem('questionObj');
    console.log( this.getSessionItem('questionObj'));
    this.getQuestionList();
  }

  addQuestion(){
    this.router.navigate(['/questions/add-questions', {questionId: 0}]);
    console.log("Add button");
  }

  applyFilter(filterValue:string){
    console.log("Filter value is ", filterValue);
  }

  getSessionItem(keyname:string){
    return JSON.parse(sessionStorage.getItem(keyname));
  }

  list_questions: any [];
  getQuestionList(){
    this.httpService.get(`QuestionSelect`).subscribe((res: any) =>{
      this.list_questions = res.data;
      this.dataSource = new MatTableDataSource(this.list_questions);
      console.log("this.list_questions", this.list_questions);
    });
  }
}
