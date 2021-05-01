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
  andList: any;


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
    this.storage.get('defaultProfile').then((val:any) => {this.oaId = val.oaId})
    this.storage.get('personOrgs').then((val:any) => {this.orgId = val})
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        this.fromPage = this.router.getCurrentNavigation().extras.state.from;
        this.taskDetail = this.router.getCurrentNavigation().extras.state.data;
        console.log('navParam',this.navParam)
      }
    });
    if (this.fromPage == 'volunteer-list') {
      this.getAllVolunteer();
    }
    else {
      this.getAllParticipant();
    }

    // this.volunteerInfoForm = this.formBuilder.group({
    //   full_name: [],
    //   nric: [],
    //   address_unit_no: [],
    //   address_street_name_01: [],
    //   address_postcode: [],
    //   address_city: [],    
    //   address_state: [],   
    //   skills: [],
    //   other_skills: [],    
    //   interest: [],   
    // });
  }

  getAllVolunteer() {
    this.loadingProvider.presentLoading();
    this.restProvider.getAllVolunteerList('VOLUNTEER',this.orgId).then((result:any) => {
      console.log('getVolunteerList',result);
      this.allVolunteerList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

  }

  chooseVolunteer(data) {
    this.chosenVolunteer.push(data)
 
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
          voidStatus: "A"
        }
        body.push(data);
      }
      this.restProvider.addVolunteer(body).then((result:any) => {
        this.loadingProvider.closeLoading();
        this.exitForm();
      }, (err) => {
        // console.log(err);
        this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    }
    else {
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
      }, (err) => {
        // console.log(err);
        this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    }

  }

  getAllParticipant() {
    this.loadingProvider.presentLoading();
    this.restProvider.getVolunteerList(this.navParam.projId).then((result:any) => {
      this.allVolunteerList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

  }

  getToken() {
    this.restProvider.getTokenNoti(this.orgId, this.oaId).then((res: any) => {
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


  exitForm() {
    this.navCtrl.back();
  }

}
