import { Injectable } from '@angular/core';
import { Impuesto } from '../modelos/impuesto';
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
export class ImpuestoService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(impuesto: Impuesto): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.impuesto, JSON.stringify(impuesto), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.impuesto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(impuestoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.impuesto + '/' + impuestoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  obtenerImpuestoPorcentaje(porcentaje: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.impuesto + util.impuestoPorcentaje+'/'+porcentaje, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(impuesto: Impuesto): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.impuesto, impuesto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(impuesto: Impuesto): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.impuesto + '/' + impuesto.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
