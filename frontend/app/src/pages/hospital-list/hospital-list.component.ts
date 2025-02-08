import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layouts/header/header.component';


@Component({
  selector: 'app-hospital-list',
  standalone: true,
  imports: [RouterLink, HeaderComponent],
  templateUrl: './hospital-list.component.html',
  styleUrl: './hospital-list.component.scss'
})
export class HospitalListComponent {

  page_number = 1
  page_size = 10
  collectionSize = 100
  hospitals = [1,2,3,4,5,6,7,8,9,10]
}
