import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Router, ActivatedRoute } from '@angular/router';

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
  

  constructor(
    public callNumber: CallNumber,
    public launchNavigator: LaunchNavigator,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        console.log('data',this.data)
      }
    });
  }


  callFx() {
    let phoneNumber = '0174164546';
    console.log('dialingFx', phoneNumber)
    this.callNumber.callNumber(phoneNumber, true)
        .then(res => console.log('Launched dialer!', res));
  }

  launchNavigation() {
    let address = 'Serin Residency, Jalan Fauna 1, 63000 Cyberjaya Selangor'
    console.log('launchNavigation', address)
    let options: LaunchNavigatorOptions = {
        start: address
    };
  
    this.launchNavigator.navigate(address)
        .then(
            success => console.log('Launched navigator'),
            error => console.log('error Launched navigator'))
  }

}
