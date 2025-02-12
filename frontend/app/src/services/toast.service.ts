import { Injectable } from '@angular/core';

export interface ToastInfo {
  // header: string;
  message: string;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: ToastInfo[] = [];

  show(message: string) {
    this.toasts.push({ message });
  }
  
  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

  validateForm(form: any, display_mapper: any){
    for (let field in form.value) {
      let display_name = field
      if (field in display_mapper) {
        display_name = display_mapper[field]
      }
      let control = form.get(field)
      for (let error in control?.errors) {
        if (error === 'required') {
          this.show(`${display_name} is required.`);
          return false;
        } else if (error === 'minlength') {
          this.show(`${display_name} must be at least ${control?.errors[error].requiredLength} characters long.`);
          return false;
        } else if (error === 'maxlength') {
          this.show(`${display_name} cannot exceed ${control?.errors[error].requiredLength} characters long.`);
          return false;
        } else {
          this.show(`Validation issue for ${display_name}.`)
          return false;
        }
      }
    }
    return true;
  }

  showError(error: any){
    for (let key in error){
      if(typeof(error[key]) == 'string'){
        this.show(error[key]);
        return;
      } if(Array.isArray(error[key])){
        for (let idx in error[key]){
          this.show(error[key][idx]);
          return;
        }
      }
    }
    this.show('Unknown API Error Occured');
  }
}
