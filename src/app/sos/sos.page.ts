import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CallNumberProvider } from 'src/providers/call-number.provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { LoadingProvider } from  './../../providers/loading-provider';
import { AlertProvider } from 'src/providers/alert-provider';
import { EmergencyProvider } from 'src/providers/emergency-provider';



@Component({
  selector: 'app-sos',
  templateUrl: './sos.page.html',
  styleUrls: ['./sos.page.scss'],
})
export class SosPage implements OnInit {
  selectedEmergencyContactList: any;
  profile: any;
  contactList: any[];
  sos_type: any;
  from: any;


  constructor(
    private router: Router,
    private callNumberProvider: CallNumberProvider,
    private route: ActivatedRoute,
    public  restProvider: RestProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    public loadingProvider: LoadingProvider,
    private alertProvider: AlertProvider,
    private emergencyProvider: EmergencyProvider

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getContact();
  }

  callFx(data) {
    let phoneNumber = '+'+data.contactCode+data.contactNo;
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
    this.loadingProvider.presentLoading();
    this.storage.get('defaultProfile').then((val:any) => {   //untuk guna storage
      this.profile= val
      this.restProvider.getEmergencyList(this.profile.personId).then((result:any) => {
        if(result == null){
          this.contactList = [];
        }else{
          this.contactList = result;  //give value to contactList from result
          console.log("getContactSos",result);
        }
        this.loadingProvider.closeLoading();
      }, (err) => {
        console.log(err);
        this.loadingProvider.closeLoading();
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
     this.loadingProvider.closeSaving();
      this.getContact();
      this.alertProvider.successAlert()
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeSaving();
      this.alertProvider.errorAlert()
    });
  }

  triggerSOS(type){
    console.log("type: ",type);
    this.emergencyProvider.trigger(type).then((result:any) => {
      console.log('emergencyProvider',result);
      if(result == 'empty'){
        this.alertProvider.errorAlertParam('Error!','Please check your emergency contacts list')
      }else{
        let navigationExtras: NavigationExtras = {
          state: {
            lat: result.lat,
            lng: result.lng,
            adrs: result.adrs,
            sos_type: type
          }
        };
        this.router.navigate(['sos-sender'], navigationExtras);  //navigate ke page lain
      }
    }, (err) => {
      console.log(err);
    });
  }


}
