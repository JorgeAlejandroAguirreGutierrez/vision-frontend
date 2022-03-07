import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Caracteristica } from '../modelos/caracteristica';
import { Producto } from '../modelos/producto';
import { Bodega } from '../modelos/bodega';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicaService {

  constructor(private http: HttpClient) { }

  crear(caracteristica: Caracteristica): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.caracteristica, JSON.stringify(caracteristica), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(caracteristicaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.caracteristica + '/' + caracteristicaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.caracteristica, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(caracteristica: Caracteristica): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.caracteristica, JSON.stringify(caracteristica), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(caracteristica: Caracteristica): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.caracteristica + '/' + caracteristica.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  consultarBienExistencias(producto: Producto): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.caracteristica+util.tipo+util.bien+"/"+producto.id+util.existencias, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }
  consultarBienExistenciasBodega(producto: Producto, bodega: Bodega): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.caracteristica+util.tipo+util.bien+"/"+producto.id+util.existencias+"/"+bodega.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }
}
