import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { HospitalDetailsComponent } from '../hospital-details/hospital-details.component';

@Component({
  selector: 'app-edit-hospital',
  standalone: true,
  imports: [HeaderComponent, HospitalDetailsComponent],
  templateUrl: './edit-hospital.component.html',
  styleUrl: './edit-hospital.component.scss'
})
export class EditHospitalComponent {

}
