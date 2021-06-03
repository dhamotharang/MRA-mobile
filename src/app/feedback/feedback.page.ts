import { Component, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { ActionSheetController, AlertController, ModalController, NavController, Platform } from "@ionic/angular";
import { Storage } from '@ionic/storage-angular';
import { LoadingProvider } from "src/providers/loading-provider";
import { RestProvider } from "src/providers/rest/rest";
import { TabsPage } from "../tabs/tabs.page";
import { AlertProvider } from 'src/providers/alert-provider';
//import { MediaModal } from '../media-modal/media-modal.page';
//import { PushProvider } from  './../../providers/push-provider';
//import { LocationModal } from '../location-modal/location-modal';
//import { DurationModal } from '../duration-modal/duration-modal';

declare var window;
//@IonicPage()
@Component({
selector: "app-feedback",
templateUrl: "feedback.page.html",
styleUrls: ["feedback.page.scss"]
})
export class FeedbackPage {
mediaList:any = [];
private cameraOptions: CameraOptions = {
quality: 20,
destinationType: this.camera.DestinationType.DATA_URL,
encodingType: this.camera.EncodingType.JPEG,
mediaType: this.camera.MediaType.PICTURE,
sourceType: 0
 }
private image: string;
secureURL:any = ""; 
name:any;
nav: any;
window: any;
file: any;
pushProvider: any;
contact: any;
email: any;
private restParam:any = {};
personName: any;
profilePictUrl:any;
oaid:any;
andList:any = [];
iosList:any = [];
pushList:any = [];
plt:any;
rateList:any;
rate:any;
personID:any;
  profile: any;
  createFeedback: any;
  navParam: any;

constructor(
public navCtrl: NavController,
private formBuilder: FormBuilder,
private camera: Camera,
private storage: Storage,
public platform: Platform,
public alertController: AlertController,
public alertCtr: AlertController,
public loadingProvider: LoadingProvider,
public  restProvider: RestProvider,
public modalCtrl: ModalController,
private zone: NgZone,
public actionSheetCtrl: ActionSheetController,
private alertProvider: AlertProvider,

){
// this.storage.get('oaid').then((val:any) => {
// this.oaid = val;
// });
this.storage.get('defaultProfile').then((val:any) => {
console.log(val);
this.personName = val.name;
this.email = val.email;
this.contact = val.contactNo;
if(this.email == null || this.email == undefined){
this.storage.get('provider').then((val:any) => {
this.email = val.providerId;
});
}
});
this.storage.get('profilePictUrl').then((val:any) => {
this.profilePictUrl = val;
});
this.storage.get('defaultPersonId').then((val:any) => {
console.log(val);
this.personID = val;
});
}
get title() {
return this.registrationForm.get("title");
}
get description() {
return this.registrationForm.get("description");
}
public errorMessages = {
title: [
{ type: 'required', message: 'Please input title' },
{ type: 'maxlength', message: 'Title cant be longer than 60 characters' }
],
description: [
{ type: 'required', message: 'Description is required' },]
}; 
registrationForm = this.formBuilder.group({
title: ['', [Validators.required, Validators.maxLength(100)]],
description: ['', [Validators.required]],
rate:[] 

});

ngOnInit() {
  this.getProfile();
}

getProfile(){
  if(this.platform.is('ios')) {
  this.plt = "ios";
  }else if(this.platform.is('android')){
  this.plt = "android";
  }
  this.storage.get('defaultProfile').then((val:any) => {
  console.log('getProfile',val)
  this.profile= val;
  });
  }


async post(){
 
    

// if(this.description == null){
// const alert = this.alertController.create({
// header: 'Warning!',
// subHeader: 'Please fill in the description.',
// buttons: ['OK']
// });
// (await alert).present();
// }else{
// if(this.mediaList.length > 0){
//  this.upload();
// }else{
// this.create();
// }
//}
 }
 submit() {
   console.log(this.restParam,"this.restParam")
   this.restParam = {
    personId : this.profile.personId,
    conName:this.profile.name,
    image:'',
    title : this.registrationForm.value.title,
    note: this.registrationForm.value.description,
    conNo :this.profile.contactNo,
    email : this.profile.email,
    rate : this.registrationForm.value.rate,
    platform : 'android',
    };
    console.log('restParam',this.restParam )
  this.loadingProvider.presentLoading();
  this.restProvider.createFeedback(this.restParam).then((result:any) => {
    console.log('getFeedbackcreate',result);
    this.createFeedback = result;
    this.loadingProvider.closeLoading();
    this.exitForm();
    this.alertProvider.successAlert()
  }, (err) => {
    this.loadingProvider.closeLoading();
     console.log(err);
     this.alertProvider.errorAlert()
    // this.showAlert();
  });
}

exitForm() {
  this.navCtrl.back();
}


// async showAlert() {
//     const alert = this.alertController.create({
//     header: 'Server Error!',
//     subHeader: 'Please try again later.',
//     buttons: ['OK']
//     });
//     (await alert).present();
//     }  

// upload(){
//     this.loadingProvider.setupUpload();
//     this.restProvider.cloudinaryUpload(this.mediaList,'feedback','feedback')
//     .then((res) =>{
//     for(let i=0; i < res.length; i++){
//     let x = JSON.parse(res[i]);
//     console.log("parse = "+x);
//     let con = {
//     filetype: x.resource_type,
//     filepath: x.secure_url
//     };
//     if(i == 0){
//     this.secureURL = x.secure_url;  
//     }else{
//     this.secureURL = this.secureURL +','+x.secure_url;
//     }
//     }   
//     this.loadingProvider.closeUpload();
//     console.log(this.secureURL);
//     this.create();
//     }).catch(async error => {
//     console.log(error);
//     this.loadingProvider.closeUpload();
//     const alert = this.alertController.create({
//     header: 'Cloudinary Server Error!',
//     subHeader: 'Please try again later.',
//     buttons: ['OK']
//     });
//     (await alert).present();
//     })
//     }

// create(){
//     //this.loadingProvider.setupSaving();
//     if(this.platform.is('ios')) {
//     this.plt = "ios";
//     }else if(this.platform.is('android')){
//     this.plt = "android";
//     }
//     }
// getToken(){
//     this.restProvider.getToken(128,this.oaid).then((res:any) =>{
//     console.log(res);
//     this.andList = res.android;
//     this.iosList = res.ios;
//     this.sendPush();
//     }).catch(error => {
//     console.log(error);
//     this.showAlert();
//     this.loadingProvider.closeSaving();
//     })
//     }

// sendPush(){
//     let time = new Date().getTime();
//     if(this.andList.length>0){
//     let temp = [];
//     for(let i=0;i<this.andList.length;i++){
//     temp.push(this.andList[i].token);
//     }
//     let pushData = {
//     registration_ids : temp,
//     data: {
//     notId: null, // notId on Android needed to be an int and not a string
//     title: this.title,
//     body: this.description,
//     avatar: this.profilePictUrl,
//     who: this.name ,
//     type:"feedback",
//     created: time
//     }
//     }
//     this.pushList.push(pushData);
//     }
//     if(this.iosList.length>0){
//     let temp = [];
//     for(let i=0;i<this.iosList.length;i++){
//     temp.push(this.iosList[i].token);
//     }
//     let pushData = {
//     registration_ids : temp,
//     notification:{
//     title: this.title,
//     body: this.description,
//     sound: "default",
//     },
//     data: {
//     notId: null, // notId on Android needed to be an int and not a string
//     avatar: this.profilePictUrl,
//     who: this.name ,
//     type:"feedback",
//     created: time
//      }
//      }
//      this.pushList.push(pushData);
//      }
//      this.pushProvider.sendPush(this.pushList,this.personID).subscribe((result:any) => {
//      console.log('here');
//      console.log(result);
//      this.loadingProvider.closeSaving();
//      this.nav.setRoot(TabsPage,{tabIndex: 0});
//      });
//      }


// async slide(){
//      const modal = await this.modalCtrl.create({
//      component: MediaModal, 
//      componentProps:{list: this.mediaList },
//      });

// modal.present();
//      modal.onDidDismiss().then(data=>{
//      this.zone.run(() => {// to make sure UI view is updatinig
//      this.mediaList = data.data;
//      console.log('dismissed');
//      console.log(this.mediaList);
//      });
//      });
//      }

// async gallery(){
//      if(this.mediaList.length == 3){
//      const alert = this.alertCtr.create({
//      header: 'Warning!',
//      subHeader: 'Sorry, you can only send three images.',
//      buttons: ['OK']
//      });
//      (await alert).present();
//      }else{
//      const options: CameraOptions = {
//      quality: 100,
//      destinationType: this.camera.DestinationType.FILE_URI,
//      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
//      mediaType: this.camera.MediaType.ALLMEDIA
//      }
//      this.getURI(options,'gal');
//      }
//      }

// getURI(options,source){
//      console.log(options);
//      this.camera.getPicture(options).then((mediaData) => {
//      console.log(mediaData);
//      let type = this.checkType(mediaData);
//      this.checkSize('file://'+mediaData)
//      .then(async (res) => {
//      let size = res;
//      if(await type == 'image'){
//      less than 10MB
//      if(size  > 10.00){
//      const alert = this.alertCtr.create({
//      header: 'Warning!',
//      subHeader: 'File size must be less than 10MB',
//      buttons: ['OK']
//      });
//      (await alert).present();
//      }else{
//      this.checkDuplicate('file://'+mediaData,'image');
//      }
//      }else if(await type == 'video'){
//      less than 100MB
//      if(size  > 100.00){
//      const alert = this.alertCtr.create({
//      header: 'Warning!',
//      subHeader: 'File size must be less than 100MB',
//      buttons: ['OK']
//      });
//      (await alert).present();
//      }else{
//      this.checkDuplicate('file://'+mediaData,'video');
//      }
//      }
//      })
//      }, (err) => {
//      console.log(err);
//      });
//      }

// checkSize(path): Promise<any>{
//     return new Promise((resolve,reject) => {
//     this.file.resolveLocalFilesystemUrl(path, (fileEntry) => {
//     fileEntry.getMetadata((metadata:any) => {
//     console.log(metadata.size);
//     let size = (metadata.size*0.000001).toFixed(2);
//     console.log(size);
//     resolve(size);
//     });
//     }, (error) => { console.error(error); reject('error') });
//     });
//     }

// async checkType(uri): Promise<string>{
//     let label = uri.replace(/\\/g, '/').replace(/.*\//, '');
//     let file = label.toLowerCase();
//     let ext = file.substring(file.lastIndexOf('.') + 1);
//     if(ext == 'jpg' || ext == 'png' || ext == 'jpeg'){
//     return 'image';
//     }else if(ext == 'mp4'){
//     return 'video';
//     }else{
//     const alert = this.alertCtr.create({
//     header: 'Warning!',
//     subHeader: 'File format not supported',
//     buttons: ['OK']
//     });
//     (await alert).present();
//     }
//     }

// checkDuplicate(uri,type){
//     console.log('checking duplication...');
//     if(this.mediaList.length < 1){
//     console.log('array empty');
//     let con ={
//     uri: uri,
//     type: type
//     }
//     this.zone.run(() => {
//     this.mediaList.push(con);
//     console.log(this.mediaList);
//     });
//     }else if(this.mediaList.length > 0){
//     console.log('array not empty');
//     let val = this.mediaList.indexOf(uri);
//     if(val == -1){//doesnt exist in array
//     console.log('new file');
//     let con ={
//     uri: uri,
//     type: type
//     }
//     this.mediaList.push(con);
//     console.log(this.mediaList);
//     }
//     }
//     }


// async selectMedia() {
//     const actionSheet = this.actionSheetCtrl.create({
//     buttons: [{
//     text: 'Photo',
//     icon: !this.platform.is('ios') ? 'images' : null,
//     handler: () => {
//     this.gallery();
//     }
//     }]
//     });
//    (await actionSheet).present();
//     }

}