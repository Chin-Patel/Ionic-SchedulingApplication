import { Component } from '@angular/core';
import { NavController, 
        ModalController,
        ToastController,
        AlertController,
        ItemSliding
      } from 'ionic-angular';
import { TaskCreatePage } from '../task-create/task-create';
import { TaskDetailPage } from '../task-detail/task-detail';
import { TasksProvider } from '../../providers/tasks/task';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //For the search bar
  public isSearchbarOpened = false;

  //Stores all the tasks retrvied from firebase which are to be completed
  public items = [];

  //Stores all the completed tasks
  public completedItems = [];

  //Stores the corresponding tasks
  public missedItems = [];
  public todaysItems = [];
  public tomorrowsItems = [];
  public upcomingItems = [];

  //Variables for the altert when deleting tasks
  testRadioOpen: boolean;
  testRadioResult;

  constructor(public alertCtrl: AlertController, 
    private toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public tasksProvider : TasksProvider  ,
    public completedTasksProvider : CompletedTasksProvider  
  ) {

  }

  ionViewDidLoad(){
    this.tasksProvider.getTasksList().on("value", eventListSnapshot => {
      this.items = [];
      this.todaysItems = [];
      this.tomorrowsItems = [];
      this.upcomingItems = [];
      this.missedItems = [];
      eventListSnapshot.forEach(snap => {
        this.items.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
        //return false;
      });
      this.items.reverse();
      this.populateToday();
    });
  }


  /*
  * Returns today's date
  */
  getTodaysDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    dd = this.formatDays(dd);
    mm = this.formatMonths(mm);
    return dd + '-' + mm + '-' + yyyy;
  }

  formatDays(dd){
    if(dd < 10) return '0' + dd;
    return dd;
  }

  formatMonths(mm){
    if(mm < 10) return '0' + mm;
    return mm;
  }

  d(){

  }

  dateStructure(date){
    var split = date.split('-');
    return split[2] + "-" + split[1] + "-" +split[0];
  }


  populateToday(){
    let today = Date.parse(this.dateStructure(this.getTodaysDate()));
    let tomorrow = Date.parse(this.dateStructure(this.getTomorrowsDate()));
    for(let i  = 0; i < this.items.length; i++){
      let itemDate = Date.parse(this.dateStructure(this.items[i].taskDate));
      if(itemDate == today) this.todaysItems.push(this.items[i]);
      else if(itemDate == tomorrow) this.tomorrowsItems.push(this.items[i]);
      else if(itemDate < today) this.missedItems.push(this.items[i]);
      else if(itemDate > tomorrow) this.upcomingItems.push(this.items[i]);
      else {
        console.log("Shouldn't get in here");
        console.log("Date that got here is " + this.items[i].taskDate);
      }
    }
  }


  getTomorrowsDate(){
    var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    day = this.formatDays(day);
    month = this.formatMonths(month);
    return day + "-" + month + "-" + year;
  }

  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskDetailPage, {
      item: item,
      key: itemId
    });
  }

  getCompletetionTime(){
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"+(currentdate.getMonth()+1) 
    + "/" + currentdate.getFullYear() + " at " 
    + currentdate.getHours() + ":" 
    + currentdate.getMinutes();
    return datetime;
  }

  /*
  Complete tasks test
  */
  addToCompletedTasks(item){
    this.completedTasksProvider
      .addCompletedTask(item.taskTitle, item.taskDescription, 
        item.taskDate, item.taskCategory, this.getCompletetionTime()).then(newEvent=>{
          this.deleteFB(item.id);
        });
  }

  deleteFB(key){
    this.tasksProvider.deleteTask(key);
  }
 
  addItem(){
    let addModal = this.modalCtrl.create(TaskCreatePage);
 
    addModal.onDidDismiss((item) => {

    });
    addModal.present();
  }
 
  viewItem(item){
    this.navCtrl.push(TaskDetailPage, {
      item: item
    });
  }

  /*
  Search bar functionality
  */
  getItems(ev) {
    // Reset items back to all of the items
    this.ionViewDidLoad();
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    this.A(ev);
    this.B(ev);
    this.C(ev);
    this.D(ev);
  }

  A(ev){
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.missedItems = this.missedItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  B(ev){
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.todaysItems = this.todaysItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  C(ev){
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.tomorrowsItems = this.tomorrowsItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  D(ev){
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.upcomingItems = this.upcomingItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


  /*
  For the swiping gesture
  */

  expandAction(item: ItemSliding, _: any, text: string) {
    // TODO item.setElementClass(action, true);
    setTimeout(() => {
      const toast = this.toastCtrl.create({
        message: text
      });
      toast.present();
      // TODO item.setElementClass(action, false);
      item.close();
      setTimeout(() => toast.dismiss(), 2000);
    }, 1500);
  }

  /*
  Alert when deleting
  */


 showConfirm(item) {
  const confirm = this.alertCtrl.create({
    title: 'Confirmation',
    message: 'Are you sure you want to delete the task?',
    buttons: [
      {
        text: 'Yes',
        handler: () => {
          console.log('Yes clicked');
          this.deleteFB(item.id);
        }
      },
      {
        text: 'No',
        handler: () => {
          console.log('No clicked');
          return;
        }
      }
    ]
  });
  confirm.present();
}
}