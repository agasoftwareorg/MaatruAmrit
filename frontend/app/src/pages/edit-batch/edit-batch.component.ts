import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BatchDetailsComponent } from '../batch-details/batch-details.component';

@Component({
  selector: 'app-edit-batch',
  standalone: true,
  imports: [HeaderComponent, BatchDetailsComponent],
  templateUrl: './edit-batch.component.html',
  styleUrl: './edit-batch.component.scss'
})
export class EditBatchComponent {

}
