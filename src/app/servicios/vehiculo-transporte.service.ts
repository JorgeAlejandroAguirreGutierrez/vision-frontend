import { Injectable } from '@angular/core';
import { VehiculoTransporte } from '../modelos/vehiculo-transporte';
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
export class VehiculoTransporteService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(vehiculoTransporte: VehiculoTransporte): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.vehiculoTransporte, vehiculoTransporte, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.vehiculoTransporte, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(vehiculoTransporteId: number): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.vehiculoTransporte+'/' + vehiculoTransporteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(vehiculoTransporte: VehiculoTransporte): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.vehiculoTransporte, vehiculoTransporte, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(vehiculoTransporte: VehiculoTransporte): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.servicio + '/' + vehiculoTransporte.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
