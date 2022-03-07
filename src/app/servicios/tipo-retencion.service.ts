import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoRetencionService {

  constructor(private http: HttpClient, private router: Router) { }

  obtenerIvaBien(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/ivabien', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerIvaServicio(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/ivaservicio', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  obtenerRentaBien(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/rentabien', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  obtenerRentaServicio(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoRetencion + '/rentaservicio', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
