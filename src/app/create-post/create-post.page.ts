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
  private cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: 0
  }
  private image: string;
  private currentImage;
  private data: any;
  private navParam: any;
  private secureURL:any = [];
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
    private nativeGeocoder: NativeGeocoder
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
    // this.getGeolocation();
    this.setupPage();
  }

  setupPage() {
    if (this.fromPage == 'task') {
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
    this.camera.getPicture(this.cameraOptions).then(data => {
      this.image = 'data:image/jpeg;base64,' + data;
      console.log('image:',this.image);
    }, error => console.log(error, "errorGetImage"))
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    // this.camera.getPicture(options).then((imageData) => {
    //   this.currentImage = 'data:image/jpeg;base64,' + imageData;
    // }, (err) => {
    //   console.log("Camera issue:" + err);
    // });

    this.camera.getPicture(options).then((imageData) => {
      this.sanitize.bypassSecurityTrustUrl(imageData);
      let x = decodeURIComponent(imageData);
      let name = x.substring(x.lastIndexOf('/') + 1);
       this.currentImage = [{
         name:name,
         thumbnail: this.sanitize.bypassSecurityTrustUrl(imageData),
         uri: imageData,
         type: 'image'
       }];
       console.log('this.currentImage',this.currentImage);
       this.upload();
     });
  }


  upload(){
    this.loadingProvider.presentLoading();
    this.restProvider.cloudinaryUpload(this.currentImage,'feed','proj_pic')
    .then((res) =>{
      console.log('res',res);
        for(let i=0; i < res.length; i++){
          let x = JSON.parse(res[i]);
          this.secureURL = x.secure_url;
        }
      console.log('secureURL',this.secureURL);
      // if(this.purpose == "jumaat")
      // {
      //   console.log('trigger');
      //   this.IssueReceipt();
      // }else{
      //   console.log('not trigger');
      //   this.IssueReceiptOther();
      // }
      this.loadingProvider.closeLoading();

    }).catch(error => {
      console.log('uploadError',error);
      this.loadingProvider.closeLoading();
      // const alert = this.alertCtrl.create({
      //   title: 'Cloudinary Server Error!',
      //   subTitle: 'Please try again later.',
      //   buttons: ['OK']
      // });
      // alert.present();
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
    this.restProvider.postProjectFeed(this.postForm.value,this.navParam).then((result:any) => {
      console.log('postProjectFeed',result);
      this.loadingProvider.closeLoading();
      this.exitForm();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }


  postProjectTask() {
    console.log('this.postForm.value',this.postForm.value);
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.postTaskSingle(this.postForm.value,val,this.navParam.projId).then((result:any) => {
        this.loadingProvider.closeLoading();
        this.exitForm();
      }, (err) => {
        console.log(err);
        this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    });
  }

  postTaskComment() {
    console.log('this.postForm.value',this.postForm.value);
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.postTaskComment(this.postForm.value,val).then((result:any) => {
        this.loadingProvider.closeLoading();
        this.exitForm();
      }, (err) => {
        console.log(err);
        this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    });
  }

  exitForm() {
    this.navCtrl.back();
  }

  attachGeolocation() {
    this.near()
  }

    //Get current coordinates of device
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;

      // this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
      this.latLng = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      console.log('getGeolocation',this.latLng)

    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }


  near(){
    var service = new google.maps.places.PlacesService();
    let request = {
        location : this.latLng,
        radius : '500' ,
        // types: ["restaurant"]
    };
    return new Promise((resolve,reject)=>{
        service.nearbySearch(request,function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
              for (let i = 0; i < results.length; i++) {
                let con = {
                  name : results[i].name,
                  vicinity : results[i].vicinity,
                  lat: results[i].geometry.location.lat(),
                  lng: results[i].geometry.location.lng(),
                }
                this.zone.run(() => {// to make sure UI view is updatinig
                  this.nearbyList.push(con);
                });
                console.log('nearbyList',this.nearbyList)
              }
                // resolve(results);  
                  
            }else
            {
                reject(status);
            }

        }); 
    });
  }


}
