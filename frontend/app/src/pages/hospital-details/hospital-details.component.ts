import { Component, Input, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-hospital-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './hospital-details.component.html',
  styleUrl: './hospital-details.component.scss'
})
export class HospitalDetailsComponent {

  @Input() type: string = 'NEW';

  hospitalId: string = ''
  hospitalForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    address: new FormControl('', [
      Validators.required,
    ]),
    branch: new FormControl('', [
      Validators.required,
    ]),
    contact: new FormControl('', [
      Validators.required,
    ]),
    subscription: new FormControl('PLAN_1_YEAR', [
      Validators.required
    ]),
    isAnalyzer: new FormControl(false, [
      Validators.required
    ])
  })

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    let hospitalId = this.route.snapshot.paramMap.get('id');
    if (this.type == "EDIT" && hospitalId) {
      this.hospitalId = hospitalId
      this.backend.getHospitalById(this.hospitalId).subscribe({
        next: (data: any) => {
          this.hospitalForm.setValue({
            name: data.name,
            address: data.address,
            branch: data.branch,
            contact: data.contact,
            subscription: data.subscription,
            isAnalyzer: data.is_analyzer
          })
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      })

    }
  }

  createHospital() {
    this.hospitalForm.setErrors(null);
    let display_mapper: any = {
      name: 'Hospital name',
      address: 'Address',
      branch: 'Branch',
      contact: 'Contact',
      isAnalyzer: 'Analyzer',
      subscription: 'Subscription'
    }
    if (!this.toast.validateForm(this.hospitalForm, display_mapper)) {
      return
    }

    let api = undefined
    let payload = {
      name: this.hospitalForm.value?.name,
      address: this.hospitalForm.value?.address,
      branch: this.hospitalForm.value?.branch,
      contact: this.hospitalForm.value?.contact,
      subscription: this.hospitalForm.value?.subscription,
      is_analyzer: this.hospitalForm.value?.isAnalyzer,
    }
    if (this.type == "NEW") {
      api = this.backend.addHospital(payload)
    } else {
      api = this.backend.updateHospital(this.hospitalId, payload)
    }

    api.subscribe({
      next: () => {
        this.router.navigate(['hospital'])
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )

  }
}
