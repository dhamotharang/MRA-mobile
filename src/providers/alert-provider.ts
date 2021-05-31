import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable()
export class AlertProvider {

    constructor(
    ) {
    }

    successAlert() {
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
    }

    successAlertParam(title, text) {
        Swal.fire({
          title: title,
          text: text,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
    }

    errorAlert() {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
    }

    errorAlertParam(title,text) {
        Swal.fire({
          title: title,
          text: text,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
    }


}