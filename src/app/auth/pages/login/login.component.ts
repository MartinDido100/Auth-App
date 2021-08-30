import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validations.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      .errors span{
        color: red;
      }
    `
  ]
})
export class LoginComponent{

  miFormulario: FormGroup = this.fB.group({
    email: ['marindidolich2012@gmail.com', [Validators.required, Validators.email]],
    password: ['43664688m', [Validators.required, Validators.minLength(6)] ],
  })

  constructor(private fB : FormBuilder,
              private validations: ValidationService,
              private router: Router,
              private authS : AuthService) { }


  validarError(campo:string){
    return this.validations.manejoErrores(campo,this.miFormulario);
  }

  login(){
    const { email, password } = this.miFormulario.value;

    if(!this.miFormulario.valid){
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.authS.login( email,password ).subscribe(
      ok => {
        if(ok === true){
          this.router.navigateByUrl('/dashboard');
        }else{
          Swal.fire('Error',ok, 'error');
        }
      }
    )
  }

}
