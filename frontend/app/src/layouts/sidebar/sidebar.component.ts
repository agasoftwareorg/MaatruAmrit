import { Component, inject } from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive, Route, Router} from '@angular/router';
import { BackendService } from '../../services/backend.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  private readonly router = inject(Router);

  constructor(private backend: BackendService){}

  logout(){
    this.backend.logout()
    this.router.navigate(["/login"])
  }
}
