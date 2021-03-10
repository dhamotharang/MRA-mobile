import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-volunteer-list',
  templateUrl: './volunteer-list.page.html',
  styleUrls: ['./volunteer-list.page.scss'],
})
export class VolunteerListPage implements OnInit {
  private volunteerList = [
    {volunteer_name: 'muhammad ali',volunteer_image: 'assets/volunteer.jpg',contact:'012-3456678',job:'Electrician'},
    {volunteer_name: 'muhammad ali',volunteer_image: 'assets/volunteer.jpg',contact:'012-3456678',job:'Electrician'},
    {volunteer_name: 'muhammad ali',volunteer_image: 'assets/volunteer.jpg',contact:'012-3456678',job:'Electrician'},
    {volunteer_name: 'muhammad ali',volunteer_image: 'assets/volunteer.jpg',contact:'012-3456678',job:'Electrician'}
  ]

  constructor() { }

  ngOnInit() {
  }

}
