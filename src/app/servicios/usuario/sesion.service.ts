import { Injectable } from '@angular/core';
import { Sesion } from '../../modelos/usuario/sesion';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private http: HttpClient, private router: Router) { }

  obtenerIP(): Observable<string> {
    return this.http.get('https://api.ipify.org?format=json').pipe(
      map(response => response['ip'] as string),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  crear(sesion: Sesion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.sesion, sesion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  validar(sesion: Sesion): Observable<Respuesta> {
    return this.http.post<Respuesta>(environment.host + urn.ruta + urn.sesion + urn.validar, sesion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  setSesion(sesion: Sesion) {
    sessionStorage.setItem('sesion', JSON.stringify(sesion));

  }

  getSesion(): Sesion {
    return JSON.parse(sessionStorage.getItem('sesion'));
  }

  cerrarSesion(){
    sessionStorage.removeItem('sesion');
  }
}
