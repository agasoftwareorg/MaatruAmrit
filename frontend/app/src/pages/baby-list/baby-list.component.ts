import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BackendService } from '../../services/backend.service';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { NillPipe } from '../../services/nill.pipe';
import { BarcodeService } from '../../services/barcode.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DeleteModalComponent } from '../../layouts/delete-modal/delete-modal.component';

@Component({
  selector: 'app-baby-list',
  standalone: true,
  imports: [RouterLink, HeaderComponent, NgbPaginationModule, NillPipe, AsyncPipe],
  templateUrl: './baby-list.component.html',
  styleUrl: './baby-list.component.scss'
})
export class BabyListComponent {
  isHospitalAdmin$!: Observable<boolean>;
  page_number = 1
  page_size = 10
  babies: any = []
  pages: any = []
  modalService = inject(NgbModal)

  constructor(private backend: BackendService, private toast: ToastService, private barcode: BarcodeService) { }

  ngOnInit() {
    this.isHospitalAdmin$ = this.backend.isHospitalAdmin();
    this.listBabies();
  }

  listBabies(reset_page: boolean = true) {
    this.backend.getBabies(this.page_number, this.page_size).subscribe({
      next: (data: any) => {
        this.babies = data?.results || [];
        if (reset_page) {
          this.pages = []
          for (let i = 1; i <= (this.babies.length / this.page_size) + 1; i++) {
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
      () => this.deleteBaby(id)
    );
  }
  
  deleteBaby(id: string) {
    this.backend.deleteBaby(id).subscribe({
      next: () => {
        this.listBabies()
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
      this.listBabies(false)
    }
  }

  previousPage() {
    if (this.page_number > 1) {
      this.page_number -= 1
      this.listBabies(false)
    }
  }

  changePage(page: number) {
    if (this.page_number != page) {
      this.page_number = page
      this.listBabies(false)
    }
  }

  printBarcode(reg_number: string) {
    this.barcode.printBarcode(reg_number)
  }
}
