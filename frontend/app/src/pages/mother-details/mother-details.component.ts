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
    let motherId = this.route.snapshot.paramMap.get('id');
    if (this.type == "EDIT" && motherId) {
      this.motherId = motherId
      this.backend.getMotherById(this.motherId).subscribe({
        next: (data: any) => {
          this.motherForm.setValue({
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

  createMother() {
    this.motherForm.setErrors(null);

    let display_mapper: any = {
      name: 'Mother name',
      age: 'Age'
    }
    if (!this.toast.validateForm(this.motherForm, display_mapper)) {
      return
    }
    let api = undefined
    let payload = {
      name: this.motherForm.value?.name,
      age: this.motherForm.value?.age,
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
