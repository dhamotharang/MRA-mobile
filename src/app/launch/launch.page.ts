import { Component } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { AlertController, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Capacitor } from '@capacitor/core';

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
  userInfo: any;
  profile: any;
  role: string;


  constructor(
    private restProvider: RestProvider,
    private navCtrl: NavController,
    private router: Router,
    private storage: Storage,
    private loadingProvider: LoadingProvider,
    private googlePlus: GooglePlus,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // this.restProvider.appConfHttp("MGPR")
  }

  async googleSignup() {
    if (Capacitor.platform !== 'web') {
      this.googlePlus.login({}).then((result:any) => {
        console.log('googleSignup',result)
        alert(result)
        this.loginFx(result)
      })
      .catch(err => console.error(err));
    }
    else {
      this.presentLoginForm()
    }
  }

  async presentLoginForm() {
    const alert = await this.alertCtrl.create({
      message: 'Login',
      // subHeader: '10% of battery remaining',
      inputs: [{
        name: 'Email',
      }],
      buttons: ['OK']
     });
     await alert.present(); 
  }

  loginFx(data) {
    console.log('loginFx',data)
    this.param.providerCode = "google";
    this.param.providerId = data.email;
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    this.getProfile()
  }

    staff() {
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
      this.profile = result
      // this.loadingProvider.closeLoading();
      if(result.personId == null){
        this.storage.set('isNewUser', true);
      }else{
        this.storage.set('isNewUser', false);
        this.storage.set('defaultProfile', result);
        this.getOrg();
      }
    }, (err) => {
      console.log('getProfileErr',err);
      // this.loadingProvider.closeLoading();
    });
  }

  getOrg(){ //get org using get fee rest
    // this.loadingProvider.presentLoading();
    this.restProvider.getFee(this.profile.personId).then((result:any) => {
      // this.loadingProvider.closeLoading();
      this.personOrg = result;
      this.filterOrg();
    }, (err) => {
      console.log('getOrg err',err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

  }
  

  filterOrg() {//hardcoded
    let p = this.personOrg.filter(x => x.orgProfile.module.modId == 6 && x.orgProfile.orgId == 320)
    console.log('p',p)
    if (p.length == 0) {  //for now vol
      this.storage.set('defaultPersonId', this.profile.personId);
      this.storage.set('personOrgs', 320)
    }
    else {
      this.profile.personId = p[0].personId
      this.storage.set('defaultPersonId', p[0].personId);
      this.storage.set('personOrgs', p[0].orgId)
    }
    this.checkRole();

  }

  async checkRole() {
    let result = [];
    let ids = ["1","4","5","9"]; 
    // this.loadingProvider.presentLoading();
    for (let i = 0; i < ids.length; i++) {
      await this.restProvider.checkRole(this.profile.personId, ids[i]).then((data:any) => {
        result.push(data)
        console.log('checkRole',result)
      }, (err) => {
        console.log('checkRoleErr',err);
      });
      // this.loadingProvider.closeLoading();
    }
    let q = result.find(x => x == true);
    console.log('q',q)
    if (q) {
      this.role = 'staff'
    }
    else {
      this.role = 'volunteer'
    }
    this.storage.set('role', this.role);
    this.navToHome();
  }


  

  navToHome() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.param,
        role: this.role,
        fee: this.personOrg
      }
    };
    this.router.navigate(['tabs'], navigationExtras);
  }

  volunteer() {
    this.param.providerCode = "google";
    this.param.providerId = "sitivolunteer@gmail.com";
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    this.getProfile();
  }

  
}






  // staff() {
  //   this.param.providerCode = "google";
  //   this.param.providerId = "annas@oas.my";
  //   this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
  //   this.storage.set('provider', this.param);
  //   this.storage.set('isLoggedIn', true);
  //   this.getProfile();
  // }