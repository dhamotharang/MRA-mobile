import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, NavController, NavParams, Platform } from '@ionic/angular';

@Component({
selector: 'app-media-modal',
templateUrl: './media-modal.page.html',
styleUrls: ['./media-modal.page.scss'],
})
export class MediaModalPage implements OnInit {
slideList:any = [];
removeList:any = [];
default:any = 0;
viewCtrl: any;
slides: any;

constructor(
public navCtrl: NavController,
public actionSheetCtrl: ActionSheetController,
public platform: Platform,
private zone: NgZone,
public navParams: NavParams){
this.slideList = navParams.get('list');
this.removeList = navParams.get('rlist');}
  
dismiss(){
this.viewCtrl.dismiss({
data:this.slideList,
remove:this.removeList
});
}

ionViewDidEnter() {
this.default = this.navParams.get('default');
this.slides.update();
this.slides.slideTo(this.default);
}

removeMedia(idx){
// console.log(idx);
let b = this.slideList[idx];
if(this.slideList[idx].blob == null){
this.removeList.push(this.slideList[idx]);
}
// console.log(b);
let arr = this.slideList;
let filtered = arr.filter(function(item) {
// return item !== val
let a = JSON.stringify(item);
let c = JSON.stringify(b);
if( a != c ){
console.log("not");
return item;
}
})
console.log(filtered);
this.slideList = filtered;
if(this.slideList.length < 1){
this.dismiss();
}else{
this.zone.run(() => {// to make sure UI view is updatinig
this.slides.update();
this.slides.slideTo(this.slideList.length - 1);
});
}
}

ngOnInit() {
}
}

