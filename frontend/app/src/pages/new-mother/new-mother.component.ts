import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MotherDetailsComponent } from '../mother-details/mother-details.component';

@Component({
  selector: 'app-new-mother',
  standalone: true,
  imports: [HeaderComponent, MotherDetailsComponent],
  templateUrl: './new-mother.component.html',
  styleUrl: './new-mother.component.scss'
})
export class NewMotherComponent {

}
