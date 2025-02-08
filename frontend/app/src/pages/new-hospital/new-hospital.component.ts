import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layouts/header/header.component';


@Component({
  selector: 'app-new-hospital',
  standalone: true,
  imports: [RouterLink, HeaderComponent],
  templateUrl: './new-hospital.component.html',
  styleUrl: './new-hospital.component.scss'
})
export class NewHospitalComponent {

}
