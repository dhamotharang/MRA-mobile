import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import { DomSanitizer } from '@angular/platform-browser';
declare var window;
import { Storage } from '@ionic/storage-angular';
import { NativeGeocoderOptions, NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertProvider } from 'src/providers/alert-provider';
declare var google;


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  private project_name: String = 'Third Wave Covid-19 Emergency';
  private project_image: String ='assets/covid-img.jpg'
  private postForm: FormGroup;
  private image: string;
  private currentImage;
  private data: any;
  private navParam: any;
  private secureURL:any;
  private fromPage: any;
  staffList: any;
  participant=[]
  taskDetail: any;
  address: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  latLng: any;
  personId: any;
  param: { upload_preset: string; folder: string; file: string; };
  imgList = [];

  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    private restProvider: RestProvider,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingProvider: LoadingProvider,
    private sanitize: DomSanitizer,
    private storage: Storage,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private alertProvider: AlertProvider
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        this.fromPage = this.router.getCurrentNavigation().extras.state.from||null;
        this.taskDetail = this.router.getCurrentNavigation().extras.state.data||null;
        console.log('data',this.navParam,this.fromPage,this.taskDetail)
        // this.navParam = this.data
      }
    });
    this.storage.get('defaultPersonId').then((val:any) => {this.personId = val})
    // this.getGeolocation();
    this.setupPage();
  }

  setupPage() {
    if (this.fromPage == 'task')  {
      this.postForm = this.formBuilder.group({
        taskName: [],
        description:[],
        startDate:[],
        dueDate:[],
        status:[],
      });
    }
    else if (this.fromPage == 'commentTask') {
      this.postForm = this.formBuilder.group({
        taskId:this.taskDetail.taskId,
        taskComment:[],
        taskPicture:[],
      });
    }
    else {
      this.postForm = this.formBuilder.group({
        formName: [],
      });
    }
  }

  getImageFx() {
    this.image = null;
    const cameraOptions: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 0
    }
    this.camera.getPicture(cameraOptions).then(data => {
      this.image = 'data:image/jpeg;base64,' + data;
      this.param = {
        'upload_preset': 'c4gf0qoq',
        'folder': 'mra/gallery',
        'file':this.image,
      };
    this.upload();
    }, error => console.log(error, "errorGetImage"))
  }

  takePicture() {
    this.image = null;
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
    }
    this.camera.getPicture(cameraOptions).then(mediaData => {
      console.log(mediaData);
      this.image = 'data:image/jpeg;base64,' + mediaData;
      this.param = {
           'upload_preset': 'c4gf0qoq',
           'folder': 'mra/gallery',
           'file':this.image,
         };
      this.upload();
     }, (err) => {
       console.log(err);
     });
  }



  upload(){
    this.loadingProvider.presentLoading();
    this.restProvider.imageUpload(this.param)
      .then((res) => {
        this.loadingProvider.closeLoading();
        this.secureURL = null
        let result = JSON.parse(res)
        this.secureURL = result.eager[0].secure_url
        console.log('this.secureURL',this.secureURL);
        this.imgList.push(this.secureURL)
        // this.alertProvider.successAlert()
      }).catch(error => {
        this.loadingProvider.closeLoading();
        console.log(error);
        this.alertProvider.errorAlertParam('Error!','Error upload image!')
      })
  }
  

  // checkSize(path): Promise<any>{
  //   console.log(path);
  //   return new Promise((resolve,reject) => {
  //     window.resolveLocalFileSystemURL(path, (fileEntry) => {
  //         fileEntry.getMetadata((metadata:any) => {
  //             console.log(metadata);
  //             let size = (metadata.size*0.000001).toFixed(2);
  //             console.log(size);
  //             resolve(size);
  //         });
  //     }, (error) => { console.log(error); reject('error') });
  //   });
  // }

  postProjectFeed() { //without image
    this.loadingProvider.presentLoading();
    this.restProvider.postProjectFeed(this.postForm.value,this.navParam,this.personId).then((result:any) => {
      console.log('postProjectFeed',result);
       this.loadingProvider.closeLoading();
      this.postImageFeed(result)
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
      this.alertProvider.errorAlert();
      // this.showAlert();
    });
  }

  postImageFeed(result) {
    if (this.image != null) {
      this.restProvider.postFeedImage(result.feedId,this.navParam,this.secureURL,null).then((result:any) => {
        console.log('postProjectFeed',result);
        this.loadingProvider.closeLoading();
        this.exitForm();
        this.alertProvider.successAlert()
      }, (err) => {
        console.log(err);
        this.loadingProvider.closeLoading();
        this.alertProvider.errorAlert()
        // this.showAlert();
      });
    }
    else {
      this.exitForm();
      this.alertProvider.successAlert()
    }
  }


  postProjectTask() {
    console.log('this.postForm.value',this.postForm.value);
    this.loadingProvider.presentLoading();
    this.restProvider.postTaskSingle(this.postForm.value,this.personId,this.navParam.projId).then((result:any) => {
     this.loadingProvider.closeLoading();
     // this.exitForm();
      this.postImageTask(result)
    }, (err) => {
      this.loadingProvider.closeLoading();
      this.alertProvider.errorAlert();
      console.log(err);
    
      // this.showAlert();
    });
  }

  postImageTask(result) {
    if (this.image != null) {
      this.restProvider.postFeedImage(null,this.navParam,this.secureURL,result.taskId).then((result:any) => {
        console.log('postImageTask',result);
        this.loadingProvider.closeLoading();
        this.exitForm();
        this.alertProvider.successAlert()
      }, (err) => {
        console.log(err);
        this.loadingProvider.closeLoading();
        this.alertProvider.errorAlert()
        // this.showAlert();
      });
    }
    else {
      this.exitForm();
      this.alertProvider.successAlert()
    }
  }

  postTaskComment() {
    console.log('this.postForm.value',this.postForm.value);
    this.loadingProvider.presentLoading();
    this.restProvider.postTaskComment(this.postForm.value,this.personId,this.secureURL).then((result:any) => {
     this.loadingProvider.closeLoading();
     this.exitForm();
    }, (err) => {
      this.loadingProvider.closeLoading();
      this.alertProvider.errorAlert();
      console.log(err);
      // this.showAlert();
    });
  }

  exitForm() {
    this.navCtrl.back();
  }






}



  //   //Get current coordinates of device
  // getGeolocation() {
  //   this.geolocation.getCurrentPosition().then((resp) => {

  //     this.latitude = resp.coords.latitude;
  //     this.longitude = resp.coords.longitude;
  //     this.accuracy = resp.coords.accuracy;

  //     // this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
  //     this.latLng = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
  //     console.log('getGeolocation',this.latLng)

  //   }).catch((error) => {
  //     alert('Error getting location' + JSON.stringify(error));
  //   });
  // }





  // attachGeolocation() {
  //   this.near()
  // }


  // near(){
  //   var service = new google.maps.places.PlacesService();
  //   let request = {
  //       location : this.latLng,
  //       radius : '500' ,
  //       // types: ["restaurant"]
  //   };
  //   return new Promise((resolve,reject)=>{
  //       service.nearbySearch(request,function(results,status){
  //           if(status === google.maps.places.PlacesServiceStatus.OK)
  //           {
  //             for (let i = 0; i < results.length; i++) {
  //               let con = {
  //                 name : results[i].name,
  //                 vicinity : results[i].vicinity,
  //                 lat: results[i].geometry.location.lat(),
  //                 lng: results[i].geometry.location.lng(),
  //               }
  //               this.zone.run(() => {// to make sure UI view is updatinig
  //                 this.nearbyList.push(con);
  //               });
  //               console.log('nearbyList',this.nearbyList)
  //             }
  //               // resolve(results);  
                  
  //           }else
  //           {
  //               reject(status);
  //           }

  //       }); 
  //   });
  // }