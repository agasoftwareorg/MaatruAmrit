import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Route, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastComponent } from '../toast/toast.component';
import { Subject, takeUntil } from 'rxjs';


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
  private destroy$ = new Subject<void>();

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.backend.getUserRole().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      userRole => {
        this.userRole = userRole
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  logout() {
    this.backend.logout()
    if (this.userRole === 'ADMIN') {
      this.router.navigate(["/admin/login"])
    } else {
      this.router.navigate(["/login"])
    }
  }

  home() {
    if (this.userRole === 'ADMIN') {
      this.router.navigate(["/hospital"])
    } else {
      this.router.navigate(["/mother"])
    }
  }
}
