import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss'
})
export class BlankComponent {

}
