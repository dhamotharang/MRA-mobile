import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RestProvider } from 'src/providers/rest/rest';

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.page.html',
  styleUrls: ['./receipt-form.page.scss'],
})
export class ReceiptFormPage implements OnInit {
  private receiptForm: FormGroup;
  navParam: any;
  role: any;
  fromPage: any;
  code: any;
  collectCode: any;
  org: any;
  personId: any;
  personName: any;
  donateData: any;
  pvData: { orgId: any; cbId: any; payeeName: any; description: any; smpmId: any; distCode: any; amount: any; createdDate: Date; };
  cashId: any;
  bankList: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private restProvider: RestProvider,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.role = this.router.getCurrentNavigation().extras.state.role;
        this.code = this.router.getCurrentNavigation().extras.state.code;
        this.collectCode = this.router.getCurrentNavigation().extras.state.collectCode;
        this.org = this.router.getCurrentNavigation().extras.state.org;
        this.personId = this.router.getCurrentNavigation().extras.state.personId;
        this.personName = this.router.getCurrentNavigation().extras.state.personName;
        this.donateData = this.router.getCurrentNavigation().extras.state.donateData;
        console.log('navParam',this.navParam,this.fromPage,this.role)
      }
    });
    this.receiptForm = this.formBuilder.group({
      taskName: [],
      description:[],
      startDate:[],
      dueDate:[],
      status:[],
    });
  }

  Bank() {
    this.restProvider.getBank().then((result: any) => {
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        if (result[i].type == 0) {
          this.cashId = result[i].cbId;
          result.splice(i, 1);
        }
      }
      // if (result.length == 1) {
      //   this.showBank = false;
      //   this.receiptForm.removeControl('bank');
      //   this.bank = result[0].cbId;
      //   this.bankList = result;
      // } else {
      //   if (this.code == 3) {
      //     this.bankList = result;
      //   } else {
          // this.showBank = true;
          // this.receiptForm.addControl('bank', new FormControl('', Validators.required));
          this.bankList = result;
      //   }
      // }
      // this.BankAbbrev();
      // if(this.role == 'treasury'){
      //   this.BankAbbrev();
      // }else{
      //   this.loadingProvider.closeLoading();
      // }

    }, (err) => {
      console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }


  createPaymentVoucher() {
    // this.pvData = {
    //   orgId: this.org.orgId,
    //   cbId: this.bank,
    //   payeeName: this.personName,
    //   description: this.donateData.name,
    //   smpmId: this.type,
    //   distCode: this.donateData.code,
    //   amount: this.amount,
    //   createdDate: new Date(this.receiptDate),
    // }
    // // console.log('check bank',this.bank);
    // // console.log('check pv data',this.pvData);

    // this.restProvider.createPaymentVoucher(this.pvData).then((res: any) => {
    //   console.log(res);
    //   this.loadingProvider.closeSaving();
    // }, (err) => {
    //   console.log(err);
    //   this.loadingProvider.closeSaving();
    //   this.showAlert();
    // });

  }

}
