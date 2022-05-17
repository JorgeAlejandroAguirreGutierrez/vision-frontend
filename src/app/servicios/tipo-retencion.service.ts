import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';
import { TipoRetencion } from '../modelos/tipo-retencion';

@Injectable({
  providedIn: 'root'
})
export class TipoRetencionService {

  constructor(private http: HttpClient, private router: Router) { }

  obtenerIvaBien(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/ivaBien', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerIvaServicio(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/ivaServicio', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  obtenerRentaBien(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/rentaBien', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  obtenerRentaServicio(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/rentaServicio', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  crear(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.tipoRetencion, tipoRetencion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(tipoRetencionId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/' + tipoRetencionId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.tipoRetencion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.tipoRetencion+util.buscar, tipoRetencion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.tipoRetencion, tipoRetencion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.tipoRetencion + '/' + tipoRetencion.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
