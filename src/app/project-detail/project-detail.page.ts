import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CallNumberProvider } from 'src/providers/call-number.provider';
import { LaunchNavigatorProvider } from 'src/providers/launch-navigator.provider';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { RestProvider } from 'src/providers/rest/rest';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit {
  private projectDetail = {
    project_name: 'Third Wave Covid-19 Emergency',
    project_image: 'assets/covid-img.jpg',
    description:'The world is facing an unprecedented challenge with communities and economies everywhere affected by the growing COVID-19 pandemic. The world is coming together to combat the COVID-19 pandemic bringing governments, organizations from across industries and sectors and individuals together to help respond to this global outbreak',
    // unit_no:'Unit 5',
    address:'Kampung Melayu Subang',
    city:'Shah Alam',
    postcode:'35000',
    state:'Selangor'
  }

  private data;
  navParam: any;
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private callNumberProvider: CallNumberProvider,
    private launchNavigatorProvider: LaunchNavigatorProvider,
    private inAppBrowser: InAppBrowser,
    private emailComposer: EmailComposer,
    private restProvider: RestProvider
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        console.log('data',this.data)
        this.navParam = this.data
      }
    });
    this.getDetailProject();
  }


  callFx() {
    let phoneNumber = '0174164546';
    this.callNumberProvider.dialingFx(phoneNumber)
  }

  launchNavigation() {
    let address = 'Serin Residency, Jalan Fauna 1, 63000 Cyberjaya Selangor'
    this.launchNavigatorProvider.launchNavigation(address)
  }

  launchWhatsapp() {
    const browser = this.inAppBrowser.create('http://www.wasap.my/60174164546', '_system'); 
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

  getDetailProject() {
    this.restProvider.getProjectDetail(this.navParam.projId).then((result:any) => {
      console.log('getProjectDetail',result);
      this.projectDetail = result;
      // to make sure UI view is updatinig
      // this.zone.run(() => {
      // for(let i=0; i<result.length; i++){
      //   this.isDonateShown.push(false);
      // }
      // this.loadingProvider.closeLoading();
      // });
    }, (err) => {
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  checkAddress(data) {
    if (data != null) {
      return data + ','
    }
  }

  navNextPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.projectDetail
      }
    };
    this.router.navigate(['live-feed'], navigationExtras);
  }

}
