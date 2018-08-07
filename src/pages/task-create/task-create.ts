import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
/**
 * Generated class for the TaskCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-task-create',
  templateUrl: 'task-create.html',
})
export class TaskCreatePage {

  title: string;
  description: string;

  constructor(public navCtrl: NavController, 
    public view: ViewController,
    public tasksProvider: TasksProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskCreatePage');
  }


  saveItem(){
 
    let newItem = {
      title: this.title,
      description: this.description
    };
 
    this.view.dismiss(newItem);
 
  }
 
  close(){
    this.view.dismiss();
  }

    createEvent(
      taskTitle: string,
      taskDesciption: string,
      taskDate: string,
      taskCategory: string
    ): void {




      console.log("in create event method");
      //revserse date
      taskDate = this.reverseDate(taskDate);
      if(taskDesciption == undefined){
       taskDesciption = " ";
      }
      if(taskCategory == undefined){
        taskCategory = "Default";
      }
      this.tasksProvider
        .createTask(taskTitle, taskDesciption, taskDate, taskCategory)
        .then(newEvent => {
          this.navCtrl.pop();
        });
    }

    /*
    Used for revsering the date
    */
    reverseDate(date){
      var newDate = date.substring(9,10);
      var year = date.substring(0,4);
      var month = date.substring(5,7);
      var day = date.substring(8,10);
      return day+"-"+month+"-"+year;
    }
}
