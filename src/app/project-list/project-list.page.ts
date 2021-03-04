import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {
  projectList = [
    {project_name: 'Third Wave Covid-19 Emergency',project_image: 'assets/covid-img.jpg'},
    {project_name: 'Gaza Winter Warming Aid',project_image: 'assets/gaza-img.jpg'}
  ]

  constructor(

  ) { }

  ngOnInit() {
  }

}
