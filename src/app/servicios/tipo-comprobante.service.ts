import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoComprobante } from '../modelos/tipo-comprobante';

@Injectable({
  providedIn: 'root'
})
export class TipoComprobanteService {

  constructor(private http: HttpClient) { }

  crear(tipoComprobante: TipoComprobante): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.tipoComprobante, tipoComprobante, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(tipoComprobanteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoComprobante + '/' + tipoComprobanteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.tipoComprobante, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(tipoComprobante: TipoComprobante): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.tipoComprobante, tipoComprobante, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(tipoComprobante: TipoComprobante): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.tipoComprobante + '/' + tipoComprobante.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
