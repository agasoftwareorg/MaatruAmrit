import { Component } from '@angular/core';

import { HeaderComponent } from '../../layouts/header/header.component';
import { HospitalDetailsComponent } from '../hospital-details/hospital-details.component';


@Component({
  selector: 'app-new-hospital',
  standalone: true,
  imports: [HeaderComponent, HospitalDetailsComponent],
  templateUrl: './new-hospital.component.html',
  styleUrl: './new-hospital.component.scss'
})
export class NewHospitalComponent {

}
