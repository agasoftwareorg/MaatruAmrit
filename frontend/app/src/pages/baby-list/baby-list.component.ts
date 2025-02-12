import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BackendService } from '../../services/backend.service';
import { RouterLink } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-baby-list',
  standalone: true,
  imports: [RouterLink, HeaderComponent, NgbPaginationModule],
  templateUrl: './baby-list.component.html',
  styleUrl: './baby-list.component.scss'
})
export class BabyListComponent {
  page_number = 1
  page_size = 10
  babies: any = []
  pages: any = []

  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    this.listBabies()
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
}
