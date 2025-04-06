import { Component, Input } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { concat, concatMap, of, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName: string = '';
  userRole: string = '';
  hospitalName: string = '';
  hospitalLogo: string = '';
  @Input() title: string = '';
  private destroy$ = new Subject<void>();

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.backend.getUserName().pipe(
      takeUntil(this.destroy$),
      concatMap(userName => userName ? of(userName): concat(this.backend.setCurrentUser(), this.backend.setCurrentHospital())),
    ).subscribe(
      userName => {
        this.userName = userName
      }
    );
    this.backend.getUserRole().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      userRole => {
        this.userRole = userRole
      }
    );
    this.backend.getHospitalName().pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      hospitalName => {
        this.hospitalName = hospitalName
      }
    );
    this.backend.getHospitalLogo().pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      hospitalLogo => {
        this.hospitalLogo = hospitalLogo
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
