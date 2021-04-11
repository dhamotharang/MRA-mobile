import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable()
export class RestProvider {
  getToken(arg0: number, oaid: any) {
    throw new Error('Method not implemented.');
  }
  createFeedback(restParam: any) {
    throw new Error('Method not implemented.');
  }
    getTaskList(arg0: number) {
      throw new Error('Method not implemented.');
    }

    appConfheaders: any = new HttpHeaders().set('Content-Type', 'application/json');
    token: any = 'sdf2f6c2h5g333431293813113126528162203526172114910252443223363773918181930INTERNAL';

    constructor(
        public http: HttpClient,
        public transfer: FileTransfer, 
        private file: File,
    ) {
    }

    appConf(app) {
        return new Promise((resolve, reject) => {
            let devplink = 'http://192.168.1.111:8181/hss-start-0.0.1-SNAPSHOT/app/config/r';  //192.168.0.5 //192.168.43.221
            // let devplink = 'https://www.myjiran.my/myjiran-oas-admin-0.0.1-SNAPSHOT/app/config/r'; 
            this.http.post(devplink, [app], {
                headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token)
            })
                .subscribe((res: any) => {
                    resolve(res);
                }, (err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }


    async getProfile(data) {
      try {
        let app = await this.appConf("MGPR");
        return new Promise((resolve, reject) => {
          this.http.post(app[0].host+app[0].url, JSON.stringify(data),{
            headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token).set('api-key',app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
      } catch (error) {
        console.log(error);
      }
  
    }

    async getFee(personId){
      try {
        let app = await this.appConf("MBFT");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].url +"/"+ personId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          }).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
            reject(err);
          });
        });
      } catch (error) {
        console.log(error);
      }
  
    }

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/project/v/320
    async getProjectList(orgId){
        try{
          let app = await this.appConf("PRJL");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/project/v/"+orgId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }


  //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/vol/u
  async requestJoin(form,detail){
    try{
      let app = await this.appConf("PRJM");
    console.log(app);
    return new Promise((resolve, reject) => {
      console.log('form',form)
        let data = {
            projId:detail.projId,
            personId:75187,//personId,
            enabled:'Y',
            feedName:form.formName,
            createdDate: moment().format()
          };
          this.http.post(app[0].host+app[0].contextPath+"/proj/feed/u", JSON.stringify(data),{
            headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token).set('api-key', app[0].apiKey)
          })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    }catch(e){
      console.log(e);
    }

  }


  //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/vol/r/{personId}
  async getProjectInvolvedList(personId){
    try{
      let app = await this.appConf("PRJL");
    console.log(app);
    return new Promise((resolve, reject) => {
      this.http.get(app[0].host+app[0].contextPath+"/proj/vol/r/"+personId,{headers: new HttpHeaders().set('token', this.token)
      .set('api-key', app[0].apiKey)
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    }catch(e){
      console.log(e);
    }
  }


    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/det/v/{projId}
    async getProjectDetail(projId){
        try{
          let app = await this.appConf("PRJL");   //no need shortName
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/det/v/"+projId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/feed/v/{projId}
    async getProjectFeed(projId){
        try{
          let app = await this.appConf("PRJM");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/feed/v/"+projId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }


    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/feed/u
    async postProjectFeed(form,detail){
        try{
          let app = await this.appConf("PRJM");
        console.log(app);
        return new Promise((resolve, reject) => {
          console.log('form',form)
            let data = {
                projId:detail.projId,
                personId:75187,//personId,
                enabled:'Y',
                feedName:form.formName,
                createdDate: moment().format()
              };
              this.http.post(app[0].host+app[0].contextPath+"/proj/feed/u", JSON.stringify(data),{
                headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token).set('api-key', app[0].apiKey)
              })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }
    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/task/v/{projId}
    async getTasksList(projId){
        try{
          let app = await this.appConf("PRJM");   
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/task/v/"+projId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }
      
      //http://localhost:8181/hss-organization-admin-0.0.1-SNAPSHOT/gallery/r
      async getLiveFeed(){
        try{
          let app = await this.appConf("GLMG");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/gallery/r",{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }


    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/vol/v/{projId}
    async getVolunteerList(projId){
      try{
        let app = await this.appConf("PRJM");
      console.log(app);
      return new Promise((resolve, reject) => {
        this.http.get(app[0].host+app[0].contextPath+"/proj/vol/v/"+projId,{headers: new HttpHeaders().set('token', this.token)
        .set('api-key', app[0].apiKey)
        })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
      }catch(e){
        console.log(e);
      }
  
  }    


    //http://localhost:8181/hss-organization-admin-0.0.1-SNAPSHOT/gallery/c
    //https://res.cloudinary.com/myjiran/image/upload/v1614407863/proj_pic/apmdiyr3pbtx9mjwqhov.png
    //http://192.168.43.221:8181/0.0.1-SNAPSHOT/myjiran
    async cloudinaryUpload(data,tag,folder):Promise<any>{
      try {
        let app = await this.appConf("GLMG");
        var returnData = [];
        var l = data.length;
        for(let i=0; i< data.length;i++) {
          if(data[i].type == 'pdf' || data[i].type == undefined){
            var url = "https://res.cloudinary.com"+"/myjiran/image/upload";
          }else{
            var url = "https://res.cloudinary.com"+"/"+"myjiran/"+ data[i].type +'/upload';
          }
          let result = await this.cloud_upload(data[i].uri,url,tag,folder);
          console.log('No issues, I will wait until promise is resolved..');
          console.log('await finish  '+ result);
          returnData.push(result);
          console.log(returnData);
        };
        return(returnData);
      } catch (error) {
        console.log(error);
      }
  
    }
  
    cloud_upload(uri,url,tag,folder): Promise<any>{
      return new Promise((resolve,reject) => {
        const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
          params : {
            'upload_preset': 'c4gf0qoq',
            'tags': tag,
            'folder': folder,
          }
        }
        fileTransfer.upload(uri, url, options).then(data => {
          console.log("await process = "+ data.response);
          resolve(data.response);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
      });
    }
     


}
 