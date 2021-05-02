import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';


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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private formBuilder: FormBuilder,
    public loadingProvider: LoadingProvider,
    public restProvider: RestProvider,


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
    await this.storage.get('defaultProfile').then((val:any) => {   //untuk guna storage
      console.log("val",val)
      this.profile= val
      //this.setupForm()
    })
    this.updateForm()        //trigger update formm .
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
    ////this.loadingProvider.setupSaving();
    console.log('update param  '+ JSON.stringify(this.profileForm.value));
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
    console.log("getProfile data:"+this.profile);
    this.restProvider.getProfile(this.profile).then((result) => {    //get data from REST
      console.log("result untuk simpan"+ result);
      this.storage.set('defaultProfile', result);   //update ke storage
      //this.loadingProvider.closeSaving();    loading ui
      //this.navCtrl.pop();          pergi back ke previous page
    }, (err) => {
      console.log(err);
      //this.loadingProvider.closeSaving();
    });
  }




}
