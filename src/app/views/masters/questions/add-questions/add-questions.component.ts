import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {
  questionsForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.newForm();
    this.buildForm();
  }
  newForm() {
    try {
      this.questionsForm = new FormGroup({
        question: new FormControl(''),
        options: this.fb.array([]),
      });
    }
    catch (e) {

    }
  }
  buildForm() {
    const creds = this.questionsForm.controls.options as FormArray;
    creds.push(this.fb.group({
      option1: '',
      option2: '',
      option3: '',
      option4: '',
    }));
  }
  save() {
    console.log(this.questionsForm.value);
    this.saveSessionItem('questionObj',this.questionsForm.value);
  }
 saveSessionItem(keyName: string,data: any) {
  sessionStorage.setItem(keyName,JSON.stringify(data));
  }
}
