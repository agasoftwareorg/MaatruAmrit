import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BabyDetailsComponent } from '../baby-details/baby-details.component';

@Component({
  selector: 'app-new-baby',
  standalone: true,
  imports: [HeaderComponent, BabyDetailsComponent],
  templateUrl: './new-baby.component.html',
  styleUrl: './new-baby.component.scss'
})
export class NewBabyComponent {

}
