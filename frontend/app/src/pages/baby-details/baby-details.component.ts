import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import moment from 'moment';

@Component({
  selector: 'app-baby-details',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './baby-details.component.html',
  styleUrl: './baby-details.component.scss'
})
export class BabyDetailsComponent {
  @Input() type: string = 'NEW';

  babyId: string = ''
  babyForm = new FormGroup({
    regNumber: new FormControl('', [
      Validators.required,
    ]),
    regDate: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
    ]),
    age: new FormControl(null, [
      Validators.required,
    ]),
    sex: new FormControl(null, [
      Validators.required,
    ]),
    motherName: new FormControl(null),
    ward: new FormControl(null),
    birthWeight: new FormControl(null),
    currentWeight: new FormControl(null),
    diagnose: new FormControl(null),
    doctorName: new FormControl(null),
    doctorContact: new FormControl(null),
    doctorDesignation: new FormControl(null),
  })

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private backend: BackendService, private toast: ToastService) { }

  pad(num: number, size: number = 6) {
    let num_str = num.toString();
    while (num_str.length < size) num_str = "0" + num_str;
    return num_str;
  }

  ngOnInit() {
    let babyId = this.route.snapshot.paramMap.get('id');
    if (this.type == "EDIT" && babyId) {
      this.babyId = babyId
      this.backend.getBabyById(this.babyId).subscribe({
        next: (data: any) => {
          let regTime = moment(data.reg_date, 'YYYY-MM-DDTHH:mm:ssZ')
          this.babyForm.setValue({
            regNumber: data.reg_number,
            regDate: regTime.format('YYYY-MM-DD HH:mm'),
            name: data.name,
            motherName: data.mother_name,
            sex: data.sex,
            ward: data.ward,
            age: data.age,
            birthWeight: data.birth_weight,
            currentWeight: data.current_weight,
            diagnose: data.diagnose,
            doctorName: data.doctor_name,
            doctorContact: data.doctor_contact,
            doctorDesignation: data.doctor_designation,
          })
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      })

    } else {
      this.backend.getLatestBabyID().subscribe({
        next: (data: any) => {
          this.babyForm.controls.regNumber.setValue('R' + moment().format('YYYYMMDD') + this.pad(data.id))
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      })
    }
  }

  createBaby() {
    this.babyForm.setErrors(null);

    let display_mapper: any = {
      regNumber: 'Registration Number',
      regDate: 'Registration Date',
      name: 'Recipient Name',
      age: 'Recipient Age',
      motherName: 'Mother name',
      sex: 'Recipient Sex',
      ward: 'Ward',
      birthWeight: 'Birth Weight',
      currentWeight: 'Current Weight',
      diagnose: 'Diagnose',
      doctorName: 'Doctor Name',
      doctorContact: 'Doctor Contact',
      doctorDesignation: 'Doctor Designation',
    }
    if (!this.toast.validateForm(this.babyForm, display_mapper)) {
      return
    }

    let api = undefined
    let payload = {
      reg_number: this.babyForm.value?.regNumber,
      reg_date: moment(this.babyForm.value?.regDate, 'YYYY-MM-DD HH:mm').utc(),
      name: this.babyForm.value.name,
      age: this.babyForm.value.age,
      mother_name: this.babyForm.value.motherName,
      sex: this.babyForm.value.sex,
      ward: this.babyForm.value.ward,
      birth_weight: this.babyForm.value.birthWeight,
      current_weight: this.babyForm.value.currentWeight,
      diagnose: this.babyForm.value.diagnose,
      doctor_name: this.babyForm.value.doctorName,
      doctor_contact: this.babyForm.value.doctorContact,
      doctor_designation: this.babyForm.value.doctorDesignation,
    }
    if (this.type == "NEW") {
      api = this.backend.addBaby(payload)
    } else {
      api = this.backend.updateBaby(this.babyId, payload)
    }

    api.subscribe({
      next: () => {
        this.router.navigate(['recipient'])
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )

  }
}
