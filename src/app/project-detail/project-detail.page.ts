import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CallNumberProvider } from 'src/providers/call-number.provider';
import { LaunchNavigatorProvider } from 'src/providers/launch-navigator.provider';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { ImageProvider } from 'src/providers/image.provider';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { AlertProvider } from 'src/providers/alert-provider';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit {
  private projectDetail;

  private data;
  navParam: any;
  expand: boolean = false;
  fromPage: any;
  role: any;
  restParam: { personId: any; hostId: any; profilePictUrl: any; referFrom: any; orgId: any; title: string; notes: string; programStart: any; programEnd: any; location: any; duration: number; subModule: string; paramType: string; privateEvent: boolean; orgName: string; orgLogo: string; projectId: any; }[];
  profile: any;
  orgId: any;
  mediaList=[];
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private callNumberProvider: CallNumberProvider,
    private launchNavigatorProvider: LaunchNavigatorProvider,
    private inAppBrowser: InAppBrowser,
    private emailComposer: EmailComposer,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider,
    private imageProvider: ImageProvider,
    private storage: Storage,
    private navCtrl: NavController,
    private alertProvider: AlertProvider
  ) { }

  ngOnInit() {
    this.storage.get('defaultProfile').then((val:any) => {this.profile = val})
    this.storage.get('personOrgs').then((val:any) => {this.orgId = val})
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        this.fromPage = this.router.getCurrentNavigation().extras.state.action;
        this.role = this.router.getCurrentNavigation().extras.state.role;
        console.log('navParam',this.navParam,this.fromPage,this.role)
      }
    });

    this.getDetailProject();
  }


  callFx() {
    let phoneNumber = this.projectDetail.contact_code + this.projectDetail.mobile_num;
    this.callNumberProvider.dialingFx(phoneNumber)
  }

  launchNavigation() {
    // let address = 'Serin Residency, Jalan Fauna 1, 63000 Cyberjaya Selangor'
    // let address = this.projectDetail.address1 + ', ' + this.projectDetail.postcode + ' ' + this.projectDetail.city + ', ' + this.projectDetail.state+ ', ' + this.projectDetail.countryName;
    this.launchNavigatorProvider.launchNavigation(this.projectDetail.location)
  }

  launchWhatsapp() {
    const browser = this.inAppBrowser.create(this.projectDetail.wsLink, '_system'); 
  }

  composeEmail() {
    let email = {
      to: this.projectDetail.email,
      cc: '',
      bcc: ['', ''],
      attachments: [],
      subject: 'Asking question about project..',
      body: '',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  expandFx() {
    if (this.expand == false) {
      this.expand = true;
    }
    else {
      this.expand = false;
    }
  }

  getDetailProject() {
    this.loadingProvider.presentLoading();
    this.restProvider.getProjectDetail(this.navParam.projId).then((result:any) => {
      console.log('getProjectDetail',result);
      this.projectDetail = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      // console.log(err);
      this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  checkAddress(data) {
    if (data != null) {
      return data + ','
    }
  }

  requestJoin() {
    this.createAnnouncement();
    // this.storage.get('defaultPersonId').then((val:any) => {
    //   this.restProvider.requestJoin(val, this.navParam.projId).then((result:any) => {
    //     console.log('getProjectDetail',result);
    //     this.loadingProvider.closeLoading();
    //     this.createAnnouncement();
    //     this.navCtrl.back();
    //   }, (err) => {
    //     // console.log(err);
    //     this.loadingProvider.closeLoading();
    //     // this.showAlert();
    //   });
    // });

  }

  createAnnouncement() {
    this.restParam = [{
      personId : this.profile.personId,
      hostId : this.profile.personId,
      profilePictUrl: this.profile.profilePicture,
      referFrom : null,
      orgId : this.orgId,
      title : 'request to join' + ' ' + this.projectDetail.projName,
      notes : this.profile.name + ' ' + 'request to join' + ' ' + this.projectDetail.projName,
      programStart: this.projectDetail.projectStart,
      programEnd: this.projectDetail.projectEnd,
      location : this.projectDetail.location,
      duration : 7,
      subModule: 'AN',
      paramType : 'R',
      privateEvent: false,
      orgName : 'Malaysian Relief Agency',
      orgLogo : 'https://res.cloudinary.com/myjiran/image/upload/v1612149843/org_logo/gzr4ptrq3gaavfqqytmg.png',
      projectId : this.projectDetail.projId
    }];
    this.submitAnnouncement()
  }

  async submitAnnouncement(){
    this.loadingProvider.presentLoading();
    let formData = await this.processData();
    this.restProvider.createAnnouncement(formData).then((result:any) => {
      console.log(result);
      this.loadingProvider.closeSaving();
      // this.nav.setRoot(TabsPage,{tabIndex: 0});
      // this.navCtrl.pop();
      this.exitForm();
      this.alertProvider.successAlert()
    }, (err) => {
      this.loadingProvider.closeSaving();
      console.log(err);
       this.alertProvider.errorAlert()
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


  navNextPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.projectDetail,
        from:'feed'
      }
    };
    this.router.navigate(['live-feed'], navigationExtras);
  }

  navVolunteerPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.projectDetail,
        from:'volunteer',
        role: this.role
      }
    };
    this.router.navigate(['volunteer-list'], navigationExtras);
  }

  navTaskPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.projectDetail,
        from:'task',
        role: this.role
      }
    };
    this.router.navigate(['task-list'], navigationExtras);
  }
    exitForm() {
    this.navCtrl.back();
  }

}
