import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  camposIguales(control1: string,control2: string){
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const pass1: string = formGroup.get(control1)?.value;
      const pass2 : string = formGroup.get(control2)?.value;

      if(pass1 !== pass2){
        return {
          noIguales: true
        }
      }

      formGroup.get(control2)?.setErrors(null);

      return null
    }
  }

  manejoErrores(campo : string, form: FormGroup){
    return form.get(campo)?.invalid && form.get(campo)?.touched;
  }

  constructor() { }
}
