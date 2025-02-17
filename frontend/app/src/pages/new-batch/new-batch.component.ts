import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BatchDetailsComponent } from '../batch-details/batch-details.component';

@Component({
  selector: 'app-new-batch',
  standalone: true,
  imports: [HeaderComponent, BatchDetailsComponent],
  templateUrl: './new-batch.component.html',
  styleUrl: './new-batch.component.scss'
})
export class NewBatchComponent {

}
