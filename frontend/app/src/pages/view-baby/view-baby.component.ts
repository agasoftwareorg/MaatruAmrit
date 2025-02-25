import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BabyDetailsComponent } from '../baby-details/baby-details.component';

@Component({
  selector: 'app-view-baby',
  standalone: true,
  imports: [HeaderComponent, BabyDetailsComponent],
  templateUrl: './view-baby.component.html',
  styleUrl: './view-baby.component.scss'
})
export class ViewBabyComponent {

}
