//A service provider is an Angular abstraction which can be used in any other component,
//page or service via the Angular Dependency Injection or DI.
//You can use providers to encapsulate code which's common between many places of your application
// so instead of repeating the same logic in many places you can isolate that code into its own service
//and inject it wherever you want to use it.

//run on cmd, ionic g provider rest
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/forkJoin';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingProvider } from  '../providers/loading-provider';
import { RestProvider } from  '../providers/rest/rest';
import { AlertController, Platform } from '@ionic/angular';
// import { PushProvider } from  '../providers/push-provider';

declare var google;
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmergencyProvider {

  counter:any = 1;
  andList:any = [];
  iosList:any = [];
  pushList:any = [];
  personid:any;
  personName:any;
  profilePictUrl:any;
  lat:any;
  lng:any;
  adrs:any;
  token:any;
  phone:any;
  badgeCounter:number;

  constructor(
    public http: HttpClient,
    public alertCtrl: AlertController,
    public loadingProvider: LoadingProvider,
    private storage: Storage,
    // public events: Events,
    public platform: Platform,
    private geolocation: Geolocation,
    //public pushProvider: PushProvider,
    public restProvider: RestProvider,
  ) {
    console.log('Hello Emergency Provider');
    this.storage.get('defaultProfile').then((val:any) => {
      if(val != null){
        this.personName = val.name;
        this.phone = val.contactCode+val.contactNo;
      }
    });
    this.storage.get('token').then((val:any) => {
        this.token = val;
    });
    this.storage.get('profilePictUrl').then((val:any) => {
      this.profilePictUrl = val;
    });
    this.storage.get('defaultPersonId').then((val:any) => {
      this.personid = val;
    });
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Oops!',
      subHeader: 'Something went wrong. Please try again later.',
      buttons: ['OK']
    });
    alert.present();
  }

  getEmergencyToken(){
    return new Promise<void>((resolve, reject) => {
      this.restProvider.getEmergencyToken(this.personid).then((res:any) =>{
        console.log(res);
        if(res.android != null){
          this.andList = res.android;
        }
        if(res.ios != null){
          this.iosList = res.ios;
        }
        resolve();
      }).catch(error => {
        console.log(error);
        this.showAlert();
        this.loadingProvider.closeLoading();
        reject(error);
      })
    });
  }

  getLocation(){
    return new Promise<void>((resolve, reject) => {
      this.loadingProvider.presentLoading();
      let options = {timeout: 10000, enableHighAccuracy: true};
      this.geolocation.getCurrentPosition(options).then((pos) => {
        console.log("senderLat="+pos.coords.latitude, "senderLng="+pos.coords.longitude);
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        let latLng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
        let geocoder = new google.maps.Geocoder();
          geocoder.geocode({'latLng': latLng}, ( results, status ) => {
                  if ( status == google.maps.GeocoderStatus.OK && results[0] ) {
                      this.adrs = results[0].formatted_address;
                      console.log( results[0].formatted_address );
                      resolve();
                  }
              }
          );
      }).catch(async (error) => {
        console.log('Error getting location', error);
        this.loadingProvider.closeLoading();
        const alert = await this.alertCtrl.create({
          header: 'Warning!',
          subHeader: 'Could not get location. Please allow access to location and check your network or GPS setting.',
          buttons: ['OK']
        });
        alert.present();
        reject(error);
      });
    });
  }

  async trigger(sosType){
    await this.getLocation();
    await this.getEmergencyToken();
    return new Promise((resolve, reject) => {
      this.pushList = [];
      let time = new Date().getTime();
      if(this.platform.is('ios')) {
        console.log('platform ios');
        var plat = "ios";
      }else if(this.platform.is('android')){
        console.log('platform android');
        var plat = "android";
      }
      if(this.andList.length > 0){
        let pushData = {
          registration_ids : this.andList,
          data: {
            notId: null, // notId on Android needed to be an int and not a string
            title: "Emergency Call",
            body: "Requires assistance at "+ this.adrs,
            soundname: "police_siren",
            android_channel_id: "emergency",
            lat: this.lat,
            lng: this.lng,
            adrs: this.adrs,
            token: this.token,
            phone: this.phone,
            plat: plat,
            avatar: this.profilePictUrl,
            who: this.personName,
            type:"Emergency",
            sos_type:sosType,
            created: time
          }
        }
        this.pushList.push(pushData);

      }
      if(this.iosList.length > 0){
        let pushData = {
          registration_ids : this.iosList,
          notification:{
             sound: "police_siren.mp3",
             title: "Emergency Call",
             body: "Requires assistance at "+ this.adrs,
          },
          data: {
            notId: null,
            lat: this.lat,
            lng: this.lng,
            adrs: this.adrs,
            token: this.token,
            plat: plat,
            phone: this.phone,
            avatar: this.profilePictUrl,
            who: this.personName,
            type:"Emergency",
            sos_type:sosType,
            created: time
          }
        }
        this.pushList.push(pushData);
      }
    //   // if(this.pushList.length > 0){
    //   //   this.pushProvider.sendPush(this.pushList,this.personid).subscribe((result:any) => {
    //   //     console.log(result);
    //   //     let temp = {
    //   //       lat: this.lat,
    //   //       lng: this.lng,
    //   //       adrs: this.adrs
    //   //     }
    //   //     this.loadingProvider.closeLoading();
    //   //     resolve(temp);
    //   //   });
    //   // }else{
    //   //   this.loadingProvider.closeLoading();
    //   //   resolve('empty');
    //   // }

    });
  }

}
