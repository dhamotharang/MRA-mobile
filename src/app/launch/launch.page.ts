import { Component } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { AlertController, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Capacitor } from '@capacitor/core';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertProvider } from 'src/providers/alert-provider';

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
  private secureURL:any = [];
  andList=[]

  private image: string;
  private currentImage;
  private cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: 0
  }

  constructor(
    private restProvider: RestProvider,
    private navCtrl: NavController,
    private router: Router,
    private storage: Storage,
    private loadingProvider: LoadingProvider,
    private googlePlus: GooglePlus,
    private alertCtrl: AlertController,
    private camera: Camera,
    private sanitize: DomSanitizer,
    private alertProvider: AlertProvider
  ) {}

  ngOnInit() {
    // this.restProvider.appConfHttp("MGPR")
  }

  async googleSignup() {
    if (Capacitor.platform !== 'web') {
      this.googlePlus.login({}).then((result:any) => {
        console.log('googleSignup',result)
        // alert(result)
        this.loginFx(result)
      })
      .catch(err => console.error(err));
    }
    else {
      this.staff()
    }
  }


  loginFx(data) {
    console.log('loginFx',data)
    this.loadingProvider.presentLoading()
    this.param.providerCode = "google";
    this.param.providerId = data.email;
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    this.getProfile()
  }

  staff() {
    this.loadingProvider.presentLoading()
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
        this.router.navigate(['profile']);

      }else{
        this.storage.set('isNewUser', false);
        this.storage.set('defaultProfile', result); //use this to get personId  for orgId 320
        this.storage.set('nonOrgPersonId', result.personId);  //personId not for org, default_prs=Y
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
      this.storage.set('personOrgList', result)
      this.filterOrg();
    }, (err) => {
      console.log('getOrg err',err);
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
    this.storage.get('defaultProfile').then((val:any) => {
      val.personId = this.profile.personId
      this.storage.set('defaultProfile', val)
    })
    this.checkRole();
  }

  

  async checkRole() {
    let result = [];
    let ids = ["1","4","5","9"]; 
    for (let i = 0; i < ids.length; i++) {
      await this.restProvider.checkRole(this.profile.personId, ids[i]).then((data:any) => {
        result.push(data)
        console.log('checkRole',result)
      }, (err) => {
        console.log('checkRoleErr',err);
        //this.alertProvider.errorAlert()
      });
    }
    let q = result.find(x => x == true);
    console.log('q',q)
    if (q) {
      this.role = 'staff'
    }
    else {
      this.role = 'volunteer'
    }
    this.loadingProvider.closeLoading()
    this.storage.set('role', this.role);
    this.navToHome();
  }


  

  navToHome() {
    this.storage.set('fromQuickLogin', false);
    this.router.navigate(['tabs']);
  }

  volunteer() {
    this.loadingProvider.presentLoading()
    this.param.providerCode = "google";
    this.param.providerId = "nisahasin95@gmail.com";  //sitivolunteer@gmail.com
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