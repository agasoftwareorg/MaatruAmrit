import { Component, inject, Input } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName: string = '';
  @Input() title: string = '';

  constructor(private backend: BackendService) { }

  ngOnInit(){
    console.log('head');
    if(this.backend.currentUserName){
      this.userName = this.backend.currentUserName
    } else {
      this.backend.setCurrentUser().subscribe({
        next: () => {
          this.userName = this.backend.currentUserName
        }
      })
    }
  }
  
}
