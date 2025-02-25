import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MotherDetailsComponent } from '../mother-details/mother-details.component';

@Component({
  selector: 'app-view-mother',
  standalone: true,
  imports: [HeaderComponent, MotherDetailsComponent],
  templateUrl: './view-mother.component.html',
  styleUrl: './view-mother.component.scss'
})
export class ViewMotherComponent {

}
