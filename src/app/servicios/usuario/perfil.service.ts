import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient,} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Perfil } from '../../modelos/usuario/perfil';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(perfil_id: number) {
    this.messageSource.next(perfil_id);
  }

  crear(perfil: Perfil): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.perfil, perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(perfilId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.perfil + urn.slash + perfilId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(perfil: Perfil): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.perfil, perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(perfil: Perfil): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.perfil + urn.activar, perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(perfil: Perfil): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.perfil + urn.inactivar, perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(perfil: Perfil): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.genero + urn.buscar + urn.slash + perfil.codigo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
