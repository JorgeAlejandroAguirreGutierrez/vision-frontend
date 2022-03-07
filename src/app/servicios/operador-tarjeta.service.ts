import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { OperadorTarjeta } from '../modelos/operador-tarjeta';

@Injectable({
  providedIn: 'root'
})
export class OperadorTarjetaService {

  constructor(private http: HttpClient) { }

  crear(operadorTarjeta: OperadorTarjeta): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.operadorTarjeta, operadorTarjeta, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(operadorTarjetaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.banco + '/' + operadorTarjetaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.operadorTarjeta, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  consultarTipo(tipo: string): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.operadorTarjeta+util.tipo+"/"+tipo, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(operadorTarjeta: OperadorTarjeta): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.banco, operadorTarjeta, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(operadorTarjeta: OperadorTarjeta): Observable<Respuesta> {
    return this.http.delete(environment.host + util.ruta+util.banco + '/' + operadorTarjeta.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
