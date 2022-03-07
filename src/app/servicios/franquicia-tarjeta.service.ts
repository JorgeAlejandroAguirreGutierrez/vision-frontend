import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { FranquiciaTarjeta } from '../modelos/franquicia-tarjeta';

@Injectable({
  providedIn: 'root'
})
export class FranquiciaTarjetaService {

  constructor(private http: HttpClient) { }

  crear(franquiciaTarjeta: FranquiciaTarjeta): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.franquiciaTarjeta, JSON.stringify(franquiciaTarjeta), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(franquiciaTarjetaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.banco + '/' + franquiciaTarjetaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.franquiciaTarjeta, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(franquiciaTarjeta: FranquiciaTarjeta): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.banco, JSON.stringify(franquiciaTarjeta), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(franquiciaTarjeta: FranquiciaTarjeta): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.banco + '/' + franquiciaTarjeta.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
