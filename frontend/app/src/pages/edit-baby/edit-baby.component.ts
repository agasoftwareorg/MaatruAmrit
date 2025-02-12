import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BabyDetailsComponent } from '../baby-details/baby-details.component';

@Component({
  selector: 'app-edit-baby',
  standalone: true,
  imports: [HeaderComponent, BabyDetailsComponent],
  templateUrl: './edit-baby.component.html',
  styleUrl: './edit-baby.component.scss'
})
export class EditBabyComponent {

}
