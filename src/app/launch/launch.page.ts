import { Component } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { LoadingProvider } from 'src/providers/loading-provider';

@Component({
  selector: 'app-home',
  templateUrl: 'launch.page.html',
  styleUrls: ['launch.page.scss'],
})
export class LaunchPage {
  param = {
    providerCode: "",
    providerId: "",
    token: "",
    platform:""
  }
  personOrg: any;


  constructor(
    private restProvider: RestProvider,
    private navCtrl: NavController,
    private router: Router,
    private storage: Storage,
    private loadingProvider: LoadingProvider
  ) {}

  ngOnInit() {

  }

  loginFx() {
    this.param.providerCode = "google";
    this.param.providerId = "annas@oas.my";
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    this.getProfile();
  }

  getProfile(){
    // this.loadingProvider.presentLoading();
    this.restProvider.getProfile(this.param).then((result:any) => {
      console.log('getProfile',result);
      if(result.personId == null){
        this.storage.set('isNewUser', true);
        // this.loadingProvider.closeLoading();
        // this.nav.setRoot(ProfileModal);
      }else{
        this.storage.set('isNewUser', false);
        this.storage.set('defaultProfile', result);
        this.storage.set('defaultPersonId', result.personId);
        // this.loadingProvider.closeLoading();
        this.getOrg();
      }
    }, (err) => {
      console.log('profilePictUrl',err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  getOrg(){
    // this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.getFee(val).then((result:any) => {
        // this.loadingProvider.closeLoading();
        // this.storage.set('personOrgs', result);
        this.personOrg = result;
        this.filterOrg();
        // this.nav.setRoot(TabsPage, {opentab: 1});
      }, (err) => {
        console.log('getOrg',err);
        // this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    });

  }

  filterOrg() {
    let p = this.personOrg.filter(x => x.orgProfile.module.modId == 6 && x.orgProfile.orgId == 320);
    console.log('p',p)
    this.storage.set('personOrgs', p[0]);
    this.navToHome();
  }
  

  navToHome() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.param
      }
    };
    this.router.navigate(['tabs'], navigationExtras);
  }

  
}
