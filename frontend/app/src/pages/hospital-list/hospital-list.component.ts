import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BackendService } from '../../services/backend.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-hospital-list',
  standalone: true,
  imports: [RouterLink, HeaderComponent, NgbPaginationModule],
  templateUrl: './hospital-list.component.html',
  styleUrl: './hospital-list.component.scss'
})
export class HospitalListComponent {

  page_number = 1
  page_size = 10
  hospitals: any = []
  pages: any = []

  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    this.listHospitals()
  }

  listHospitals(reset_page: boolean = true) {
    this.backend.getHospitals(this.page_number, this.page_size).subscribe({
      next: (data: any) => {
        this.hospitals = data?.results || [];
        if(reset_page){
          this.pages = []
          for (let i = 1; i <= (this.hospitals.length / this.page_size) + 1; i++) {
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

  deleteHospital(hospitalId: string) {
    this.backend.deleteHospital(hospitalId).subscribe({
      next: () => {
        this.listHospitals()
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
      this.listHospitals(false)
    }
  }

  previousPage() {
    if (this.page_number > 1) {
      this.page_number -= 1
      this.listHospitals(false)
    }
  }

  changePage(page: number) {
    if (this.page_number != page) {
      this.page_number = page
      this.listHospitals(false)
    }
  }
}
