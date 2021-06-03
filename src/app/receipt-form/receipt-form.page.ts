import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController } from '@ionic/angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import { AlertProvider } from 'src/providers/alert-provider';

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
  desc: any = "";
  collectbox: boolean = false;
  showProof: boolean = true;
  type: any;
  checkCash: any;
  flashbox: boolean = false;
  defaultPersonId: any;
  oaid: any;
  AllMemberList: any = [];
  counter: any = 0;
  input: any;
  list: any = [];
  typeList: any = [];
  checkOnline: any;
  checkCheque: any;
  checkAtm: any;
  showBank: boolean = false;
  bank: any;
  bList: any;
  proofObject: any = 'https://res.cloudinary.com/myjiran/image/upload/v1611552405/org_logo/wl21i3ovar1zxlgnxvdy.png';
  showRef: boolean = false;
  showCheque: boolean = false;
  showCash: boolean = false;
  receiptDate: any;
  codeName: any;
  receiptList: any = [];
  refNum: any = null;
  receiptData: any;
  chequeNum: any = null;
  chequeBank: any = null;
  profile: any;
  amount: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private restProvider: RestProvider,
    private storage: Storage,
    public alertCtrl: AlertController,
    private loadingProvider: LoadingProvider,
    private navCtrl: NavController,
    private alertProvider: AlertProvider,
  ) { }

  ngOnInit() {
    this.storage.get('defaultProfile').then((val:any) => {this.profile = val})
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.collectCode = this.router.getCurrentNavigation().extras.state.collectCode;
        this.org = this.router.getCurrentNavigation().extras.state.org;
        this.personId = this.router.getCurrentNavigation().extras.state.personId;
        this.personName = this.router.getCurrentNavigation().extras.state.personName;
        this.role = this.router.getCurrentNavigation().extras.state.role;
        this.code = this.router.getCurrentNavigation().extras.state.code;
        this.collectCode = this.router.getCurrentNavigation().extras.state.collectCode;
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

        // donation - 4, donation box - 3, flash donation - 5

    if (this.code == 3) {
      this.receiptForm =  this.formBuilder.group({
        desc: '',
        review: '',
        receiptDate: '',
        receiptTime: '',
      });
    } else if (this.code == 4) {
      this.receiptForm = this.formBuilder.group({
        desc: '',
        type: '',
        receiptDate: '',
      });
    } else if (this.code == 'FEE') {
      this.receiptForm = this.formBuilder.group({
        desc: '',
        type: '',
        receiptDate: '',
      });
    } else if (this.code == 5) {
      this.receiptForm = this.formBuilder.group({
        desc: '',
        review: '',
        receiptDate: '',
      });
    }
    if (this.code == 4) {
      this.receiptForm.addControl('amount', new FormControl('', Validators.required));
      this.receiptForm.addControl('receiptTime', new FormControl('', Validators.required));
      this.desc = this.donateData.name;
    } else if (this.code == 'FEE') {
      this.receiptForm.addControl('amount', new FormControl('', Validators.required));
      this.receiptForm.addControl('receiptTime', new FormControl('', Validators.required));
      // this.desc = this.pList[0].feeProfileName;
    } else if (this.code == 3) {
      this.getOrgMember();
      this.collectbox = true;
      this.showProof = false;
      this.type = this.checkCash;
      this.receiptForm.addControl('amount', new FormControl('', Validators.required));
      this.receiptForm.addControl('receiptTime', new FormControl('', Validators.required));
      this.desc = this.donateData.name;

    } else if (this.code == 5) {
      this.getOrgMember();
      this.flashbox = true;
      this.showProof = false;
      this.type = this.checkCash;
      this.receiptForm.addControl('amount', new FormControl('', Validators.required));
      this.receiptForm.addControl('receiptTime', new FormControl('', Validators.required));
      this.desc = this.donateData.name;
    }
    this.storage.get('defaultPersonId').then((val: any) => {
      this.defaultPersonId = val;
    });

    this.Medium();
    // this.calculate();
  }

  Medium() {
    // this.loadingProvider.setupLoading();
    console.log("role " + this.role);
    console.log("org " + this.org);
    this.restProvider.getPaymentMedium(this.org.orgId).then((result: any) => {
      console.log(result);
      if (this.code == 3) {
        if (this.role == 'treasury' || this.role == 'ajk') {
          for (let i = 0; i < result.length; i++) {
            // if(result[i].seq == '3'){
            //   this.checkOnline = result[i].id;
            // }else if(result[i].seq == '2'){
            //   this.checkCheque = result[i].id;
            // }else if(result[i].seq == '1'){
            //   this.checkCash = result[i].id;
            // }else if(result[i].seq == '4'){
            //   this.checkAtm = result[i].id;
            // }
            if (result[i].seq == '1') {
              this.checkCash = result[i].id;
              this.typeList.push(result[i]);
              this.type = this.checkCash;
              console.log('payment type', this.type);
            }
          }
        }
      } else if (this.code == 5) {
        if (this.role == 'treasury' || this.role == 'ajk') {
          for (let i = 0; i < result.length; i++) {
            // if(result[i].seq == '3'){
            //   this.checkOnline = result[i].id;
            // }else if(result[i].seq == '2'){
            //   this.checkCheque = result[i].id;
            // }else if(result[i].seq == '1'){
            //   this.checkCash = result[i].id;
            // }else if(result[i].seq == '4'){
            //   this.checkAtm = result[i].id;
            // }
            if (result[i].seq == '1') {
              this.checkCash = result[i].id;
              this.typeList.push(result[i]);
              this.type = this.checkCash;
              console.log('payment type', this.type);
            }
          }
        }
      } else {
        if (this.role == 'user') {
          for (let i = 0; i < result.length; i++) {
            if (result[i].seq == '3') {
              this.checkOnline = result[i].id;
              this.typeList.push(result[i]);
            } else if (result[i].seq == '4') {
              this.checkAtm = result[i].id;
              this.typeList.push(result[i]);
            }
          }
        } else if (this.role == 'treasury' || this.role == 'ajk') {
          for (let i = 0; i < result.length; i++) {
            if (result[i].seq == '3') {
              this.checkOnline = result[i].id;
            } else if (result[i].seq == '2') {
              this.checkCheque = result[i].id;
            } else if (result[i].seq == '1') {
              this.checkCash = result[i].id;
            } else if (result[i].seq == '4') {
              this.checkAtm = result[i].id;
            }
            this.typeList = result;
          }
        }
      }
      // console.log('cash type', this.checkCash);
      this.Bank();

    }, (err) => {
      console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  Bank() {
    this.restProvider.getBankOrg(this.org.orgId).then((result: any) => {
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        if (result[i].type == 0) {
          this.cashId = result[i].cbId;
          result.splice(i, 1);
        }
      }
      if (result.length == 1) {
        this.showBank = false;
        this.receiptForm.removeControl('bank');
        this.bank = result[0].cbId;
        this.bankList = result;
      } else {
        if (this.code == 3) {
          this.bankList = result;
        } else {
          this.showBank = true;
          this.receiptForm.addControl('bank', new FormControl('', Validators.required));
          this.bankList = result;
        }
      }
      this.BankAbbrev();
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

  BankAbbrev() {
    this.restProvider.getBankAbbrev().then((result: any) => {
      console.log(result);
      this.bList = result;
      // this.loadingProvider.closeLoading();

    }, (err) => {
      console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  // calculate() {
  //   let amt = this.amount;
  //   if (amt < this.total) {
  //     for (let i = 0; i < this.pList.length; i++) {
  //       if (amt <= this.pList[i].balance && amt != 0) {
  //         this.zone.run(() => { // to make sure UI view is updating
  //           this.pList[i].balance = amt;
  //         });
  //         amt = amt - amt;
  //       } else if (amt > this.pList[i].balance) {
  //         this.pList[i].balance = this.pList[i].balance;
  //         amt = amt - this.pList[i].balance;
  //       } else if (amt <= 0) {
  //         this.zone.run(() => { // to make sure UI view is updating
  //           this.pList.splice(i, 1);
  //         });
  //       }
  //     }
  //   }
  // }

  getOrgMember() {

    this.oaid = this.org.orgId;
    this.input = 'A';
    let c = 1;

    // console.log(this.counter);
    this.restProvider.getMember(this.counter, this.input, this.oaid).then((result: any) => {
      this.AllMemberList = result;
      // console.log(c,this.AllMemberList.length);
      if (this.AllMemberList.length > 1) {
        this.loop()
      } else {
        this.removeuser();
      }
    }, (err) => {
      console.log(err);
    });
    this.counter = this.counter + 10;

  }

  loop() {
    // this.counter = this.counter+ 10;
    for (let v = 0; v < this.AllMemberList.length; v++) {
      this.list.push(this.AllMemberList[v]);
    }
    this.AllMemberList = [];
    this.getOrgMember();
  }

  removeuser() {
    console.log('member list', this.list);
    console.log('check for splicing');
    for (let m = 0; m < this.list.length; m++) {
      if (this.list[m].personId == this.personId) {
        console.log('splicing');
        this.list.splice(m, 1);

      }
    }
  }

  submit() {
    if (this.role == 'user') {
      if (this.type != this.checkCash && this.proofObject == null) {
        this.showWarning();
      } else if (this.type != this.checkCash && this.proofObject != null) {
        this.upload();
      }
    } else {
      //treasury or ajk
      // console.log(this.checkCash);
      // console.log();
      // if ((this.type != this.checkCash || this.type == this.checkCash) && this.proofObject == null) {
      //   //proof not mandatory
      //   this.secureURL = null;
      //   this.loadingProvider.setupSaving();
      //   if (this.code != 'FEE') {
      //     // this.createPaymentVoucher();
      //   }
      //   this.IssueReceipt();
      // } else if (this.type != this.checkCash && this.proofObject != null) {
      //   this.upload();
      // }
    }
  }

  
  onSelectChange(selected: any) {
    console.log('Selected', selected);
    if (selected == this.checkCash) {
      this.showBank = false;
      this.showProof = false;
      this.showRef = false;
      this.showCheque = false;
      this.showCash = true;
      this.receiptForm.removeControl('bank');
      this.receiptForm.removeControl('refNum');
      this.receiptForm.removeControl('chequeNum');
      this.receiptForm.addControl('amount', new FormControl('', Validators.required));
      this.bank = this.cashId;
    } else {
      if (selected == this.checkOnline) {
        console.log("online");
        this.showCash = true;
        if (this.bankList.length == 1) {
          this.showBank = false;
          this.receiptForm.removeControl('bank');
          this.bank = this.bankList[0].cbId;
        } else {
          this.showBank = true;
          this.receiptForm.addControl('bank', new FormControl('', Validators.required));
        }
        this.showRef = true;
        this.showProof = true;
        this.showCheque = false;
        this.receiptForm.addControl('refNum', new FormControl('', Validators.required));
        this.receiptForm.removeControl('chequeNum');
      } else if (selected == this.checkCheque) {
        this.showRef = false;
        this.showCheque = true;
        this.showBank = false;
        this.showProof = true;
        this.showCash = true;
        this.bank = null;
        this.receiptForm.removeControl('bank');
        this.receiptForm.addControl('chequeNum', new FormControl('', Validators.required));
        this.receiptForm.removeControl('refNum');
      } else {
        if (this.bankList.length == 1) {
          this.showBank = false;
          this.receiptForm.removeControl('bank');
          this.bank = this.bankList[0].cbId;
        } else {
          this.showBank = true;
          this.receiptForm.addControl('bank', new FormControl('', Validators.required));
        }
        this.showProof = true;
        this.showRef = false;
        this.showCheque = false;
        this.showCash = true;
        this.receiptForm.removeControl('refNum');
        this.receiptForm.removeControl('chequeNum');
      }
    }
  }

  onReviewerChange(selected: any) {
    // console.log('Selected', selected);
    // this.treasuryId = selected;
    // console.log(this.treasuryId);
  }

  showWarning() {
    console.log('All field are required.')
    // const alert = this.alertCtrl.create({
    //   title: 'Warning!',
    //   subTitle: 'All field are required.',
    //   buttons: ['OK']
    // });
    // alert.present();
  }

  upload() {
    this.IssueReceipt();
    // this.loadingProvider.setupSaving();
    // this.restProvider.cloudinaryUpload(this.proofObject, 'user', 'receipt')
    //   .then((res) => {
    //     for (let i = 0; i < res.length; i++) {
    //       let x = JSON.parse(res[i]);
    //       this.secureURL = x.secure_url;
    //     }
    //     this.loadingProvider.closeSaving();
    //     console.log(this.secureURL);
    //     this.IssueReceipt();
    //   }).catch(error => {
    //     console.log(error);
    //     this.loadingProvider.closeSaving();
    //     const alert = this.alertCtrl.create({
    //       title: 'Cloudinary Server Error!',
    //       subTitle: 'Please try again later.',
    //       buttons: ['OK']
    //     });
    //     alert.present();
    //   })
  }

  IssueReceipt() {

    this.receiptDate = this.receiptDate.replace(/Z/g,'')
    console.log('the code', this.code);
    if (this.code == "FEE") {
      this.codeName = this.code;
    } else {
      this.codeName = this.donateData.code;
    }
    this.receiptList = [];
    if (this.code == 4) {
      let con = {
        distributionCode: this.donateData.code, //whatever return from donation list,etc :DONA
        description: this.donateData.name, //receipt desc
        receiptAmt: this.amount //amount you pay
      }
      this.receiptList.push(con);
    } else if (this.code == 3) {
      let con = {
        distributionCode: this.donateData.code, //whatever return from donation list,etc :DONA
        description: this.donateData.name, //receipt desc
        receiptAmt: this.amount //amount you pay
      }
      this.receiptList.push(con);
    } else if (this.code == 5) {
      let con = {
        distributionCode: this.donateData.code, //whatever return from donation list,etc :DONA
        description: this.donateData.name, //receipt desc
        receiptAmt: this.amount //amount you pay
      }
      this.receiptList.push(con);
    } else {
      //fee
      // for (let i = 0; i < this.pList.length; i++) {
      //   let con = {
      //     mbsdId: this.pList[i].mbsdId, //for fee only
      //     receiptAmt: this.pList[i].balance
      //   }
      //   this.receiptList.push(con);
      // }
    }
    if (this.code != 3 && this.code != "JUMAAT") {
      if (this.role == 'user') {
        console.log('is user & code is not 3/jumaat');
        if (this.type == this.checkAtm) {
          this.refNum = 'CDM/ATM/Counter';
        }
        this.receiptData = {
          orgId: this.org.orgId,
          date: new Date(this.receiptDate),
          amount: this.amount,
          personId: this.personId,
          recipientName: this.personName,
          description: this.desc,
          reference: this.refNum,
          subModule: "MP", //mobile payment
          smpmId: this.type,
          cbId: this.bank,
          imageUrl: this.proofObject,//this.secureURL,
          issuedBy: {
            personId: this.personId
          },
          receiptDetails: this.receiptList,
          address1: this.profile.address1,
          address2: this.profile.address2,
          address3: this.profile.address3
        }
      } else if (this.role == 'treasury' || this.role == 'ajk') {
        console.log('is treasurer/ajk & code is not 3/jumaat');
        if (this.type == this.checkCheque) {
          this.refNum = this.chequeBank + this.chequeNum;
        }
        if (this.type == this.checkCash) {
          this.refNum = 'CASH';
        }
        if (this.type == this.checkAtm) {
          this.refNum = 'CDM/ATM/Counter';
        }
        this.receiptData = {
          orgId: this.org.orgId,
          date: new Date(this.receiptDate),
          amount: this.amount,
          personId: this.personId, //payorId carry from navParams
          recipientName: this.personName, //payorName or pengira carry from navParams
          description: this.desc,
          reference: this.refNum,
          subModule: "MP", //mobile payment
          smpmId: this.type,
          cbId: this.bank,
          imageUrl: this.proofObject,//this.secureURL,
          issuedBy: { //payee or penyemak name
            // personId: this.treasuryId
          },
          receiptDetails: this.receiptList,
          address1: this.profile.address1,
          address2: this.profile.address2,
          address3: this.profile.address3
        }
      }
    } else if (this.code == 3 || this.code == "JUMAAT") {
      if (this.role == 'user') {
        console.log('is user & code is 3/jumaat');
        if (this.type == this.checkAtm) {
          this.refNum = 'CDM/ATM/Counter';
        }
        this.receiptData = {
          orgId: this.org.orgId,
          date: new Date(this.receiptDate),
          amount: this.amount,
          personId: this.personId,
          recipientName: this.profile.name,//this.collector,
          description: this.desc,
          reference: this.refNum,
          subModule: "MP", //mobile payment
          smpmId: this.type,
          cbId: this.bank,
          imageUrl: this.proofObject,//this.secureURL,
          issuedBy: {
            personId: this.personId
          },
          receiptDetails: this.receiptList,
          address1: this.profile.address1,
          address2: this.profile.address2,
          address3: this.profile.address3
        }

      } else if (this.role == 'treasury' || this.role == 'ajk') {
        console.log('is treasurer/ajk & code is 3/jumaat');

        if (this.type == this.checkCheque) {
          this.refNum = this.chequeBank + this.chequeNum;
        }
        if (this.type == this.checkCash) {
          this.refNum = 'CASH';
        }
        if (this.type == this.checkAtm) {
          this.refNum = 'CDM/ATM/Counter';
        }
        this.receiptData = {
          orgId: this.org.orgId,
          date: new Date(this.receiptDate),
          amount: this.amount,
          personId: this.personId, //payorId carry from navParams
          recipientName: this.profile.name,//collector, //payorName or pengira carry from navParams
          description: this.desc,
          reference: this.refNum,
          subModule: "MP", //mobile payment
          smpmId: this.type,
          cbId: this.bank,
          imageUrl: this.proofObject,//this.secureURL,
          issuedBy: { //payee or penyemak name
            // personId: this.treasuryId
          },
          receiptDetails: this.receiptList,
          address1: this.profile.address1,
          address2: this.profile.address2,
          address3: this.profile.address3
        }

      }
    }
    // this.loadingProvider.closeSaving();
    this.send(this.codeName);
  }

  send(code) {
    this.loadingProvider.presentLoading();
    console.log(this.receiptData);
    if (this.role == 'user' || this.role == 'ajk') {
      this.restProvider.PendingReceipt(this.receiptData).then((result: any) => {
        console.log(result);
        // this.informTreasury();
        this.loadingProvider.closeSaving();
        this.exitForm();
        this.alertProvider.successAlert()
      }, (err) => {
        this.loadingProvider.closeSaving();
        console.log(err);
        this.alertProvider.errorAlert()
        // this.showAlert();
      });
    } else if (this.role == 'treasury') {
      // this.restProvider.ConfirmReceipt(this.receiptData).then((result: any) => {
      //   console.log(result);
      //   this.loadingProvider.closeSaving();
      //   if (code == "JUMAAT") {
      //     // const alert = this.alertCtrl.create({
      //     //   title: 'Successful',
      //     //   subTitle: 'Jumaat collection record have been saved.',
      //     //   buttons: [{
      //     //     text: 'Okay',
      //     //     handler: () => {
      //     //       console.log('Okay clicked');
      //     //         this.navCtrl.pop();
      //     //     }
      //     //   },]
      //     // });
      //     // alert.present();
      //     this.getReport(result.number, result.recipientName, this.code, this.codeName);
      //   } else {
      //     this.getReport(result.number, result.recipientName, this.code, this.codeName);
      //   }
      // }, (err) => {
      //   console.log(err);
      //   this.loadingProvider.closeSaving();
      //   this.showAlert();
      // });

      // var x = {
      //   date : new Date()
      // }
      // this.restProvider.testApi(x).then((result:any) =>{
      //   console.log(result);
      // },(error) =>{
      //   console.log(error);
      // });
    }
  }
  exitForm() {
    this.navCtrl.back();
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