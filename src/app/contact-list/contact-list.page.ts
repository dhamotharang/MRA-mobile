import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController} from '@ionic/angular';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from  './../../providers/loading-provider';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';

//import * as $ from "jquery";



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
  selectedBox:any = [];
  // createList: any;
  private createList=[];
  contactList:any = [];
  personid:any;
  profile: any;
  //ModalController: any;


  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    public loadingProvider: LoadingProvider,
    public  restProvider: RestProvider,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ionViewWillEnter(){
    this.getContact();
    console.log("Value from ionViewWillEnter");

  }

  ionViewDidEnter(){
    console.log('exist list from sos-org', this.contactList);
    this.storage.get('defaultProfile').then((val:any) => {
      //console.log("val from ionViewDidEnter",val)
      this.personid = val;
      this.getList();
    });
    this.storage.get('defaultPersonId').then((val:any) => {
      //console.log("val from defaultPersonId",val)
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
      //console.log("val from getOrg",val)
      this.profile= val
    })

  }

  getList(){

    this.storage.get('personOrgs').then((val:any) => {
      //console.log('personOrgs value is', val);
      this.counter = 1;
      //console.log("orgId",val);
      this.restProvider.getContactCounter(val,this.counter).then((result:any) => {
        console.log('return data ',result);
        this.contactList = result;
        console.log("getContactCounter", this.contactList);
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
    console.log('selectedBox',this.selectedBox)
    //this.loadingProvider.closeSearching();
  }

  getContact(){               //to get list of contact

    this.storage.get('defaultProfile').then((val:any) => {   //untuk guna storage
      //console.log("val from getOrg",val)
      this.profile= val
      this.restProvider.getEmergencyList(this.profile.personId).then((result:any) => {
        //console.log("this is result value",result);
        //console.log("this.personid",this.profile.personId);
        if(result == null){
          this.contactList = [];
        }else{
          this.contactList = result;  //give value to contactList from result
        }
        console.log("getContact result",result);
        //this.loadingProvider.closeLoading();
      }, (err) => {
        console.log(err);
        //this.loadingProvider.closeLoading();
        this.showAlert();
      });
    })
  }

  async addContact(){
    let totalLength = this.contactList.length + this.createList.length;
    console.log('total length',totalLength);
    console.log('exist length',this.contactList.length);
    console.log('create length',this.createList.length);
    if(this.createList.length < 1){
      //this.modalCtrl.dismiss({data:this.contactList});
      console.log(this.createList);
      //this.loadingProvider.setupSaving();
      this.restProvider.createEmergencyContact(this.createList).then((result:any) => {
        console.log("Addcontact result",result);
        console.log("After clicking done");
        this.getContact();
      }, (err) => {
        console.log(err);
        //this.loadingProvider.closeSaving();
        //this.showAlert();
      });
      console.log("The first if");
    }else if(totalLength > 20){
      const alert = this.alertCtrl.create({
        header: 'Info',
        subHeader: 'Only 10 trusted contacts are allowed. Please reduce selected contacts.',
        buttons: ['OK']
      });
      (await alert).present();
    }else{
      console.log("this.createList",this.createList);
      //this.loadingProvider.setupSaving();
      this.restProvider.createEmergencyContact(this.createList).then((result:any) => {
        console.log("addContact result 2",result);
        console.log("After clicking done");
        this.getContact();
        console.log("else");
      }, (err) => {
        console.log(err);
        //this.loadingProvider.closeSaving();
        //this.showAlert();
      });
    }

    let navigationExtras: NavigationExtras = {
      state: {
        selectedEmergencyContactList: this.createList
      }
    };
    this.router.navigate(['sos'], navigationExtras);
  }

  changed(data, i){
    console.log('changed data',data)
    if(this.selectedBox[i] == true){
      let c = {
        "personId": this.profile.personId,
        "ice": this.contactList[i].id,   //id orang yg dia choose
        "emergencyContactNumber": this.contactList[i].contact,
        "emergencyName": this.contactList[i].name
      };
      this.createList.push(c);
      console.log('updated create list ',this.createList);
    }else{
      let b = this.contactList[i].id;
      console.log("B",b);
      let arr = this.createList;
      let filtered = arr.filter(function(item) {
            let a = JSON.stringify(item.ice);
            let c = JSON.stringify(b);
            if( a != c ){
              console.log("not");
              return item;
            }
      })
      console.log('updated create list ', filtered);
      this.createList = filtered;
    }
  }

}
