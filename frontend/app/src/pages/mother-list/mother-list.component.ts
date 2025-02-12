import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BackendService } from '../../services/backend.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-mother-list',
  standalone: true,
  imports: [RouterLink, HeaderComponent, NgbPaginationModule],
  templateUrl: './mother-list.component.html',
  styleUrl: './mother-list.component.scss'
})
export class MotherListComponent {
  page_number = 1
  page_size = 10
  mothers: any = []
  pages: any = []

  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    this.listMothers()
  }

  listMothers(reset_page: boolean = true) {
    this.backend.getMothers(this.page_number, this.page_size).subscribe({
      next: (data: any) => {
        this.mothers = data?.results || [];
        if (reset_page) {
          this.pages = []
          for (let i = 1; i <= (this.mothers.length / this.page_size) + 1; i++) {
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

  deleteMother(id: string) {
    this.backend.deleteHospital(id).subscribe({
      next: () => {
        this.listMothers()
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
      this.listMothers(false)
    }
  }

  previousPage() {
    if (this.page_number > 1) {
      this.page_number -= 1
      this.listMothers(false)
    }
  }

  changePage(page: number) {
    if (this.page_number != page) {
      this.page_number = page
      this.listMothers(false)
    }
  }
}
