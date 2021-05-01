import { Component, OnInit } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  andList: any;
  // iosList: any;
  pushList: any = [];
  orgId: any;
  profile: any;

  constructor(
    private restProvider: RestProvider,
    private storage: Storage,
  ) { }

  async ngOnInit() {
    await this.storage.get('defaultProfile').then((val:any) => {this.profile = val })
    await this.storage.get('personOrgs').then((val:any) => {this.orgId = val})
    this.getToken()
    // this.pushProvider.getToken()
  }





  getToken() {
    this.restProvider.getTokenNoti(this.orgId, this.profile.oaId).then((res: any) => {
      console.log(res);
      this.andList = res.android;
      // this.iosList = res.ios;
      // this.sendPush();
    }).catch(error => {
      console.log(error);
      // this.showAlert();
      // this.loadingProvider.closeSaving();
    })

  }


  sendPush() {
    let time = new Date().getTime();
    if (this.andList.length > 0) {
      let temp = [];
      for (let i = 0; i < this.andList.length; i++) {
        temp.push(this.andList[i].token);
      }
      let pushData = {
        registration_ids: temp,
        data: {
          notId: null, // notId on Android needed to be an int and not a string
          title: 'Volunteer *** have received your invitation',
          body: 'test description',
          // avatar: this.profilePictUrl,
          // who: 'nisa',
          // type: "feedback",
          // created: time
        }
      }
      this.pushList.push(pushData);
    }
    // if(this.iosList.length>0){
    //   let temp = [];
    //   for(let i=0;i<this.iosList.length;i++){
    //     temp.push(this.iosList[i].token);
    //   }
    //   let pushData = {
    //     registration_ids : temp,
    //     notification:{
    //       title: this.title,
    //       body: this.description,
    //       sound: "default",
    //     },
    //     data: {
    //       notId: null, // notId on Android needed to be an int and not a string
    //       avatar: this.profilePictUrl,
    //       who: this.personName ,
    //       type:"feedback",
    //       created: time
    //     }
    //   }
    //   this.pushList.push(pushData);
    // }

    // this.restProvider.sendPush(this.pushList,this.profile.personId).subscribe((result:any) => {
    //   console.log('here');
    //   console.log(result);
    // });
  }




}
