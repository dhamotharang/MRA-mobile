import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { Storage } from '@ionic/storage-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-volunteer',
  templateUrl: './add-volunteer.page.html',
  styleUrls: ['./add-volunteer.page.scss'],
})
export class AddVolunteerPage implements OnInit {
  // private volunteerInfoForm: FormGroup;
  private allVolunteerList=[];
  private chosenVolunteer=[];
  navParam: any;
  fromPage: any;
  taskDetail: any;
  orgId: any;
  oaId: any;
  restParam: any;
  andList: any;
  profile: any;
  mediaList=[];
  filterTerm: string;
  allCommiteeList: any;
  chosenParticipate: any[];


  constructor(
    private formBuilder: FormBuilder,
    private loadingProvider: LoadingProvider,
    private restProvider: RestProvider,
    private storage: Storage,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.storage.get('defaultProfile').then((val:any) => {this.profile = val})
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        this.fromPage = this.router.getCurrentNavigation().extras.state.from;
        this.taskDetail = this.router.getCurrentNavigation().extras.state.data;
        console.log('navParam',this.navParam,this.fromPage)
        if (this.fromPage == 'volunteer-list') {  //include not involve volunteer
          this.storage.get('personOrgs').then((val:any) => {
            this.orgId = val;
            this.getAllVolunteer();
          })
        }
        else {
          this.getAllParticipant(); //volunteer that involve only
        }
      }
    });

  }

  getAllVolunteer() {
    this.loadingProvider.presentLoading();
    this.restProvider.getAllVolunteerList('VOLUNTEER',this.orgId).then((result:any) => {
      let p = result.filter(x => x.voidStatus == 'A')
      console.log('getVolunteerList',p);
      this.allVolunteerList = p;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

  }

  chooseVolunteer(data) {
    if (this.fromPage != 'volunteer-list') {
      let p = [];
      p = this.chosenVolunteer.filter(x => x.person.personId == data.person.personId)
      if (p.length != 0) {
        let index = this.chosenVolunteer.findIndex(x => x.person.personId === data.person.personId);
        console.log('isLargeNumber',index)
        this.chosenVolunteer.splice(index)
        console.log('chooseVolunteer',this.chosenVolunteer)
        // console.log('chosenParticipate',this.chosenParticipate)
      }
      else {
        this.chosenVolunteer.push(data)
        console.log('chooseVolunteer',this.chosenVolunteer)
        // console.log('chosenParticipate',this.chosenParticipate)
      }
    }
    else {
      let p = [];
      p = this.chosenVolunteer.filter(x => x.personId == data.personId)
      if (p.length != 0) {
        let index = this.chosenVolunteer.findIndex(x => x.personId === data.personId);
        console.log('isLargeNumber',index)
        this.chosenVolunteer.splice(index)
        console.log('chooseVolunteer',this.chosenVolunteer)
        // console.log('chosenParticipate',this.chosenParticipate)
      }
      else {
        this.chosenVolunteer.push(data)
        console.log('chooseVolunteer',this.chosenVolunteer)
        // console.log('chosenParticipate',this.chosenParticipate)
      }
    }


 
  }

  addVolunteer() {
    console.log(this.chosenVolunteer)
    if (this.fromPage == 'volunteer-list') {
      this.loadingProvider.presentLoading();
      let body = []
      for (let i = 0; i < this.chosenVolunteer.length; i++) {
        let data = {
          projId:this.navParam.projId,
          personId:this.chosenVolunteer[i].personId,
          enabled:'Y',
          voidStatus: "A",
          joinStatus: "I"
        }
        body.push(data);
      }
      this.restProvider.addVolunteer(body).then((result:any) => {
        this.loadingProvider.closeLoading();
        this.exitForm();
        this.createAnnouncement();
      }, (err) => {
        // console.log(err);
        this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    }
    else {  //from task (for add participant in task)
      let body = []
      for (let i = 0; i < this.chosenVolunteer.length; i++) {
        let data = {
          taskId:this.taskDetail.taskId, 
          personId:this.chosenVolunteer[i].person.personId, 
          enabled:'Y',
          taskRole:''
        }
        body.push(data);
        console.log('body',body);
      }
      this.restProvider.addParticipantTask(body).then((result:any) => {
        this.loadingProvider.closeLoading();
        this.exitForm();
        this.createAnnouncement();
      }, (err) => {
        // console.log(err);
        this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    }

  }

  createAnnouncement() {  //send announcement to volunteer that were invite
    console.log('createAnnouncement')
    if (this.fromPage == 'volunteer-list') { 
      for (let i = 0; i < this.chosenVolunteer.length; i++) {
        this.restParam = 
        [{
          personId : this.chosenVolunteer[i].personId,
          hostId : this.profile.personId,
          profilePictUrl: this.chosenVolunteer[i].profilePicture,
          referFrom : null,
          orgId : this.orgId,
          title : 'invitation to join' + ' ' + this.navParam.projName,
          notes : 'You have been invited to join' + ' ' + this.navParam.projName,
          programStart: this.navParam.projectStart,
          programEnd: this.navParam.projectEnd,
          location : this.navParam.location,
          duration : 7,
          subModule: 'AN',
          paramType : 'I',
          privateEvent: false,
          orgName : 'Malaysian Relief Agency',
          orgLogo : 'https://res.cloudinary.com/myjiran/image/upload/v1612149843/org_logo/gzr4ptrq3gaavfqqytmg.png',
          projectId : this.navParam.projId
        }];
      }
    }
    else {
      for (let i = 0; i < this.chosenVolunteer.length; i++) {
        this.restParam = [{
          personId : this.chosenVolunteer[i].personId,
          hostId : this.profile.personId,
          profilePictUrl: this.chosenVolunteer[i].profilePicture,
          referFrom : null,
          orgId : this.orgId,
          title : 'Assigned for :' + ' ' + this.taskDetail.taskName + ' ' + 'in:' + ' ' + this.navParam.projName,
          notes : 'You have been assigned for :' + '' + this.taskDetail.taskName + ' ' + 'in:' + ' ' + this.navParam.projName,
          programStart: this.navParam.projectStart,
          programEnd: this.navParam.projectEnd,
          location : this.navParam.location,
          duration : 7,
          subModule: 'AN',
          paramType : 'I',
          privateEvent: false,
          orgName : 'Malaysian Relief Agency',
          orgLogo : 'https://res.cloudinary.com/myjiran/image/upload/v1612149843/org_logo/gzr4ptrq3gaavfqqytmg.png',
          projectId : this.navParam.projId
        }];
      }
    }
    this.submitAnnouncement()
  }

  async submitAnnouncement(){
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

  
  async getAllParticipant() {
    // console.log('getAllParticipant',this.navParam.projId)
    this.loadingProvider.presentLoading();
    await this.restProvider.getVolunteerList(this.navParam.projId).then((result:any) => {
      this.allVolunteerList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

    await this.restProvider.getStaffList(this.navParam.projId).then((result:any) => {
      this.allCommiteeList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

    this.allVolunteerList = this.allVolunteerList.concat(this.allCommiteeList)
    console.log('getAllParticipant',this.allVolunteerList)
  }

  checkingJoinStatus(data) {
    if (data.joinStatus == 'A' || data.joinStatus == 'Q') {
      return true
    }
    else if (data.volunteerId == undefined || data.joinStatus == undefined) {
      return true
    }
    else {
      return false
    }
  }



  getToken() {
    // this.restProvider.getTokenNoti(this.orgId, this.oaId).then((res: any) => {
    //   console.log(res);
    //   this.andList = res.android;
    //   // this.iosList = res.ios;
    //   // this.sendPush();
    // }).catch(error => {
    //   console.log(error);
    //   // this.showAlert();
    //   // this.loadingProvider.closeSaving();
    // })

  }


  exitForm() {
    this.navCtrl.back();
  }

}
