import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mother-donations',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './mother-donations.component.html',
  styleUrl: './mother-donations.component.scss'
})
export class MotherDonationsComponent {
  page_number = 1
  page_size = 5
  pages: any = []
  donations: any = []
  motherId: string = '';
  donationForm = new FormGroup({
    quantity: new FormControl('', [
      Validators.required,
    ]),
    donationId: new FormControl(null),
  })

  private readonly route = inject(ActivatedRoute);
  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    this.motherId = this.route.snapshot.paramMap.get('id') || '';
    this.listDonations()
  }

  createDonation() {
    this.donationForm.setErrors(null);

    let display_mapper: any = {
      quantity: 'Quantity',
    }
    if (!this.toast.validateForm(this.donationForm, display_mapper)) {
      return
    }
    let api = undefined
    let payload = {
      quantity: this.donationForm.value?.quantity,
      mother: this.motherId
    }
    if (!this.donationForm.value.donationId) {
      api = this.backend.addDonation(this.motherId, payload)
    } else {
      api = this.backend.updateDonation(this.motherId, this.donationForm.value.donationId || '', payload)
    }

    api.subscribe({
      next: () => {
        this.donationForm.reset({
          donationId: null
        })
        this.listDonations()
      },
      error: (error: any) => {
        this.toast.showError(error.error);
      }
    }
    )
  }



  listDonations(reset_page: boolean = true) {
    this.backend.getDonations(this.motherId, this.page_number, this.page_size).subscribe({
      next: (data: any) => {
        this.donations = data?.results || [];
        if (reset_page) {
          this.pages = []
          for (let i = 1; i <= (this.donations.length / this.page_size) + 1; i++) {
            this.pages.push(i)
          }
        }
      },
      error: (error: any) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  deleteDonation(id: string) {
    this.backend.deleteDonation(this.motherId, id).subscribe({
      next: () => {
        this.listDonations()
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
      this.listDonations(false)
    }
  }

  previousPage() {
    if (this.page_number > 1) {
      this.page_number -= 1
      this.listDonations(false)
    }
  }

  changePage(page: number) {
    if (this.page_number != page) {
      this.page_number = page
      this.listDonations(false)
    }
  }

  editDonation(donation: any) {
    this.donationForm.setValue({
      quantity: donation.quantity,
      donationId: donation.id
    })
  }

  resetDonation() {
    this.donationForm.reset({
      donationId: null
    })
  }
}
