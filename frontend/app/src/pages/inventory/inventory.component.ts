import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  
  milkReady = 'nill'
  milkAwaiting = 'nill'
  constructor(private backend: BackendService, private toast: ToastService) { }
  
  ngOnInit() {
    this.listMothers();
  }

  listMothers(reset_page: boolean = true) {
    this.backend.getCurrentInventory().subscribe({
      next: (data: any) => {
        this.milkReady = data?.milk_ready_to_use;
        this.milkAwaiting = data?.milk_awaiting_results;
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }
}
