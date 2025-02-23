import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  @Input() type: string = 'User';
  loginForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
    disableSubmit: new FormControl(false, [
      Validators.required,
    ]),
  })

  constructor(private router: Router, private backend: BackendService, 
    private toast: ToastService) { }

  ngOnInit() {
  }

  login() {
    this.loginForm.setErrors(null);
    let display_mapper: any = {
      userName: 'User name',
      password: 'Password'
    }
    if(!this.toast.validateForm(this.loginForm, display_mapper)){
      this.loginForm.controls.disableSubmit.setValue(false);
      return
    }

    this.loginForm.controls.disableSubmit.setValue(true);
    this.backend.login({
      username: this.loginForm.value?.userName,
      password: this.loginForm.value?.password
    }).pipe(
      finalize(() => {
        this.loginForm.controls.disableSubmit.setValue(false);
      })
    ).subscribe({
      next: () => {
        this.backend.setCurrentUser().subscribe({
          next: (data) => {
            if (this.type == 'Admin') {
              if (data.role === 'ADMIN') {
                this.router.navigate(['hospital'])
              } else {
                this.backend.logout();
                this.toast.show('Please use the User page to login');
                this.loginForm.reset();
              }
            } else {
              if (data.role !== 'ADMIN') {
                this.router.navigate(['mother'])
                this.backend.setCurrentHospital().subscribe()
              } else {
                this.backend.logout();
                this.toast.show('Please use the Admin page to login')
                this.loginForm.reset();
              }
            }
          },
          error: (error) => {
            this.toast.showError(error.error);
          }
        })
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }
}
