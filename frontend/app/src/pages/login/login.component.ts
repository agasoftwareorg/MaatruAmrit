import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Input() type: string = 'User';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(){
    this.router.navigate(['hospital'])
  }

}
