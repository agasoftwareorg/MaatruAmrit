import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';


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
      Validators.minLength(1),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  })

  constructor(private router: Router, private backend: BackendService) { }

  ngOnInit() {
  }

  login() {
    this.loginForm.setErrors(null);
    console.log(this.loginForm);

    if (this.loginForm.controls.userName.invalid) {
      this.loginForm.setErrors({
        customError: 'Fill a valid username'
      })
    } else if (this.loginForm.controls.password.invalid) {
      this.loginForm.setErrors({
        customError: 'Fill a valid password'
      })
    } else {
      this.backend.login({
        username: this.loginForm.value?.userName,
        password: this.loginForm.value?.password
      }).subscribe({
        next: () => {
          this.router.navigate(['hospital'])
        },
        error: (error) => {
          console.log(error);
          this.loginForm.setErrors({
            customError: error.error?.detail || 'Invalid user name & password'
          })
        }
      }
      )

    }
  }

}
