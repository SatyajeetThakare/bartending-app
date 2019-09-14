import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-course-exam',
  templateUrl: './course-exam.component.html',
  styleUrls: ['./course-exam.component.scss']
})
export class CourseExamComponent implements OnInit {

  constructor(
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private snackbarService: SnackbarService
  ) { }
  p: number = 1;
  moduleId: number = 0;
  objSessionInfo: any;
  pageTitle: string = 'Add Module';
  ngOnInit() {
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    this.route.params.subscribe(params => {

      this.moduleId = params.moduleId;
      console.log('this.moduleId', this.moduleId)
      if(params['moduleId'] > 0) {
        this.pageTitle = 'Exam Questions';
        this.getModuleDetails();
      }
    });
  }
  module_list:any[] = [];
  getModuleDetails(){
    try{

      let data = {
        courseId: 1
      }

      this.httpService.post('GetCourseModules', data).subscribe((res: any) => {
        console.log('res', res)
        this.module_list = res.data[5];
        this.getQuestions();
        if(res && res.status.trim().toLowerCase() != 'success'){
          this.snackbarService.openSnackBar(res.message, 'Close', 'success-snackbar');
        }
      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  @ViewChild('videoPlayer',{static:true}) videoplayer: ElementRef;

  toggleVideo(event: any) {
      this.videoplayer.nativeElement.play();
  }
  list_questions:any [] =[];
  getQuestions(){
    try{
    this.httpService.get('QuestionSelect').subscribe((res:any) =>{
      this.list_questions = res.data;
      console.log(res);
      this.getAnswer();
      if(res && res.status.trim().toLowerCase() != 'success'){
        this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
      }
    }, (err) => {
      this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
    });
  }
  catch(e){
    this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
  }
  }
  list_answers: any[] =[];
  getAnswer(){
    //AnswerSelect
    try{
      this.httpService.post('QuestionSelectById',{ questionid:1}).subscribe((res:any) =>{
        this.list_answers = res.data;
        console.log(this.list_answers);
        if(res && res.status.trim().toLowerCase() != 'success'){
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    }
    catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  submitted:boolean = false;
  submit(){
    this.submitted = true;
  }
}
