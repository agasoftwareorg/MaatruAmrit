import moment from 'moment';
import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-mother-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mother-details.component.html',
  styleUrl: './mother-details.component.scss'
})
export class MotherDetailsComponent {

  @Input() type: string = 'NEW';

  motherId: string = ''
  motherForm = new FormGroup({
    regNumber: new FormControl('', [
      Validators.required,
    ]),
    regDate: new FormControl(moment().format('YYYY-MM-DD'), [
      Validators.required,
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    age: new FormControl('', [
      Validators.required,
    ]),
    height: new FormControl('', [
      Validators.required,
    ]),
    weight: new FormControl('', [
      Validators.required,
    ]),
    education: new FormControl(null, [
    ]),
    deliveryDate: new FormControl('', [
      Validators.required,
    ]),
    deliveryMode: new FormControl('', [
      Validators.required,
    ]),
    relativeName: new FormControl('', [
      Validators.required,
    ]),
    relativeType: new FormControl('', [
      Validators.required,
    ]),
    relativeContact: new FormControl('', [
      Validators.required,
    ]),
    relativeEmail: new FormControl(null, [
    ]),
    relativeAddress: new FormControl(null, [
    ]),
    medicalIssues: new FormControl(null, [
    ]),
    surgicalIssues: new FormControl(null, [
    ]),
  })

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    let motherId = this.route.snapshot.paramMap.get('id');
    if (this.type == "EDIT" && motherId) {
      this.motherId = motherId
      this.backend.getMotherById(this.motherId).subscribe({
        next: (data: any) => {
          this.motherForm.setValue({
            name: data.name,
            age: data.age,
            height: data.height,
            weight: data.weight,
            education: data.education,
            regNumber: data.reg_number,
            regDate: data.reg_date,
            deliveryMode: data.delivery_mode,
            deliveryDate: data.delivery_date,
            relativeName: data.relative_name,
            relativeAddress: data.relative_address,
            relativeContact: data.relative_contact,
            relativeEmail: data.relative_email,
            relativeType: data.relative_type,
            surgicalIssues: data.surgical_issues,
            medicalIssues: data.medical_issues,
          })
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      })

    }
  }

  createMother() {
    this.motherForm.setErrors(null);

    let display_mapper: any = {
      name: 'Mother name',
      age: 'Age',
      height: 'Height',
      weight: 'Weight',
      education: 'Education',
      regNumber: 'Registration Number',
      regDate: 'Registration Date',
      deliveryMode: 'Delivery Mode',
      deliveryDate: 'Delivery Date',
      relativeName: 'Relative Name',
      relativeAddress: 'Relative Address',
      relativeContact: 'Relative Contact',
      relativeEmail: 'Relative Email',
      relativeType: 'Relative Type',
      surgicalIssues:  'Surgical Issues',
      medicalIssues: 'Medical Issues',
    }
    if (!this.toast.validateForm(this.motherForm, display_mapper)) {
      return
    }
    let api = undefined
    let payload = {
      name: this.motherForm.value?.name,
      age: this.motherForm.value?.age,
      height: this.motherForm.value?.height,
      weight: this.motherForm.value?.weight,
      education: this.motherForm.value?.education,
      reg_number: this.motherForm.value?.regNumber,
      reg_date: this.motherForm.value?.regDate,
      delivery_mode: this.motherForm.value?.deliveryMode,
      delivery_date: this.motherForm.value?.deliveryDate,
      relative_name: this.motherForm.value?.relativeName,
      relative_address: this.motherForm.value?.relativeAddress,
      relative_contact: this.motherForm.value?.relativeContact,
      relative_email: this.motherForm.value?.relativeEmail,
      relative_type: this.motherForm.value?.relativeType,
      surgical_issues: this.motherForm.value?.surgicalIssues,
      medical_issues: this.motherForm.value?.medicalIssues
    }
    if (this.type == "NEW") {
      api = this.backend.addMother(payload)
    } else {
      api = this.backend.updateMother(this.motherId, payload)
    }

    api.subscribe({
      next: () => {
        this.router.navigate(['mother'])
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )

  }
}
