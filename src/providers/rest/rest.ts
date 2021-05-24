import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { catchError, map } from "rxjs/operators";
// import { Observable } from 'rxjs';
import {forkJoin} from 'rxjs';
import _ from 'lodash';



@Injectable()

export class RestProvider {


    appConfheaders: any = new HttpHeaders().set('Content-Type', 'application/json');
    token: any = 'sdf2f6c2h5g333431293813113126528162203526172114910252443223363773918181930INTERNAL';


    constructor(
        public http: HttpClient,
        // public HTTP: HTTP,
        public transfer: FileTransfer,
        private file: File,
    ) {
    }

    appConf(app) {
        return new Promise((resolve, reject) => {
            let devplink = 'http://192.168.0.161:8181/hss-start-0.0.1-SNAPSHOT/app/config/r';  //192.168.0.5 //192.168.43.221  //dev.hss.oas.my
            this.http.post(devplink, [app], {
                headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token)//.set('api-key','eIsyynm35y3j5dDTp2RGyS1QR1gxYvSYPZB2MBHpnZUa5BeEs6Xl97cFx0004P4cWhoa12ceefOWMZ7CAJv9l30pUTpqSq9cj0mP3emB5Z7pWGGK8M0LO8fmO962h52O')
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

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT//proj/feed/s/{personId}
  async getAllProjectFeed(personId){
    try{
      let app = await this.appConf("PRJM");
    console.log(app);
    return new Promise((resolve, reject) => {
      this.http.get(app[0].host+app[0].contextPath+"/proj/feed/s/"+personId,{headers: new HttpHeaders().set('token', this.token)
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

    //hss-project-0.0.1-SNAPSHOT/proj/comm/s/{personId}
    async getStaffProjectList(personId){
      try{
        let app = await this.appConf("PRJL");
      console.log(app);
      return new Promise((resolve, reject) => {
        this.http.get(app[0].host+app[0].contextPath+"/proj/comm/s/"+personId,{headers: new HttpHeaders().set('token', this.token)
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


  //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/vol/join
  async requestJoin(personId,detail){
    try{
      let app = await this.appConf("PRJM");
    console.log('requestJoin',detail);
    return new Promise((resolve, reject) => {
        let data = {
            projId:detail,
            personId:personId,
            enabled:'Y',
            createdDate: new Date(),
            voidStatus: "A",
            joinStatus: "R"
          };
          this.http.post(app[0].host+app[0].contextPath+"/proj/vol/join", JSON.stringify(data),{
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

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/vol/join
    async attendProject(personId,detail){
      try{
        let app = await this.appConf("PRJM");
      console.log('requestJoin',detail);
      return new Promise((resolve, reject) => {
          let data = {
              projId:detail,
              personId:personId,
              enabled:'Y',
              createdDate: new Date(),
              voidStatus: "A",
              joinStatus: "Q"
            };
            this.http.post(app[0].host+app[0].contextPath+"/proj/vol/join", JSON.stringify(data),{
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


  //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/vol/s/{personId}
  async getProjectInvolvedList(personId){
    try{
      let app = await this.appConf("PRJL");
    console.log(app);
    return new Promise((resolve, reject) => {
      this.http.get(app[0].host+app[0].contextPath+"/proj/vol/s/"+personId,{headers: new HttpHeaders().set('token', this.token)
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
    async postProjectFeed(form,detail,personId){
        try{
          let app = await this.appConf("PRJM");
        console.log(app);
        return new Promise((resolve, reject) => {
          console.log('form',form)
            let data = {
                projId:detail.projId,
                personId:personId,
                enabled:'Y',
                feedName:form.formName,
                createdDate: new Date()
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

    //http://localhost:8181/hss-project-0.0.1-SNAPSHO/proj/task/k/v/{taskId}
    async getTasksCommentList(taskId){
      try{
        let app = await this.appConf("PRJM");
      console.log(app);
      return new Promise((resolve, reject) => {
        this.http.get(app[0].host+app[0].contextPath+"/proj/task/k/v/"+taskId,{headers: new HttpHeaders().set('token', this.token)
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


    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/task/u
    async postTaskSingle(form,personId,projId){ //post task without participant
      try{
        let app = await this.appConf("PRJM");
      console.log(app);
      return new Promise((resolve, reject) => {
        console.log('form',form)
            let data = {
              personId:personId,
              description:form.description,
              startDate:form.startDate,
              dueDate:form.dueDate,
              status:form.status,
              taskClose:'A',
              taskName:form.taskName,
              enabled:'Y',
              projId:projId
            }
            this.http.post(app[0].host+app[0].contextPath+"/proj/task/u", JSON.stringify(data),{
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

  //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/task/u
    async addParticipantTask(data){ //post task with participants
      try{
        let app = await this.appConf("PRJM");
      console.log(app);
      return new Promise((resolve, reject) => {
            this.http.post(app[0].host+app[0].contextPath+"/proj/task/com/u", JSON.stringify(data),{
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

  //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/task/k/u
  async postTaskComment(form,personId){
    try{
      let app = await this.appConf("PRJM");
    console.log(app);
    return new Promise((resolve, reject) => {
      console.log('form',form)
          let data = {
            taskId:form.taskId,
            taskComment:form.taskComment,
            taskPicture:form.taskPicture,
            personId:personId
          }
          this.http.post(app[0].host+app[0].contextPath+"/proj/task/k/u", JSON.stringify(data),{
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


    //http://localhost:8181/hss-organization-member-0.0.1-SNAPSHOT/sm/person/type/org/r/{typename}/{orgId}
    async getAllVolunteerList(typename,orgId){ //all registered volunteer
      try{
        let app = await this.appConf("OMEM");
      console.log(app);
      return new Promise((resolve, reject) => {
        this.http.get(app[0].host+app[0].contextPath+"/sm/person/type/org/r/"+typename+"/"+orgId,{headers: new HttpHeaders().set('token', this.token)
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
    async getVolunteerList(projId){ //volunteer list in a project
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


  //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/vol/u
  async addVolunteer(data){  //add volunteer to a project
    try{
      let app = await this.appConf("PRJM");
    return new Promise((resolve, reject) => {
          this.http.post(app[0].host+app[0].contextPath+"/proj/vol/u", JSON.stringify(data),{
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

  //Rest for Feedback page
  async createFeedback(data){
    try {
      let app = await this.appConf("MCFL");
    console.log(app);
    return new Promise((resolve, reject) => {
      this.http.post(app[0].host+app[0].url, JSON.stringify(data),{
        headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token)
        .set('api-key', app[0].apiKey)
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

   async deleteHosting(acid){
    try{
      let app = await this.appConf("MCAN");
    return new Promise((resolve, reject) => {
      this.http.get(app[0].host+app[0].contextPath+"/delete/hosted/event/"+acid,{headers: new HttpHeaders().set('token', this.token)
      .set('api-key', app[0].apiKey)
      }).subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    }
    catch(e){
      console.log(e);
    }

  }
  //user-account page
  async updateRSVP(eiId,status){
    try{
      let app = await this.appConf("MCAN");
    console.log(app);
    return new Promise((resolve, reject) => {
      this.http.get(app[0].host+app[0].contextPath+"/rsvp/update/"+eiId+"/"+status,{headers: new HttpHeaders().set('token', this.token)
      .set('api-key', app[0].apiKey)
      }).subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    }
    catch(e){
      console.log(e);
    }

  }

//user-account page
  async createAnnouncement(data){
    console.log(data);
    try{
      let app = await this.appConf("MCAN");
    return new Promise((resolve, reject) => {
      this.http.post(app[0].host+app[0].contextPath+'/list/an/add', data,{headers: new HttpHeaders().set('enctype', 'multipart/form-data').set('Accept','application/json').set('token', this.token)
      .set('api-key', app[0].apiKey)
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    }
    catch(e){
      console.log(e);
    }

  }


  //user-account page
  async getOrg(oaId){
    try {
      let app = await this.appConf("MBOR");
    return new Promise((resolve,reject) => {
      this.http.get(app[0].host+app[0].url+"/"+ oaId,{headers: new HttpHeaders().set('token', this.token)
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
  //user-account page
  async getUserAnnouncement(oaid,counter){
    try{
      let app = await this.appConf("MCAN");
    console.log(app);
    return new Promise((resolve, reject) => {
      this.http.get(app[0].host+app[0].contextPath+"/list/an/user/"+oaid+'/page?start='+counter,{headers: new HttpHeaders().set('token', this.token)
      .set('api-key', app[0].apiKey)
      }).subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
    }
    catch(e){
      console.log(e);
    }

  }



    //http://localhost:8181/hss-organization-admin-0.0.1-SNAPSHOT/gallery/c
    //https://res.cloudinary.com/myjiran/image/upload/v1614407863/proj_pic/apmdiyr3pbtx9mjwqhov.png
    //http://192.168.43.221:8181/0.0.1-SNAPSHOT/myjiran
    async cloudinaryUpload(data,tag,folder):Promise<any>{
      try {
        let app = await this.appConf("SOLO");
        var returnData = [];
        var l = data.length;
        for(let i=0; i< data.length;i++) {
          if(data[i].type == 'pdf' || data[i].type == undefined){
            var url = app[0].host+"/"+app[0].version+"/myjiran/auto/upload";
          }else{
            var url = app[0].host+"/"+app[0].version+"/"+"myjiran/"+ data[i].type +'/upload';
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

    async updateProfile(data){     //guna untuk submit data
      try {
        let app = await this.appConf("MUPR");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.put(app[0].host+app[0].url, JSON.stringify(data),{
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
    async getEmergencyList(personid){
      try {
        let app = await this.appConf("GSEC");
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].url+"/"+personid,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          }).subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
      } catch (error) {
        console.log(error);
      }
    }




//----------------------------------------- mobile myjiran rest ------------------------------------


async checkRole(personId, id){
  try {
    let app = await this.appConf("MGRA");
    console.log(app);
    return new Promise((resolve, reject) => {
      this.http.get(app[0].host+app[0].url +"/"+ personId +"/"+ id,{headers: new HttpHeaders().set('token', this.token)
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

// async checkRole(personId){
//   try {
//     let app = await this.appConf("MGRA");
//     console.log(app);
//     return new Promise((resolve, reject) => {
//       let ids = ["1","3","4","5","9"];
//       var urlList = [];
//       // for(let i=0; i < ids.length; i++){
//       //   let url = this.http.get(app[0].host+app[0].url +"/"+ personId +"/"+ ids[i])
//       //   .pipe(map((response: any) => response));
//       //   urlList.push(url);
//       // }
//       // forkJoin(urlList).subscribe((val:any) => {
//       //   console.log('rest.ts: '+val);
//       //   resolve(val);
//       // });

//       for(let i=0; i < ids.length; i++){
//         let url = this.http.get(app[0].host+app[0].url +"/"+ personId +"/"+ ids[i],{headers: new HttpHeaders().set('token', this.token)
//         .set('api-key', app[0].apiKey)})
//         .pipe(map((response: any) => response));
//         urlList.push(url);
//       }
//       return forkJoin(urlList);

//     });
//   } catch (error) {
//     console.log(error);
//   }

// }


//http://localhost:8181/hss-mobile-rest-0.0.1-SNAPSHOT/annoucement/v/{personId}
async getListNoti(personId){
  try {
    let app = await this.appConf("MGAN");
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




//Token/u{orgId}
async getTokenNoti(orgId){
  try {
    let app = await this.appConf("MBTK");
    console.log(app);
    return new Promise((resolve, reject) => {
      this.http.get(app[0].host+app[0].url +"/"+ orgId,{headers: new HttpHeaders().set('token', this.token)
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

sendPush(list,personId) {
  var urlList = [];
  console.log(list);
  console.log(personId);
  for(let i=0; i < list.length; i++){
    let r = Math.floor(Math.random() * 100);     // returns a random integer from 0 to 99
    let n = personId + r; //to produce unique id, so notification is stacking
    // list[i].data.notId = n;
    let url = this.http.post('https://fcm.googleapis.com/fcm/send', JSON.stringify(list[i]),{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', 'key=AAAAhY8Iny4:APA91bF4KHWiYS2trL-hiLzqO0GiBDvJ1UvFy48ii_jWAnphHs_NBdVkVEHwm-s2R3yI_QIJn02KAbSwo-k2RifBVbpP8m63HJkryJK20rltM4JzlagUJvadt9i0_vVdZka4loaWy8BL')
    })
    .pipe(map((response: any) => response));
    urlList.push(url);
  }
  return forkJoin(urlList);
}


async getUserDonation(personId){
  try{
    let app = await this.appConf("OFEE");
  console.log(app);
  return new Promise((resolve, reject) => {
    this.http.get(app[0].host+app[0].contextPath+"/org/donate/oa/r/"+personId,{headers: new HttpHeaders().set('token', this.token)
    .set('api-key', app[0].apiKey)
    })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
  }
  catch(e)
  {
    console.log(e);
  }

}

///proj/vol/upd
async acceptJoin(data){
  try{
    let app = await this.appConf("PRJM");
  console.log('requestJoin',data);
  return new Promise((resolve, reject) => {

        this.http.post(app[0].host+app[0].contextPath+"/proj/vol/upd", JSON.stringify(data),{
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

async getBank(){
  try {
    let app = await this.appConf("COLN");
  console.log(app);
  return new Promise((resolve, reject) => {
    this.http.get(app[0].host+app[0].url +"/b/"+ 320,{headers: new HttpHeaders().set('token', this.token)
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
async getContactCounter(orgid,counter){
  try {
    let app = await this.appConf("GECL");
  return new Promise((resolve, reject) => {
    this.http.get(app[0].host+app[0].url+"/"+orgid+'?start='+counter,{headers: new HttpHeaders().set('token', this.token)
    .set('api-key', app[0].apiKey)
    }).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
  } catch (error) {
    console.log(error);
  }

}

async createEmergencyContact(data){
  try {
    let app = await this.appConf("CECL");
  return new Promise((resolve, reject) => {
    this.http.post(app[0].host+app[0].url, JSON.stringify(data),{
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('token',this.token).set('api-key', app[0].apiKey)
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

async deleteEmergency(smecId){
  try {
    let app = await this.appConf("MDEC");
  return new Promise((resolve, reject) => {
    this.http.delete(app[0].host+app[0].url+"/"+smecId,{headers: new HttpHeaders()
      .set('token', this.token)
      .set('api-key', app[0].apiKey)
    }).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
  } catch (error) {
    console.log(error);
  }

}


}

