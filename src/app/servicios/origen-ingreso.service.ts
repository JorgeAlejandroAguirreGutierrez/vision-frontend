import { Injectable } from '@angular/core';
import { OrigenIngreso } from '../modelos/origen-ingreso';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrigenIngresoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(origenIngresoId: number) {
    this.messageSource.next(origenIngresoId);
  }

  crear(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.origenIngreso, origenIngreso, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(origenIngresoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.origenIngreso + '/' + origenIngresoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.origenIngreso, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(origenIngresoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.origenIngreso + '/' + origenIngresoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  buscar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.origenIngreso+util.buscar, origenIngreso, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.origenIngreso, origenIngreso, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.origenIngreso + '/' + origenIngreso.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
