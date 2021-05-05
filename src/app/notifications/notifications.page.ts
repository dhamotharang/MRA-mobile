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
  restParam: any;
  mediaList:any = [];

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

  createAnnouncement() {
    this.restParam = [{
      personId : this.profile.personId,
      hostId : this.profile.personId,
      profilePictUrl: '',
      referFrom : null,
      orgId : 320,
      title : 'test push noti',
      notes : 'test push notiiii',
      programStart: new Date(),
      programEnd: new Date(),
      location : 'Selangor',
      duration : 7,
      subModule: 'AN',
      paramType : 'OH',
      privateEvent: false,
      orgName : 'Malaysian Relief Agency',
      orgLogo : 'https://res.cloudinary.com/myjiran/image/upload/v1612149843/org_logo/gzr4ptrq3gaavfqqytmg.png'
    }];
    this.callApi();
  }

  async callApi(){
    // this.loadingProvider.setupSaving();
    let formData = await this.processData();
    this.restProvider.createAnnouncement(formData).then((result:any) => {
      console.log(result);
      // this.loadingProvider.closeSaving();
      // this.nav.setRoot(TabsPage,{tabIndex: 0});
      // this.navCtrl.pop();
    }, (err) => {
      console.log(err);
      // this.loadingProvider.closeSaving();
      // this.showAlert();
    });
  }

  processData(){
    const formData: FormData = new FormData();
    for (let i = 0; i < this.mediaList.length; i++) {
      console.log('blob array ');
      if(this.mediaList[i].blob != null){
        formData.append('file', this.mediaList[i].blob, this.mediaList[i].type);
      }
    }
    formData.append('params', new Blob([JSON.stringify(this.restParam)], {
                type: "application/json"
            }));
    return formData;
  }





  getToken() {
    this.restProvider.getTokenNoti(this.profile.personId).then((res: any) => {
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

  acceptJoin() {
    this.createAnnouncement()
    // this.sendPush();
  }


  sendPush() {
    let time = new Date().getTime();
    if (this.andList.length > 0) {
      let temp = [];
      // for (let i = 0; i < this.andList.length; i++) {
      //   temp.push(this.andList[i].token);

      // }
      temp.push('fFG4kfP9RpCaMKP-lqs5fw:APA91bETaf1Y-Jl8VPGrUtPvqiVW1XBeconI_wtoCWJWLBGJOqTUppfn9LMxBw-6S4YjlXV1xEWHn7Fe0yBAurqAm8bm1O_TKn7ucHFgX7jl7EHs3pdtPn5JCK87oxOUJzA8qopN895e');
      let pushData = {
        // registration_ids: temp,
        // data: {
        //   notId: null, // notId on Android needed to be an int and not a string
        //   title: 'Volunteer *** have received your invitation',
        //   body: 'test description',
        //   // avatar: this.profilePictUrl,
        //   // who: 'nisa',
        //   // type: "feedback",
        //   // created: time
        // },
          notification:{
            "title":"Volunteer *** have received your invitation",
            "body":"test description",
             "click_action":"FCM_PLUGIN_ACTIVITY"
          },
         to:"fFG4kfP9RpCaMKP-lqs5fw:APA91bETaf1Y-Jl8VPGrUtPvqiVW1XBeconI_wtoCWJWLBGJOqTUppfn9LMxBw-6S4YjlXV1xEWHn7Fe0yBAurqAm8bm1O_TKn7ucHFgX7jl7EHs3pdtPn5JCK87oxOUJzA8qopN895e",
            "priority":"high",
            "restricted_package_name":""
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

    this.restProvider.sendPush(this.pushList,this.profile.personId).subscribe((result:any) => {
      console.log('here');
      console.log(result);
    });
  }




}
