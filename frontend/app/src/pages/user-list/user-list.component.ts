import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';
import { DeleteModalComponent } from '../../layouts/delete-modal/delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  page_number = 1
  page_size = 5
  pages: any = []
  users: any = []
  hospitalId: string | null = '';
  userForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    role: new FormControl('HOSPITAL_ADMIN', [
      Validators.required,
    ]),
    userId: new FormControl(null),
    disableSubmit: new FormControl(false, [
      Validators.required,
    ]),
  })
  modalService = inject(NgbModal);
  private readonly route = inject(ActivatedRoute);
  constructor(private backend: BackendService, private toast: ToastService) { }

  ngOnInit() {
    this.hospitalId = this.route.snapshot.paramMap.get('id');
    this.listUsers()
  }

  createUser() {
    this.userForm.controls.disableSubmit.setValue(true);
    this.userForm.setErrors(null);

    let display_mapper: any = {
      username: 'Name',
      password: 'Password',
      role: 'Role',
    }
    if (!this.toast.validateForm(this.userForm, display_mapper)) {
      this.userForm.controls.disableSubmit.setValue(false);
      return
    }

    let api = undefined
    let payload = {
      username: this.userForm.value?.username,
      password: this.userForm.value?.password,
      role: this.userForm.value?.role,
      hospital: this.hospitalId
    }
    if (!this.userForm.value.userId) {
      api = this.backend.addUser(payload)
    } else {
      api = this.backend.updateUser(this.userForm.value.userId || '', payload)
    }

    api.pipe(
      finalize(() => {
        this.userForm.controls.disableSubmit.setValue(false);
      })
    ).subscribe({
      next: () => {
        this.userForm.reset({
          role: 'HOSPITAL_ADMIN',
          userId: null
        })
        this.listUsers()
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }



  listUsers(reset_page: boolean = true) {
    this.backend.getUsers(this.hospitalId, this.page_number, this.page_size).subscribe({
      next: (data: any) => {
        this.users = data?.results || [];
        if (reset_page) {
          this.pages = []
          for (let i = 1; i <= (this.users.length / this.page_size) + 1; i++) {
            this.pages.push(i)
          }
        }
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  deleteModal(id: string) {
    this.modalService.open(DeleteModalComponent, { size: 'lg' }).result.then(
      () => this.deleteUser(id)
    );
  }

  deleteUser(userId: string) {
    this.backend.deleteUser(userId).subscribe({
      next: () => {
        this.listUsers()
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  nextPage() {
    if (this.page_number < this.pages.length) {
      this.page_number += 1
      this.listUsers(false)
    }
  }

  previousPage() {
    if (this.page_number > 1) {
      this.page_number -= 1
      this.listUsers(false)
    }
  }

  changePage(page: number) {
    if (this.page_number != page) {
      this.page_number = page
      this.listUsers(false)
    }
  }

  editUser(user: any) {
    this.userForm.setValue({
      username: user.username,
      password: '',
      role: user.role,
      userId: user.id,
      disableSubmit: false
    })
  }

  resetUser() {
    this.userForm.reset({
      role: 'HOSPITAL_ADMIN',
      userId: null
    })
    console.log(this.userForm);
  }

}
