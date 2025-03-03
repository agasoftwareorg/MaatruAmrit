import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BackendService } from '../../services/backend.service';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReplacePipe } from '../../services/replace.pipe';
import { NillPipe } from '../../services/nill.pipe';
import { BarcodeService } from '../../services/barcode.service';
import { Observable } from 'rxjs';
import { DeleteModalComponent } from '../../layouts/delete-modal/delete-modal.component';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [RouterLink, HeaderComponent, NgbPaginationModule, CommonModule, ReplacePipe, NillPipe, AsyncPipe],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss'
})
export class BatchListComponent {

  isHospitalAdmin$!: Observable<boolean>;
  page_number = 1
  page_size = 10
  batches: any = []
  pages: any = []
  modalService = inject(NgbModal)

  constructor(private backend: BackendService, private toast: ToastService, private barcode: BarcodeService) { }

  ngOnInit() {
    this.isHospitalAdmin$ = this.backend.isHospitalAdmin();
    this.listBatches();
  }

  createBatch(){
    this.backend.addBatch({
      available_quantity: 0,
      name: Math.round(Math.random() * 10000)
    }).subscribe({
      next: () => {
        this.listBatches();
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    })
  }

  listBatches(reset_page: boolean = true) {
    this.backend.getBatches(this.page_number, this.page_size).subscribe({
      next: (data: any) => {
        this.batches = data?.results || [];
        if (reset_page) {
          this.pages = []
          for (let i = 1; i <= (this.batches.length / this.page_size) + 1; i++) {
            this.pages.push(i)
          }
        }
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  deleteModal(id: string) {
    this.modalService.open(DeleteModalComponent, { size: 'lg' }).result.then(
      () => this.deleteBatch(id)
    );
  }
  
  deleteBatch(id: string) {
    this.backend.deleteBatch(id).subscribe({
      next: () => {
        this.listBatches()
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  nextPage() {
    if (this.page_number < this.pages.length) {
      this.page_number += 1
      this.listBatches(false)
    }
  }

  previousPage() {
    if (this.page_number > 1) {
      this.page_number -= 1
      this.listBatches(false)
    }
  }

  changePage(page: number) {
    if (this.page_number != page) {
      this.page_number = page
      this.listBatches(false)
    }
  }

  printBarcode(reg_number: string) {
    this.barcode.printBarcode(reg_number)
  }
}
