import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoGasto } from '../modelos/tipo-gasto';

@Injectable({
  providedIn: 'root'
})
export class TipoGastoService {

  constructor(private http: HttpClient) { }

  crear(tipoGasto: TipoGasto): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.tipoGasto, tipoGasto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(tipoGasto: TipoGasto): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoGasto + '/' + tipoGasto.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.tipoGasto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(tipoGasto: TipoGasto): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta + util.tipoGasto, tipoGasto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(tipoGasto: TipoGasto): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta + util.tipoGasto + '/' + tipoGasto.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
