import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';
import { AlertProvider } from 'src/providers/alert-provider';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  navParam: any;
  profile: any;
  profileForm: FormGroup;  //declare
  alertCtrl: AlertController;
  provider: any;
  param = {
    providerCode: "",
    providerId: "",
    token: "",
    platform:""
  }
  profilePersonId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private formBuilder: FormBuilder,
    public loadingProvider: LoadingProvider,
    public restProvider: RestProvider,
    private navCtrl: NavController,
    private alertProvider: AlertProvider,


  ) {
    this.setupForm()
    // this.storage.get('defaultProfile').then((val:any) => {   //untuk guna storage
    //   console.log("val",val)
    //   this.profile= val
    //   this.setupForm()
    // })
  }



  ngOnInit() {
    this.getOrg()
  }

  async getOrg(){
    await this.storage.get('nonOrgPersonId').then((val:any) => {this.profilePersonId=val; console.log('profilePersonId',val)})
    await this.storage.get('provider').then((val:any) => { this.provider= val; console.log('provider',val)})
    await this.storage.get('provider').then((val:any) => { this.param= val; console.log('provider',val)})
    await this.storage.get('defaultProfile').then((val:any) => {
      this.profile=val; 
      this.profile.personId = this.profilePersonId; 
      console.log('profile',this.profile)
    })
    this.updateForm() 
  }

  updateForm(){
    this.profileForm.controls.name.setValue(this.profile.name);
    this.profileForm.controls.icNo.setValue(this.profile.icNo);
    this.profileForm.controls.gender.setValue(this.profile.gender);
    this.profileForm.controls.contactCode.setValue(this.profile.contactCode);
    this.profileForm.controls.contactNo.setValue(this.profile.contactNo);
    this.profileForm.controls.email.setValue(this.profile.email);
    this.profileForm.controls.address1.setValue(this.profile.address1);
    this.profileForm.controls.address2.setValue(this.profile.address2);
    this.profileForm.controls.address3.setValue(this.profile.address3);
    this.profileForm.controls.postcode.setValue(this.profile.postcode);
    this.profileForm.controls.city.setValue(this.profile.city);
    this.profileForm.controls.country.setValue(this.profile.country);
    this.profileForm.controls.state.setValue(this.profile.state);
    //this.profile.name = "Abu";
  }

  setupForm(){
    this.profileForm = this.formBuilder.group({    //use form builder
      name: [], //kita create then guna kat html, amek from val data dari chrome
      icNo:  [],
      contactNo:  [],
      contactCode: [],
      postcode:  [],
      email:  [],
      gender: [],
      address1: [],
      address2: [],
      address3: [],
      city: [],
      country: [],
      state: []

    })
  }

  save(){
    this.profile.name = this.profileForm.controls.name.value;
    this.profile.icNo = this.profileForm.controls.icNo.value;
    this.profile.gender = this.profileForm.controls.gender.value;
    this.profile.contactCode = this.profileForm.controls.contactCode.value;
    this.profile.contactNo = this.profileForm.controls.contactNo.value;
    this.profile.email = this.profileForm.controls.email.value;
    this.profile.address1 = this.profileForm.controls.address1.value;
    this.profile.address2 = this.profileForm.controls.address2.value;
    this.profile.address3 = this.profileForm.controls.address3.value;
    this.profile.postcode = this.profileForm.controls.postcode.value;
    this.profile.country = this.profileForm.controls.country.value;
    this.profile.state = this.profileForm.controls.state.value;
    this.profile.orgId = 320;
    this.profile.providerCode = this.provider.providerCode
    this.profile.providerId = this.provider.providerId
    console.log('getProfile',this.profile)
    ////this.loadingProvider.setupSaving();
    this.restProvider.updateProfile(this.profile).then((result) => {
      console.log(result);
      this.getProfile();
    }, (err) => {
      console.log(err);
      //this.loadingProvider.closeSaving();
      //this.showAlert();
    });
  }

  getProfile() {
    this.restProvider.getProfile(this.param).then((result) => {    //get data from REST
      this.storage.set('defaultProfile', result);   //update ke storage
      this.loadingProvider.closeSaving();    //loading ui
      this.exitForm();
      this.alertProvider.successAlert()
      //this.navCtrl.pop();          pergi back ke previous page
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeSaving();
      this.alertProvider.errorAlert()
    });
  }

  exitForm() {
    this.navCtrl.back();
  }


}