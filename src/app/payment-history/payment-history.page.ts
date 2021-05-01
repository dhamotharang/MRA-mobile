import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit {
  fee: any;
  feeList: any;
  selectedYear: any = 'All';
  feeListSelected: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {   
    this.route.queryParams.subscribe(params => {
      console.log('ngOnInit',params) 
      if (this.router.getCurrentNavigation().extras.state) {
        this.fee = this.router.getCurrentNavigation().extras.state.fee;
        this.filterFee();
      }
    });
  }

  filterFee() {
    this.feeList = this.fee.filter(x => x.orgId == 320)
    console.log('this.feeList',this.feeList)
    this.feeListSelected = this.feeList[0].fee;
    console.log('feeListSelected',this.feeListSelected)

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
