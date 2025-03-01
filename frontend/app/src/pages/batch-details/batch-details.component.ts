import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import { finalize, Observable } from 'rxjs';
import moment from 'moment';
import { FilenamePipe } from '../../services/filename.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-batch-details',
  standalone: true,
  imports: [ReactiveFormsModule, FilenamePipe, RouterLink, AsyncPipe],
  templateUrl: './batch-details.component.html',
  styleUrl: './batch-details.component.scss'
})
export class BatchDetailsComponent {

  @Input() type: string = 'NEW';

  hasAnalyzer$!: Observable<boolean>;
  batchId: string = ''
  @ViewChild('analyzerReportFile') analyzerReportFile!: ElementRef;
  @ViewChild('pasteurizationReportFile') pasteurizationReportFile!: ElementRef;

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
    analyzerReportPath: new FormControl(null),
    pasteurizationReportPath: new FormControl(null),
  })


  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private backend: BackendService, private toast: ToastService) {
    this.hasAnalyzer$ = backend.hasAnalyzer()
  }

  pad(num: number, size: number = 6) {
    let num_str = num.toString();
    while (num_str.length < size) num_str = "0" + num_str;
    return num_str;
  }

  ngOnInit() {
    // if(!this.backend.currentHospitalName){
    //   this.backend.setCurrentHospital().subscribe({
    //     next: () => {
    //       this.hasAnalyzer = this.backend.currentHospitalHasAnalyzer
    //     }
    //   })
    // } else {
    //   this.hasAnalyzer = this.backend.currentHospitalHasAnalyzer
    // }

    let batchId = this.route.snapshot.paramMap.get('id');
    if (this.type !== "NEW" && batchId) {
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
            disableSubmit: false,
            analyzerReportPath: data.analyzer_report,
            pasteurizationReportPath: data.pasteurization_report
          })
          // this.batchForm.controls.name.disable();
          if (this.type === "VIEW") {
            this.batchForm.disable();
          }
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      });
    } else {
      this.backend.getLatestBatch().subscribe({
        next: (data: any) => {
          this.batchForm.controls.name.setValue('B' +moment().format('YYYYMMDDhhmm') + this.pad(data.id))
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      })
    }
  }


  clearAnalyzerFile(){
    if(this.analyzerReportFile){
      this.analyzerReportFile.nativeElement.value = null
    }
    this.batchForm.patchValue({
      analyzerReportPath: null
    });
  }

  downloadFile(link: any){
    window.open(link, "_blank");
  }

  clearPasteurizationFile(){
    if(this.pasteurizationReportFile){
      this.pasteurizationReportFile.nativeElement.value = null
    }
    this.batchForm.patchValue({
      pasteurizationReportPath: null
    });
  }

  createBatch() {
    this.batchForm.controls.disableSubmit.setValue(true);
    this.batchForm.setErrors(null);
    let display_mapper: any = {
      name: 'Batch name',
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
    let payload: any = {
      name: this.batchForm.value.name,
      fat: this.batchForm.value.fat,
      protein: this.batchForm.value.protein,
      snf: this.batchForm.value.snf,
      lactose: this.batchForm.value.lactose,
      den: this.batchForm.value.den,
      sol: this.batchForm.value.sol,
      temp: this.batchForm.value.temp,
      fp: this.batchForm.value.fp,
      calories: this.batchForm.value.calories,
      pasteurization: this.batchForm.value.pasteurization
    }
    if (this.analyzerReportFile && this.analyzerReportFile.nativeElement.files && this.analyzerReportFile.nativeElement.files.length > 0) {
      payload.analyzer_report = this.analyzerReportFile.nativeElement.files[0]
    } else if (!this.batchForm.value.analyzerReportPath){
      payload.analyzer_report = null
    }

    if (this.pasteurizationReportFile && this.pasteurizationReportFile.nativeElement.files && this.pasteurizationReportFile.nativeElement.files.length > 0) {
      payload.pasteurization_report = this.pasteurizationReportFile.nativeElement.files[0]
    } else if (!this.batchForm.value.pasteurizationReportPath){
      payload.pasteurization_report = null
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
