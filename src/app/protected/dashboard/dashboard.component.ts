import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      section{
        width: 100%;
        margin: 0;
        height: 100vh;
        padding: 15px;
      }
      input{
        margin: 10px;
        background: pink;
        border-radius: 7px;
        padding: 5px;
        border: 2px solid black;
      }
      button{
        background: pink;
        padding: 10px;
        border-radius: 5px;
        border: 2px solid black;
      }
      ul{
        margin-bottom: 15px;
      }
      .delete{
        cursor: pointer;
        user-select:none;
      }
    `
  ]
})
export class DashboardComponent {

  favorito: string = '';

  get usuario(){
    return this.aS.usuario;
  }

  get favoritos(){
    return this.aS.favoritos;
  }

  constructor(private router: Router,
              private aS: AuthService) { }


  agregarFav(){
    if(!this.favorito){
      return;
    }
    if(this.favoritos.includes(this.favorito.toLowerCase())){
      Swal.fire('Error','ya fue agregado ese favorito','error');
      this.favorito = '';
      return;
    }
    this.aS.addFav(this.usuario.name,this.favorito).pipe(
      switchMap(() => this.aS.validarToken())
    ).subscribe();
    this.favorito = '';
  }

  borrarFavorito(favorito: string){
    this.aS.removeFav(this.usuario.name,favorito).pipe(
      switchMap(()=> this.aS.validarToken() )
    ).subscribe();
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }
  
}
