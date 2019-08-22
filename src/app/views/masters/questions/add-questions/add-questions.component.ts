import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';

interface arrayItem {
  answerDescription: string;
  isValid: boolean;
};

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {

  questionForm: FormGroup;
  questionId: number = 0;
  pageTitle: string = 'Add Question';

  constructor(private formBuilder: FormBuilder,
    private httpService: HttpService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    try{
      this.route.params.subscribe(params => {

        this.questionId = params.questionId;
        console.log("questionId", params['questionId']);
        this.resetQuestionObject();
        this.buildForm();

        if(params['courseId'] > 0) {
          this.pageTitle = 'Edit Question';
        }
      });

    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  selectedChoiceIndex: number = 1;
  questionTypes: any[] = [
    { id: 1, choiceText: 'Description', isSelected: false },
    { id: 2, choiceText: 'Image', isSelected: false },
    { id: 3, choiceText: 'Video', isSelected: false }
  ];

  objQuestion: any;
  resetQuestionObject(){
    this.objQuestion = {
      questionType: 1,
      questionDescription: null,
      mappingId: 1,
      mappingType: 1,
      marks: null,
      answerDescription: []
    }
  }

  buildForm() {
    try {
      console.log('this.arrayItems', this.arrayItems)
      this.questionForm = this.formBuilder.group({
        questionType: [this.objQuestion.questionType, Validators.required],
        questionDescription: [this.objQuestion.questionDescription, Validators.required],
        mappingId: this.objQuestion.mappingId,
        mappingType: this.objQuestion.mappingType,
        marks: this.objQuestion.marks,
        answerDescription: this.formBuilder.array(this.arrayItems)
      });

      this.createArrayItems();
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  arrayItems: arrayItem[] = [];
  createArrayItems(){
    try{
      if(this.questionForm && this.questionForm.controls){
        let control = <FormArray>this.questionForm.controls.answerDescription;
        for(var i = 0; i <= 3; i++){
          control.push(this.formBuilder.group({answerDescription: null, isValid: false}));
        }
      }
    }catch(e){
      // console.log('e', e)
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  selectQuestionType(item: any){
    try{
      this.questionForm.patchValue({
        questionType: item.id
      })
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  showLoading: boolean = false;
  saveQuestion() {

    this.showLoading = true;

    this.questionForm.value.answerDescription.map(ele => {
    	ele.isValid = ele.isValid ? 1 : 0
      return ele
    });
    console.log(this.questionForm.value);

    let urlValue = this.questionId > 0 ? `UpdateQuestion` : `QuestionInsert`;
    let data = this.questionForm.value;

    this.httpService.post(urlValue, data).subscribe((res: any) => {
      console.log('res', res);
      this.showLoading = false;

      if(res && res.status.trim().toLowerCase() == 'success'){
        this.snackbarService.openSnackBar('Course added successfully', 'Close', 'success-snackbar');
        this.location.back();
      }else {
        this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
      }

    }, (err) => {
      this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
    });
  }

  public findInvalidControls() {

    console.log('this.questionForm', this.questionForm);

    const invalid = [];
    const controls = this.questionForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log('invalid controls');
    console.log(invalid);
  }
}
