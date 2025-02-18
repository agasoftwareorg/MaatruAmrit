import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-batch-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './batch-details.component.html',
  styleUrl: './batch-details.component.scss'
})
export class BatchDetailsComponent {

  @Input() type: string = 'NEW';

  batchId: string = ''
  batchForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    fat: new FormControl(null, [
    ]),
    protein: new FormControl(null, [
    ]),
    snf: new FormControl(null, [
    ]),
    lactose: new FormControl(null, [
    ]),
    den: new FormControl(null, [
    ]),
    sol: new FormControl(null, [
    ]),
    temp: new FormControl(null, [
    ]),
    fp: new FormControl(null, [
    ]),
    calories: new FormControl(null, [
    ]),
    pasteurization: new FormControl('NO_RESULT', [
      Validators.required
    ]),
    disableSubmit: new FormControl(false, [
      Validators.required,
    ]),
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
    let batchId = this.route.snapshot.paramMap.get('id');
    if (this.type == "EDIT" && batchId) {
      this.batchId = batchId
      this.backend.getBatchById(this.batchId).subscribe({
        next: (data: any) => {
          this.batchForm.setValue({
            name: data.name,
            fat: data.fat,
            protein: data.protein,
            snf: data.snf,
            lactose: data.lactose,
            den: data.den,
            sol: data.sol,
            temp: data.temp,
            fp: data.fp,
            calories: data.calories,
            pasteurization: data.pasteurization,
            disableSubmit: false
          })
          this.batchForm.controls.name.disable();
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      });
    } else {
      this.backend.getLatestBatch().subscribe({
        next: (data: any) => {
          if(data.results.length) {
            this.batchForm.controls.name.setValue(moment().format('YYYYMMDDhhmm') + this.pad(data.results[0].id + 1))
          } else {
            this.batchForm.controls.name.setValue(moment().format('YYYYMMDDhhmm') + this.pad(1))
          }
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      })
    }
  }


  createBatch() {
    this.batchForm.controls.disableSubmit.setValue(true);
    this.batchForm.setErrors(null);
    let display_mapper: any = {
      name: 'Hospital name',
      address: 'Address',
      branch: 'Branch',
      contact: 'Contact',
      isAnalyzer: 'Analyzer',
      subscription: 'Subscription',
      subscriptionEnd: 'Subscription End',
      pasteurization: 'Pasteurization Result'
    }
    if (!this.toast.validateForm(this.batchForm, display_mapper)) {
      this.batchForm.controls.disableSubmit.setValue(false);
      return
    }

    let api = undefined
    let payload = {
      name: this.batchForm.controls.name.value,
      fat: this.batchForm.value.fat,
      protein: this.batchForm.value.protein,
      snf: this.batchForm.value.snf,
      lactose: this.batchForm.value.lactose,
      den: this.batchForm.value.den,
      sol: this.batchForm.value.sol,
      temp: this.batchForm.value.temp,
      fp: this.batchForm.value.fp,
      calories: this.batchForm.value.calories,
      pasteurization: this.batchForm.value.pasteurization,
      disableSubmit: false
    }
    if (this.type == "NEW") {
      api = this.backend.addBatch(payload)
    } else {
      api = this.backend.updateBatch(this.batchId, payload)
    }

    api.pipe(
      finalize(() => {
        this.batchForm.controls.disableSubmit.setValue(false);
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['batch'])
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )

  }
}
