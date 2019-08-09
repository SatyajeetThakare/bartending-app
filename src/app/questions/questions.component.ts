import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.getSessionItem('questionObj');
    console.log( this.getSessionItem('questionObj'));
  }
Add(){
  this.router.navigate(['/add-questions']);
  console.log("Add button");
}
applyFilter(filterValue:string){
  console.log("Filter value is ",filterValue);
}
getSessionItem(keyname:string){
  return JSON.parse(sessionStorage.getItem(keyname));
}
}
