import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {

  questionForm: FormGroup;

  constructor(private fb: FormBuilder,
    private httpService: HttpService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {

    this.createArrayItems();
    this.newForm();
    this.buildForm();
  }

  createArrayItems(){
    try{
      for(var i = 0; i <= 3; i++){
        this.arrayItems.push({answerDescription: null, isValid: true});
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  selectedChoiceIndex: number = 1;
  questionTypes: any[] = [
    { id: 1, choiceText: 'Description', isSelected: false },
    { id: 2, choiceText: 'Image', isSelected: false },
    { id: 3, choiceText: 'Video', isSelected: false }
  ]

  arrayItems: {
    answerDescription: string;
    isValid: boolean;
  }[];

  // arrayItem: arrayItems[];

  newForm() {
    try {
      this.questionForm = new FormGroup({
        questionType: new FormControl(''),
        questionDescription: new FormControl(''),
        questionArray: this.fb.array([])
      });
    }
    catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  buildForm() {
    const creds = this.questionForm.controls.options as FormArray;
    creds.push(this.fb.group({
      option1: '',
      option2: '',
      option3: '',
      option4: '',
    }));
  }

  save() {
    console.log(this.questionForm.value);
    this.saveSessionItem('questionObj',this.questionForm.value);
  }

  saveSessionItem(keyName: string,data: any) {
    sessionStorage.setItem(keyName,JSON.stringify(data));
  }
}
