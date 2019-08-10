import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.getSessionItem('questionObj');
    console.log( this.getSessionItem('questionObj'));
  }

  addQuestion(){
    this.router.navigate(['/questions/add-questions']);
    console.log("Add button");
  }

  applyFilter(filterValue:string){
    console.log("Filter value is ", filterValue);
  }

  getSessionItem(keyname:string){
    return JSON.parse(sessionStorage.getItem(keyname));
  }
}
