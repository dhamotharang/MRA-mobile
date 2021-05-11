import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from  './../../providers/loading-provider';
import { Storage } from '@ionic/storage';

// import * as $ from "jquery";



@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  // private contactList = [
  //   {contact_name: 'muhammad ali',contact:'012-3456678'},
  //   {contact_name: 'muhammad ali',contact:'012-3456678'},
  //   {contact_name: 'muhammad ali',contact:'012-3456678'},
  //   {contact_name: 'muhammad ali',contact:'012-3456678'}
  // ]

  counter:any = 0;
  // orgId:any = this.navParams.get('orgId');
  // existList:any = this.navParams.get('existList');
  selectedBox: any[];
  createList: any;
  contactList:any = [];
  personid:any;
  profile: any;


  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    public loadingProvider: LoadingProvider,
    public  restProvider: RestProvider,
  ) { }

  ionViewWillEnter(){
    this.getContact();
    console.log("Value from ionViewWillEnter");

  }

  ionViewDidEnter(){
    console.log('exist list from sos-org', this.contactList);
    this.storage.get('defaultProfile').then((val:any) => {
      console.log("val from ionViewDidEnter",val)
      this.personid = val;
      this.getList();
    });
    this.storage.get('defaultPersonId').then((val:any) => {
      console.log("val from defaultPersonId",val)
    });
  }

  ngOnInit() {
  //take data fromm previous page
  //   this.route.queryParams.subscribe(params => {
  //   console.log('ngOnInit',params)
  //   if (this.router.getCurrentNavigation().extras.state) {
  //     this.data = this.router.getCurrentNavigation().extras.state.user;
  //     this.role = this.router.getCurrentNavigation().extras.state.role;
  //     this.fee = this.router.getCurrentNavigation().extras.state.fee;
  //     console.log('data',this.data)
  //     console.log('role',this.role)
  //   }
  // });
    this.getOrg()
  }

  getOrg(){
    // this.loadingProvider.presentLoading();
    this.storage.get('defaultProfile').then((val:any) => {   //untuk guna storage
      console.log("val from getOrg",val)
      this.profile= val
    })

  }

  getList(){

    this.storage.get('personOrgs').then((val:any) => {
      console.log('personOrgs value is', val);
      this.counter = 1;
      console.log("orgId",val);
      this.restProvider.getContactCounter(val,this.counter).then((result:any) => {
        console.log('return data ',result);
        this.contactList = result;
        this.checkList();
        //this.loadingProvider.closeSearching();
      }, (err) => {
        console.log(err);
        this.showAlert();
        //this.loadingProvider.closeSearching();
      });

    });
  }

  showAlert() {
    throw new Error('Method not implemented.');
  }

  checkList(){
    console.log('exis list in checklist', this.contactList); //
    this.selectedBox = [];
    for(let i = 0; i < this.contactList.length; i++) {
      this.selectedBox.push(false);
    }
    if(this.contactList.length > 0){
      // let filtered = [];
      for(let i=0; i<this.contactList.length; i++){ //
        for(let x=0; x<this.contactList.length; x++){
          var a = JSON.stringify(this.contactList[x].id);
          var b = JSON.stringify(this.contactList[i].ice);
          if( a == b ){
            console.log("if sama the splice");
            this.contactList.splice(x,1);
          }
        }
      }
      // this.contactList = filtered;
    }
    console.log("after splice ", this.contactList);
    let filtered_2 = [];
    console.log('updated contact list', this.contactList);
    if(this.createList.length > 0){
      for(let x=0; x<this.contactList.length; x++){
        for(let i=0; i<this.createList.length; i++){
          var a = JSON.stringify(this.contactList[x].id);
          var b = JSON.stringify(this.createList[i].ice);
          if( a == b ){
            console.log("sama");
            filtered_2.push(x);
          }
        }
      }
    }
    if(filtered_2.length == 0){
      //$( ".checkboxes" ).prop( "checked", false);//uncheck all
    }else{
      for(let i=0; i<filtered_2.length; i++){
        let index = filtered_2[i];
        this.selectedBox[index] = true;
      }
    }
    //this.loadingProvider.closeSearching();
  }

  getContact(){               //to get list of contact
    //this.loadingProvider.setupLoading();
    // this.restProvider.getEmergencyList(66384).then((result:any) => {
    //   console.log("this is result value",result);
    //   console.log("this.personid",this.profile);
    //   if(result == null){
    //     this.contactList = [];
    //   }else{
    //     this.contactList = result;  //give value to contactList from result
    //   }
    //   console.log(result);
    //   //this.loadingProvider.closeLoading();
    // }, (err) => {
    //   console.log(err);
    //   //this.loadingProvider.closeLoading();
    //   this.showAlert();
    // });

    this.storage.get('defaultProfile').then((val:any) => {   //untuk guna storage
      console.log("val from getOrg",val)
      this.profile= val
      this.restProvider.getEmergencyList(this.profile.personId).then((result:any) => {
        //console.log("this is result value",result);
        console.log("this.personid",this.profile.personId);
        if(result == null){
          this.contactList = [];
        }else{
          this.contactList = result;  //give value to contactList from result
        }
        console.log(result);
        //this.loadingProvider.closeLoading();
      }, (err) => {
        console.log(err);
        //this.loadingProvider.closeLoading();
        this.showAlert();
      });
    })
  }

}
