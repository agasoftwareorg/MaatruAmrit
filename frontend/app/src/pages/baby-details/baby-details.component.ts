import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-baby-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './baby-details.component.html',
  styleUrl: './baby-details.component.scss'
})
export class BabyDetailsComponent {
  @Input() type: string = 'NEW';

  babyId: string = ''
  babyForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    age: new FormControl('', [
      Validators.required,
    ])
  })

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    let babyId = this.route.snapshot.paramMap.get('id');
    if (this.type == "EDIT" && babyId) {
      this.babyId = babyId
      this.backend.getBabyById(this.babyId).subscribe({
        next: (data: any) => {
          this.babyForm.setValue({
            name: data.name,
            age: data.age
          })
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
      name: 'Baby name',
      age: 'Age'
    }
    if (!this.toast.validateForm(this.babyForm, display_mapper)) {
      return
    }

    let api = undefined
    let payload = {
      name: this.babyForm.value?.name,
      age: this.babyForm.value?.age,
    }
    if (this.type == "NEW") {
      api = this.backend.addBaby(payload)
    } else {
      api = this.backend.updateBaby(this.babyId, payload)
    }

    api.subscribe({
      next: () => {
        this.router.navigate(['baby'])
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )

  }
}
