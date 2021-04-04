import { Component, OnInit } from '@angular/core';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-volunteer-list',
  templateUrl: './volunteer-list.page.html',
  styleUrls: ['./volunteer-list.page.scss'],
})
export class VolunteerListPage implements OnInit {
  private volunteerList = [
    {volunteer_name: 'muhammad ali',volunteer_image: 'assets/volunteer.jpg',contact:'012-3456678',job:'Electrician'},
    {volunteer_name: 'muhammad ali',volunteer_image: 'assets/volunteer.jpg',contact:'012-3456678',job:'Electrician'},
    {volunteer_name: 'muhammad ali',volunteer_image: 'assets/volunteer.jpg',contact:'012-3456678',job:'Electrician'},
    {volunteer_name: 'muhammad ali',volunteer_image: 'assets/volunteer.jpg',contact:'012-3456678',job:'Electrician'}
  ]
  navParam: any;

  constructor(
    private loadingProvider: LoadingProvider,
    private restProvider: RestProvider,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        console.log('navParam',this.navParam)
      }
    });
    this.getVolunteerList();
  }

  getVolunteerList() {
    this.loadingProvider.presentLoading();
    this.restProvider.getVolunteerList(this.navParam.projId).then((result:any) => {
      console.log('getVolunteerList',result);
      this.volunteerList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

}
