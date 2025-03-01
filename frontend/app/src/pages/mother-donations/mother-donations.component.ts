import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import moment from 'moment';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-mother-donations',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule, RouterLink, AsyncPipe],
  templateUrl: './mother-donations.component.html',
  styleUrl: './mother-donations.component.scss'
})
export class MotherDonationsComponent {

  isHospitalAdmin$!: Observable<boolean>;
  page_number = 1
  page_size = 5
  pages: any = []
  donations: any = []
  motherId: string = '';
  donationForm = new FormGroup({
    quantity: new FormControl(null, [
      Validators.required,
    ]),
    donatedAt: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [
      Validators.required,
    ]),
    donationId: new FormControl(null),
    disableSubmit: new FormControl(false, [
      Validators.required,
    ]),
  })

  private readonly route = inject(ActivatedRoute);
  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    this.motherId = this.route.snapshot.paramMap.get('id') || '';
    this.listDonations();
    this.isHospitalAdmin$ = this.backend.isHospitalAdmin();
  }

  createDonation() {
    this.donationForm.controls.disableSubmit.setValue(true);
    this.donationForm.setErrors(null);

    let display_mapper: any = {
      quantity: 'Quantity',
      donatedAt: 'Donated At'
    }
    if (!this.toast.validateForm(this.donationForm, display_mapper)) {
      this.donationForm.controls.disableSubmit.setValue(false);
      return
    }
    let api = undefined
    let payload = {
      quantity: this.donationForm.value.quantity,
      donated_at: moment(this.donationForm.value.donatedAt, 'YYYY-MM-DD HH:mm').utc(),
      mother: this.motherId
    }
    if (!this.donationForm.value.donationId) {
      api = this.backend.addDonation(this.motherId, payload)
    } else {
      api = this.backend.updateDonation(this.motherId, this.donationForm.value.donationId || '', payload)
    }

    api.pipe(
      finalize(() => {
        this.donationForm.controls.disableSubmit.setValue(false);
      })
    ).subscribe({
      next: () => {
        this.donationForm.reset({
          donationId: null,
          donatedAt: moment().format('YYYY-MM-DD HH:mm')
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
    let donatedAt = moment(donation.donated_at, 'YYYY-MM-DDTHH:mm:ssZ')
    this.donationForm.setValue({
      quantity: donation.quantity,
      donationId: donation.id,
      donatedAt: donatedAt.format('YYYY-MM-DD HH:mm'),
      disableSubmit: false
    })
  }

  resetDonation() {
    this.donationForm.reset({
      donationId: null,
      donatedAt: moment().format('YYYY-MM-DD HH:mm')
    })
  }
}
