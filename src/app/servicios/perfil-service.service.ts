import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient,} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Perfil } from '../modelos/perfil';

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
    return this.http.post(environment.host + util.ruta + util.perfil, perfil, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(perfilId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.perfil + '/' + perfilId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.perfil, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(perfilId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.perfil + '/' + perfilId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  actualizar(perfil: Perfil): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.perfil, perfil, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(perfil: Perfil): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.perfil + '/' + perfil.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(perfil: Perfil): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.genero+util.buscar+'/'+perfil.codigo, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
