import moment from 'moment';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import { FilenamePipe } from '../../services/filename.pipe';

@Component({
  selector: 'app-mother-details',
  standalone: true,
  imports: [ReactiveFormsModule, FilenamePipe, RouterLink],
  templateUrl: './mother-details.component.html',
  styleUrl: './mother-details.component.scss'
})
export class MotherDetailsComponent {

  @Input() type: string = 'NEW';

  motherId: string = ''
  @ViewChild('screeningFile') screeningFile!: ElementRef;

  motherForm = new FormGroup({
    regNumber: new FormControl('', [
      Validators.required,
    ]),
    regDate: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [
      Validators.required,
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    age: new FormControl(null, [
      Validators.required,
    ]),
    height: new FormControl(null),
    weight: new FormControl(null),
    education: new FormControl(null),
    bloodGroup: new FormControl(null),
    deliveryDate: new FormControl(null),
    deliveryMode: new FormControl(null),
    relativeName: new FormControl(null),
    relativeType: new FormControl(null),
    relativeContact: new FormControl(null),
    relativeEmail: new FormControl(null),
    relativeAddress: new FormControl(null),
    medicalIssues: new FormControl(null),
    surgicalIssues: new FormControl(null),
    screeningReportPath: new FormControl(null),
  })

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private backend: BackendService, private toast: ToastService) { }

  pad(num: number, size: number = 6) {
    let num_str = num.toString();
    while (num_str.length < size) num_str = "0" + num_str;
    return num_str;
  }

  clearScreeningFile(){
    if(this.screeningFile){
      this.screeningFile.nativeElement.value = null
    }
    this.motherForm.patchValue({
      screeningReportPath: null
    });
  }

  downloadFile(link: any){
    window.open(link, "_blank");
  }


  ngOnInit() {
    let motherId = this.route.snapshot.paramMap.get('id');
    if (this.type == "EDIT" && motherId) {
      this.motherId = motherId
      this.backend.getMotherById(this.motherId).subscribe({
        next: (data: any) => {
          let regTime = moment(data.reg_date, 'YYYY-MM-DDTHH:mm:ssZ')
          this.motherForm.setValue({
            name: data.name,
            age: data.age,
            height: data.height,
            weight: data.weight,
            education: data.education,
            regNumber: data.reg_number,
            regDate: regTime.format('YYYY-MM-DD HH:mm'),
            bloodGroup: data.blood_group,
            deliveryMode: data.delivery_mode,
            deliveryDate: data.delivery_date,
            relativeName: data.relative_name,
            relativeAddress: data.relative_address,
            relativeContact: data.relative_contact,
            relativeEmail: data.relative_email,
            relativeType: data.relative_type,
            surgicalIssues: data.surgical_issues,
            medicalIssues: data.medical_issues,
            screeningReportPath: data.screening_report
          })
        },
        error: (error) => {
          this.toast.showError(error.error);
        }
      })

    } else {
      this.backend.getLatestMotherID().subscribe({
        next: (data: any) => {
          this.motherForm.controls.regNumber.setValue('M' + moment().format('YYYYMMDD') + this.pad(data.id))
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
      bloodGroup: 'Blood Group',
      regNumber: 'Registration Number',
      regDate: 'Registration Date',
      deliveryMode: 'Delivery Mode',
      deliveryDate: 'Delivery Date',
      relativeName: 'Relative Name',
      relativeAddress: 'Relative Address',
      relativeContact: 'Relative Contact',
      relativeEmail: 'Relative Email',
      relativeType: 'Relative Type',
      surgicalIssues: 'Surgical Issues',
      medicalIssues: 'Medical Issues',
    }
    if (!this.toast.validateForm(this.motherForm, display_mapper)) {
      return
    }
    let api = undefined
    var payload: any = {
      name: this.motherForm.value?.name,
      age: this.motherForm.value?.age,
      height: this.motherForm.value?.height,
      weight: this.motherForm.value?.weight,
      education: this.motherForm.value?.education,
      blood_group: this.motherForm.value?.bloodGroup,
      reg_number: this.motherForm.value?.regNumber,
      reg_date: moment(this.motherForm.value?.regDate, 'YYYY-MM-DD HH:mm').utc().format('YYYY-MM-DDTHH:mm:ssZ'),
      delivery_mode: this.motherForm.value?.deliveryMode,
      delivery_date: this.motherForm.value?.deliveryDate,
      relative_name: this.motherForm.value?.relativeName,
      relative_address: this.motherForm.value?.relativeAddress,
      relative_contact: this.motherForm.value?.relativeContact,
      relative_email: this.motherForm.value?.relativeEmail,
      relative_type: this.motherForm.value?.relativeType,
      surgical_issues: this.motherForm.value?.surgicalIssues,
      medical_issues: this.motherForm.value?.medicalIssues,
    }
    if (this.screeningFile && this.screeningFile.nativeElement.files && this.screeningFile.nativeElement.files.length > 0) {
      payload.screening_report = this.screeningFile.nativeElement.files[0]
    } else if (!this.motherForm.value.screeningReportPath){
      payload.screening_report = null
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
