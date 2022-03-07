import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Amortizacion } from '../modelos/amortizacion';

@Injectable({
  providedIn: 'root'
})
export class AmortizacionService {

  constructor(private http: HttpClient) { }

  crear(amortizacion: Amortizacion): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.amortizacion, amortizacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(amortizacionId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.amortizacion + '/' + amortizacionId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.amortizacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(amortizacion: Amortizacion): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.amortizacion, amortizacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(amortizacion: Amortizacion): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.amortizacion + '/' + amortizacion.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
