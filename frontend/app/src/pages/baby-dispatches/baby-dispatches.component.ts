import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import moment from 'moment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-baby-dispatches',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './baby-dispatches.component.html',
  styleUrl: './baby-dispatches.component.scss'
})
export class BabyDispatchesComponent {
  babyId: string = '';
  d_page_number = 1;
  d_page_size = 5;
  d_pages: any = [];
  dispatches: any = [];
  b_page_number = 1;
  b_page_size = 5;
  b_pages: any = [];
  batches: any = [];
  constructor(private readonly route: ActivatedRoute, private backend: BackendService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.babyId = this.route.snapshot.paramMap.get('id') || '';
    this.listDispatches()
    this.listBatches()
  }

  listDispatches(reset_page: boolean = true) {
    this.backend.getDispatches(this.babyId, this.d_page_number, this.d_page_size).subscribe({
      next: (data: any) => {
        this.dispatches = data?.results || [];
        if (reset_page) {
          this.d_pages = []
          for (let i = 1; i <= (this.dispatches.length / this.d_page_size) + 1; i++) {
            this.d_pages.push(i)
          }
        }
      },
      error: (error: any) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  createDispatch(batch: any) {
    this.backend.addDispatch(this.babyId, {
      quantity: batch.input_quantity,
      batch: batch.id,
      dispatched_at: moment(batch?.dispatched_at, 'YYYY-MM-DD HH:mm').utc(),
      child: this.babyId
    }).subscribe({
      next: () => {
        batch.input_quantity = null;
        batch.dispatched_at = moment().format('YYYY-MM-DD HH:mm');
        this.listDispatches();
        this.listBatches();
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    })
  }


  deleteDispatch(id: string) {
    this.backend.deleteDispatch(this.babyId, id).subscribe({
      next: () => {
        this.listDispatches()
        this.listBatches()
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  nextDispatchPage() {
    if (this.d_page_number < this.d_pages.length) {
      this.d_page_number += 1
      this.listDispatches(false)
    }
  }

  previousDispatchPage() {
    if (this.d_page_number > 1) {
      this.d_page_number -= 1
      this.listDispatches(false)
    }
  }

  changeDispatchPage(page: number) {
    if (this.d_page_number != page) {
      this.d_page_number = page
      this.listDispatches(false)
    }
  }

  listBatches(reset_page: boolean = true) {
    this.backend.getPureBatches(this.b_page_number, this.b_page_size).subscribe({
      next: (data: any) => {
        this.batches = data?.results || [];
        this.batches.forEach((batch: any) => {
          batch.dispatched_at = moment().format('YYYY-MM-DD HH:mm');
        });
        if (reset_page) {
          this.b_pages = []
          for (let i = 1; i <= (this.batches.length / this.b_page_size) + 1; i++) {
            this.b_pages.push(i)
          }
        }
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  nextBatchPage() {
    if (this.b_page_number < this.b_pages.length) {
      this.b_page_number += 1
      this.listBatches(false)
    }
  }

  previousBatchPage() {
    if (this.b_page_number > 1) {
      this.b_page_number -= 1
      this.listBatches(false)
    }
  }

  changeBatchPage(page: number) {
    if (this.b_page_number != page) {
      this.b_page_number = page
      this.listBatches(false)
    }
  }
}
