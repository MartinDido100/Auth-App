import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validations.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swat from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
    `
      .errors span{
        color:red;
      }
    `
  ]
})
export class RegisterComponent {

  miFormulario: FormGroup = this.fB.group({
    name: ['',[Validators.required,Validators.minLength(2)]],
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.minLength(6)]],
    password2: ['',[Validators.minLength(6)]]
  },{
    validators: [this.validators.camposIguales('password','password2')]
  })

  constructor(private fB: FormBuilder,
              private validators: ValidationService,
              private router: Router,
              private aS: AuthService) { }


  validarError(campo: string){
    return this.validators.manejoErrores(campo, this.miFormulario);
  }

  validarErrorPass(campo:string){
    if(this.miFormulario.getError('noIguales')){
      return true
    }
    return false
  }

  registro(){
    const {name,email,password} = this.miFormulario.value;
    if(!this.miFormulario.valid){
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.aS.registro(name,email,password).subscribe(
      ok => {
        if(ok === true){
          this.router.navigateByUrl('/dashboard');
        }else{
          Swat.fire('Error:',ok,'error');
        }
      }
    )

  }

}
