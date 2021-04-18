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
  ) { }

  ngOnInit() {
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
    let phoneNumber = '0174164546';
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
      to: 'nisahasin95@gmail.com',
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
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.requestJoin(val, this.navParam.projId).then((result:any) => {
        console.log('getProjectDetail',result);
        this.projectDetail = result;
        this.loadingProvider.closeLoading();
      }, (err) => {
        // console.log(err);
        this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    });

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

}
