import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-volunteer',
  templateUrl: './add-volunteer.page.html',
  styleUrls: ['./add-volunteer.page.scss'],
})
export class AddVolunteerPage implements OnInit {
  private volunteerInfoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.volunteerInfoForm = this.formBuilder.group({
      full_name: [],
      nric: [],
      address_unit_no: [],
      address_street_name_01: [],
      address_postcode: [],
      address_city: [],    
      address_state: [],   
      skills: [],
      other_skills: [],    
      interest: [],    
    });
  }

}
