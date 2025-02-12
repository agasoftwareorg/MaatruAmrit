import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MotherDetailsComponent } from '../mother-details/mother-details.component';

@Component({
  selector: 'app-edit-mother',
  standalone: true,
  imports: [HeaderComponent, MotherDetailsComponent],
  templateUrl: './edit-mother.component.html',
  styleUrl: './edit-mother.component.scss'
})
export class EditMotherComponent {

}
