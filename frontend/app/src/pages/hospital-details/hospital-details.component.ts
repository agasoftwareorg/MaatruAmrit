import { Component, Input, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-hospital-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './hospital-details.component.html',
  styleUrl: './hospital-details.component.scss'
})
export class HospitalDetailsComponent {

  @Input() type: string = 'NEW';

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
      subscription: new FormControl('2', [
        Validators.required
      ]),
    })

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    ngOnInit() {
      const hospitalId = this.route.snapshot.paramMap.get('id');
      console.log(hospitalId);
      if(this.type == "EDIT"){
        this.hospitalForm.setValue({
          'name': 'APOLLO',
          'address': 'DDE',
          'branch': 'CE',
          'contact': '344',
          'subscription': '1'
        })
      }
    }

    createHospital(){
      console.log(this.hospitalForm.value);
      this.router.navigate(['hospital'])
    }
}
