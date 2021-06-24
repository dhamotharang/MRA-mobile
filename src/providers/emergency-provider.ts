// import { Injectable, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { AlertProvider } from './alert-provider';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from  'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/forkJoin';
// import { timeout, catchError } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RestProvider } from './rest/rest';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { AlertProvider } from './alert-provider';
// import { PushProvider } from  '../providers/push-provider';

declare var google;
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmergencyProvider {
// @ViewChild(Nav) nav: Nav;

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
  // token:any;
  phone:any;
  // badgeCounter:number;

  constructor(
    // public http: HttpClient,
    // public alertCtrl: AlertController,
    // public loadingProvider: LoadingProvider,
    private storage: Storage,
    // public events: Events,
    public platform: Platform,
    private geolocation: Geolocation,
    // public pushProvider: PushProvider,
    private restProvider: RestProvider,
    private alertProvider: AlertProvider
  ) {
    // console.log('Hello Emergency Provider');
    this.storage.get('defaultProfile').then((val:any) => {
      if(val != null){
        this.personName = val.name;
        this.phone = val.contactCode+val.contactNo;
      }
    });
    // this.storage.get('token').then((val:any) => {
    //     this.token = val;
    // });
    this.storage.get('profilePictUrl').then((val:any) => {
      this.profilePictUrl = val;
    });
    this.storage.get('defaultPersonId').then((val:any) => {
      this.personid = val;
    });
  }


  getEmergencyToken(){
    return new Promise((resolve, reject) => {
      this.restProvider.getEmergencyToken(this.personid).then((res:any) =>{
        console.log(res);
        if(res.android != null){
          this.andList = res.android;
          console.log('andList',this.andList);
        }
        if(res.ios.length != 0 || res.ios != null){
          this.iosList = res.ios;
          console.log('iosList',this.iosList);
        }
        resolve();
      }).catch(error => {
        console.log(error);
        this.alertProvider.errorAlert()
        // this.loadingProvider.closeLoading();
        reject(error);
      })
    });
  }

  getLocation(){
    return new Promise((resolve, reject) => {
      let options = {timeout: 10000, enableHighAccuracy: true};
      this.lat = 2.9162182; //pos.coords.latitude;
      this.lng = 101.6435751; //pos.coords.longitude;
      let latLng = new google.maps.LatLng(this.lat,this.lng);
      this.adrs = 'Jln Fauna 1, Cyberjaya, 63000 Cyberjaya, Selangor';
      resolve();

      //below code should be used after enable billing in google console (mra acc)
      // this.geolocation.getCurrentPosition(options).then((pos) => {
      //   console.log("senderLat="+pos.coords.latitude, "senderLng="+pos.coords.longitude);
      //   this.lat = 2.9162182; //pos.coords.latitude;
      //   this.lng = 101.6435751; //pos.coords.longitude;
      //   let latLng = new google.maps.LatLng(this.lat,this.lng);
      //   let geocoder = new google.maps.Geocoder();
      //     geocoder.geocode({'latLng': latLng}, ( results, status ) => {
      //             if ( status == google.maps.GeocoderStatus.OK && results[0] ) {
      //                 this.adrs = results[0].formatted_address;
      //                 console.log( results[0].formatted_address );
      //                 resolve();
      //             }
      //         }
      //     );
      // }).catch((error) => {
      //   console.log('Error getting location', error);
      //   this.alertProvider.errorAlertParam('Warning!','Could not get location. Please allow access to location and check your network or GPS setting.')
      //   reject(error);
      // });
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
          notification: {
            notId: null, // notId on Android needed to be an int and not a string
            title: "Emergency Call",
            body: "Requires assistance at "+ this.adrs,
            soundname: "police_siren",
            android_channel_id: "emergency",
            lat: this.lat,
            lng: this.lng,
            adrs: this.adrs,
            // token: this.token,
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
            // token: this.token,
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
      if(this.pushList.length > 0){
        this.restProvider.sendPush(this.pushList,this.personid).subscribe((result:any) => {
          console.log(result);
          let temp = {
            lat: this.lat,
            lng: this.lng,
            adrs: this.adrs
          }
          // this.loadingProvider.closeLoading();
          resolve(temp);
        });
      }else{
        // this.loadingProvider.closeLoading();
        resolve('empty');
      }

    });
  }

}
