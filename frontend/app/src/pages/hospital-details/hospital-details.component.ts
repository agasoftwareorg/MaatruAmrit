import moment from 'moment';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import { finalize, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-hospital-details',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './hospital-details.component.html',
  styleUrl: './hospital-details.component.scss'
})
export class HospitalDetailsComponent {

  @Input() type: string = 'NEW';

  hospitalId: string = ''
  @ViewChild('hospitalLogo') hospitalLogo!: ElementRef;
  hospitalForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    address: new FormControl(null),
    branch: new FormControl(null),
    contact: new FormControl(null),
    subscription: new FormControl('PLAN_1_YEAR', [
      Validators.required
    ]),
    isAnalyzer: new FormControl(false, [
      Validators.required
    ]),
    subscriptionEnd: new FormControl(moment().add(1,'y').format('DD-MM-YYYY')),
    hasSubscriptionEnded: new FormControl(
      false, [Validators.required]
    ),
    disableSubmit: new FormControl(false, [
      Validators.required,
    ]),
    hospitalLogoPath: new FormControl(null),
  })

  private destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    let hospitalId = this.route.snapshot.paramMap.get('id');
    if (this.type == "EDIT" && hospitalId) {
      this.hospitalId = hospitalId
      this.backend.getHospitalById(this.hospitalId).subscribe({
        next: (data: any) => {
          let subscriptionEnd = data.subscription_end
          let hasSubscriptionEnded = false;
          if(subscriptionEnd !== null){
            subscriptionEnd = moment(data.subscription_end, 'YYYY-MM-DD')
            hasSubscriptionEnded = subscriptionEnd.isBefore()
            subscriptionEnd = subscriptionEnd.format('DD-MM-YYYY')
          }
          this.hospitalForm.setValue({
            name: data.name,
            address: data.address,
            branch: data.branch,
            contact: data.contact,
            subscription: data.subscription,
            isAnalyzer: data.is_analyzer,
            subscriptionEnd: subscriptionEnd,
            hasSubscriptionEnded: hasSubscriptionEnded,
            hospitalLogoPath: data.logo,
            disableSubmit: false
          })
          this.hospitalForm.get("subscription")?.disable();
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      });
    } else {
      this.watchSubscriptionChanges()
    }
    
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  renewSubscription(){
    this.hospitalForm.get("subscription")?.enable();
    this.watchSubscriptionChanges();
    this.hospitalForm.get("subscription")?.setValue(this.hospitalForm.get("subscription")?.value || null);
  }

  watchSubscriptionChanges(){
    this.hospitalForm.controls.subscription.valueChanges.
      pipe(takeUntil(this.destroy$)
    ).subscribe(
      (value) => {
        this.hospitalForm.get('hasSubscriptionEnded')?.setValue(false);
        if(value === 'PLAN_1_YEAR'){
          this.hospitalForm.controls.subscriptionEnd.setValue(
            moment().add(1,'y').format('DD-MM-YYYY')
          )
        } else if (value === 'PLAN_2_YEAR'){
          this.hospitalForm.controls.subscriptionEnd.setValue(
            moment().add(2,'y').format('DD-MM-YYYY')
          )
        } else if (value === 'PLAN_3_YEAR'){
          this.hospitalForm.controls.subscriptionEnd.setValue(
            moment().add(3,'y').format('DD-MM-YYYY')
          )
        } else {
          this.hospitalForm.controls.subscriptionEnd.setValue(null)
        }
      }
    )
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        let previewLogo: any = reader.result;
        this.hospitalForm.patchValue({
          hospitalLogoPath: previewLogo
        })
      };
      
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  clearHospitalLogo(){
    if(this.hospitalLogo){
      this.hospitalLogo.nativeElement.value = null
    }
    this.hospitalForm.patchValue({
      hospitalLogoPath: null
    });
  }

  createHospital() {
    this.hospitalForm.controls.disableSubmit.setValue(true);
    this.hospitalForm.setErrors(null);
    let display_mapper: any = {
      name: 'Hospital name',
      address: 'Address',
      branch: 'Branch',
      contact: 'Contact',
      isAnalyzer: 'Analyzer',
      subscription: 'Subscription',
      subscriptionEnd: 'Subscription End'
    }
    if (!this.toast.validateForm(this.hospitalForm, display_mapper)) {
      this.hospitalForm.controls.disableSubmit.setValue(false);
      return
    }

    let api = undefined
    let subscriptionEnd = this.hospitalForm.value?.subscriptionEnd
    if(subscriptionEnd !== null){
      subscriptionEnd = moment(this.hospitalForm.value?.subscriptionEnd, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }
    let payload: any = {
      name: this.hospitalForm.value?.name,
      address: this.hospitalForm.value?.address,
      branch: this.hospitalForm.value?.branch,
      contact: this.hospitalForm.value?.contact,
      subscription: this.hospitalForm.controls?.subscription.value,
      subscription_end: subscriptionEnd,
      is_analyzer: this.hospitalForm.value?.isAnalyzer,
    }
    console.log(this.hospitalLogo);
    console.log(this.hospitalLogo.nativeElement.files);
    console.log(this.hospitalForm.value.hospitalLogoPath);
    if (this.hospitalLogo && this.hospitalLogo.nativeElement.files && this.hospitalLogo.nativeElement.files.length > 0) {
      payload.logo = this.hospitalLogo.nativeElement.files[0]
    } else if (!this.hospitalForm.value.hospitalLogoPath){
      payload.logo = null
    }

    if (this.type == "NEW") {
      api = this.backend.addHospital(payload)
    } else {
      api = this.backend.updateHospital(this.hospitalId, payload)
    }

    api.pipe(
      finalize(() => {
        this.hospitalForm.controls.disableSubmit.setValue(false);
      })
    ).subscribe({
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
