import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';
import { Recaudacion } from '../modelos/recaudacion';

@Injectable({
  providedIn: 'root'
})
export class RecaudacionService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.recaudacion, recaudacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.recaudacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.recaudacion+"/"+recaudacion.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.recaudacion, recaudacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.recaudacion + '/' + recaudacion.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.recaudacion+util.factura+"/"+facturaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  calcular(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.post(environment.host+util.ruta+util.recaudacion+util.calcular, recaudacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularTotales(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.post(environment.host+util.ruta+util.recaudacion+util.calcularTotales, recaudacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
