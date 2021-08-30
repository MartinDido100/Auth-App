import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/auth.interfaces';
import { map, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;
  private _favoritos : string[] = [];

  get usuario(){
    return {...this._usuario};
  }

  get favoritos(){
    return [...this._favoritos];
  }

  constructor(private http: HttpClient) { }

  login( email: string,password: string ){
    const url = `${this.baseUrl}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>( url, body ).pipe(
      tap(resp => {
        if(resp.ok){
          localStorage.setItem('token', resp.token!);
        }
      }),
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))//Agarro el error y devuelvo un obs false
    )
  }

  registro(name: string, email: string, password: string){
    const url = `${this.baseUrl}/auth/new`;
    const body = {name,email,password}

    return this.http.post<AuthResponse>(url,body).pipe(
      tap(resp => {
        if(resp.ok){
          localStorage.setItem('token', resp.token!);
        }
      }),
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    )
  }

  validarToken(): Observable<boolean>{
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().
        set('x-token',localStorage.getItem('token') || '');
    return this.http.get<AuthResponse>(url,{ headers }).pipe(
      map(resp => {
        localStorage.setItem('token', resp.token!);
        this.cargarUsuario(resp);
        this._favoritos = resp.favourites!;
        return resp.ok
      }),
      catchError(err => of(false))
    )
  }

  cargarUsuario(resp: AuthResponse){
    this._usuario = {
      name: resp.name!,
      uid: resp.uid!,
      email: resp.email!
    }
  }

  addFav(name: string,favourite: string){
    const url = `${this.baseUrl}/auth/add`;
    const body = {name,favourite};
    return this.http.put<AuthResponse>(url,body);
  }

  removeFav(name: string,favourite: string){
    const url = `${this.baseUrl}/auth/remove`;
    const body = {name,favourite};
    return this.http.put<AuthResponse>(url,body);
  }

}
