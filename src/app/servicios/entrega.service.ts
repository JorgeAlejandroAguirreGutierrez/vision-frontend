import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Entrega } from '../modelos/entrega';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {

  constructor(private http: HttpClient) { }

  crear(entrega: Entrega): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.entrega, entrega, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.entrega + '/' + id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.entrega + util.factura+"/"+facturaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.entrega, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(entrega: Entrega): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta + util.entrega, entrega, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(id: Entrega): Observable<Respuesta> {
    return this.http.delete(environment.host + util.ruta + util.entrega + '/' + id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
