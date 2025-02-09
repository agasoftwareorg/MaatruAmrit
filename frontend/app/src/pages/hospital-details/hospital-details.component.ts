import { Component, Input, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { BackendService } from '../../services/backend.service';


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
      subscription: new FormControl('2', [
        Validators.required
      ]),
    })

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    constructor(private backend: BackendService) {}

    ngOnInit() {
      let hospitalId = this.route.snapshot.paramMap.get('id');
      if(this.type == "EDIT" && hospitalId){
        this.hospitalId = hospitalId
        this.backend.getHospitalById(this.hospitalId).subscribe({
          next: (data: any) => {
            this.hospitalForm.setValue({
              'name': data.name,
              'address': 'DDE',
              'branch': 'CE',
              'contact': '344',
              'subscription': '1'
            })
          },
          error: (error) => {
            alert(error.error?.detail);
          }
        })
        
      }
    }

    createHospital(){
      this.hospitalForm.setErrors(null);

      if (this.hospitalForm.controls.name.invalid) {
        this.hospitalForm.setErrors({
          customError: 'Fill a valid name'
        })
      } else {
        let api = undefined
        if (this.type == "NEW"){
          api = this.backend.addHospital({
            name: this.hospitalForm.value?.name,
            description: this.hospitalForm.value?.name
          })
        } else {
          api = this.backend.updateHospital(this.hospitalId, {
            name: this.hospitalForm.value?.name,
            description: this.hospitalForm.value?.name
          })
        }
        
        api.subscribe({
          next: () => {
            this.router.navigate(['hospital'])
          },
          error: (error) => {
            alert(error.error?.detail);
          }
        }
        )
      }
      
    }
}
