import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';

/**
 * Generated class for the TaskDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
})
export class TaskDetailPage {
  title;
  description;
  inputDescription;
  item;
  key;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public tasksProvier: TasksProvider) {
    this.item = navParams.get('item');
    this.key = navParams.get('key');
    console.log(this.item);
    console.log("key is lol " + this.key);
  }

  ionViewDidLoad() {
    this.title = this.navParams.get('item').title;
    this.description = this.navParams.get('item').description;
  }

  updateDetails(){
    //console.log("sweet");
    //this.description = "changed";

  }

  fbSave(){
    console.log("in fb save the key is " + this.key);
    this.tasksProvier.updateTask(this.key, this.item);
  }

  saveDes(){
    this.navParams.get('item').title = this.title;
    this.navParams.get('item').description = this.description;
    document.getElementById("saveButton").innerHTML = "Saved";
  }

  unsave(){
    console.log("init");
    document.getElementById("saveButton").innerHTML = "Save";
  }

}
