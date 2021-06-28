import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import { LoadingProvider } from 'src/providers/loading-provider';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit {
  fee: any;
  feeList = [];
  selectedYear: any = 'All';
  feeListSelected: any;
  profile: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restProvider: RestProvider,
    private storage: Storage,
    private loadingProvider: LoadingProvider,
  ) { }

  ngOnInit() {   
    this.loadingProvider.presentLoading();
    this.storage.get('defaultProfile').then((val:any) => {
      this.profile = val;
      this.restProvider.getFee(this.profile.personId).then((result:any) => {
        // this.loadingProvider.closeLoading();
        if (result != null) {
          this.feeList = result.filter(x => x.orgProfile.orgId == 320)
          console.log('this.feeList',this.feeList)
          this.feeListSelected = this.feeList[0].fee;
        }
        this.loadingProvider.closeLoading();
  
      }, (err) => {
        this.loadingProvider.closeLoading();
        console.log('getOrg err',err);
        // this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    })

  }

  yearSelected(data) {
    console.log('yearSelected',this.selectedYear)
    if (data.detail.value != 'All') {
      this.feeListSelected = this.feeList[0].fee.filter(x => x.currentYear == this.selectedYear)
      console.log('feeListSelected',this.feeListSelected)
    }
    else {
      this.feeListSelected = this.feeList[0].fee;
    }

  }

}
