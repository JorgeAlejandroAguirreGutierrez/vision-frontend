import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoriaProducto } from '../modelos/categoria-producto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProductoService {

  constructor(private http: HttpClient) { }

  crear(categoriaProducto: CategoriaProducto): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.categoriaProducto, JSON.stringify(categoriaProducto), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(categoriaProducto: CategoriaProducto): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.categoriaProducto + '/' + categoriaProducto.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.categoriaProducto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(categoriaProducto: CategoriaProducto): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.categoriaProducto, JSON.stringify(categoriaProducto), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(categoriaProducto: CategoriaProducto): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.categoriaProducto + '/' + categoriaProducto.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
