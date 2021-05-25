import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CallNumberProvider } from 'src/providers/call-number.provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sos',
  templateUrl: './sos.page.html',
  styleUrls: ['./sos.page.scss'],
})
export class SosPage implements OnInit {
  // private contactList = [
  //   {contact_name: 'muhammad ali',contact:'012-3456678'},
  //   {contact_name: 'muhammad ali',contact:'012-3456678'},
  //   {contact_name: 'muhammad ali',contact:'012-3456678'},
  //   {contact_name: 'muhammad ali',contact:'012-3456678'}
  // ]
  selectedEmergencyContactList: any;
  profile: any;
  contactList: any[];


  constructor(
    private router: Router,
    private callNumberProvider: CallNumberProvider,
    private route: ActivatedRoute,
    public  restProvider: RestProvider,
    private storage: Storage,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('ngOnInit',params)
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedEmergencyContactList = this.router.getCurrentNavigation().extras.state.selectedEmergencyContactList;
        console.log('Selected Emergency Contact List',this.selectedEmergencyContactList)
      }
    });
  }

  ionViewWillEnter(){
    //take createlist from contact list page
    this.getContact();
  }

  callFx() {
    let phoneNumber = '0174164546';
    this.callNumberProvider.dialingFx(phoneNumber)
  }

  navigateNextPage() {     //passing data ke page lain
    let navigationExtras: NavigationExtras = {
      state: {
        contactList:this.contactList
      }
    };
    this.router.navigate(['contact-list'], navigationExtras);  //navigate ke page lain
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
          console.log("getContactSos",this.contactList);
        }
        //this.loadingProvider.closeLoading();
      }, (err) => {
        console.log(err);
        //this.loadingProvider.closeLoading();
        //this.showAlert();
      });
    })
  }

  async deleteConfirm(i) {
    const confirm = this.alertCtrl.create({
      header: 'Alert!',
      subHeader: ' Are you sure you want to delete this person?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            this.delete(i);
          }
        }
      ]
    });
    (await confirm).present();
  }

  delete(i){
    //this.loadingProvider.setupDelete();
    this.restProvider.deleteEmergency(this.contactList[i].smecId).then((result) => {
      console.log("Result after call delete emergency contact",result);
      //this.loadingProvider.closeDelete();
      this.getContact();
    }, (err) => {
      console.log(err);
      //this.loadingProvider.closeDelete();
    });
  }

}