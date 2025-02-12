import { Component, inject } from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive, Route, Router} from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastComponent } from '../toast/toast.component';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  userRole: string = '';
  private readonly router = inject(Router);

  constructor(private backend: BackendService){}

  ngOnInit(){
    if(this.backend.currentUserRole){
      this.userRole = this.backend.currentUserRole
    } else {
      this.backend.setCurrentUser().subscribe({
        next: () => {
          this.userRole = this.backend.currentUserRole
        }
      })
    }
  }

  logout(){
    this.backend.logout()
    this.router.navigate(["/login"])
  }
}
