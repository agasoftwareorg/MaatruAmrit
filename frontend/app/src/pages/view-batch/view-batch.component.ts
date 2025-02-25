import { Component } from '@angular/core';
import { BatchDetailsComponent } from '../batch-details/batch-details.component';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-view-batch',
  standalone: true,
  imports: [HeaderComponent, BatchDetailsComponent],
  templateUrl: './view-batch.component.html',
  styleUrl: './view-batch.component.scss'
})
export class ViewBatchComponent {

}
