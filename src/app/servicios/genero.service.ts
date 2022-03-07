import { Injectable } from '@angular/core';
import { Genero } from '../modelos/genero';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map, catchError, switchAll } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(generoId: number) {
    this.messageSource.next(generoId);
  }

  crear(genero: Genero): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.genero, JSON.stringify(genero), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(generoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.genero + '/' + generoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.genero, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(generoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.genero + '/' + generoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  actualizar(genero: Genero): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.genero, JSON.stringify(genero), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(genero: Genero): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.genero + '/' + genero.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(genero: Genero): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.genero+util.buscar, genero, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
