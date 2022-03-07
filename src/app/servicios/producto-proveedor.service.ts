import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductoProveedor } from '../modelos/producto-proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProductoProveedorService {

  constructor(private http: HttpClient) { }

  crear(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.productoProveedor, productoProveedor, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
//Obtener da como resultado un solo registro
  obtener(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.productoProveedor + '/' + productoProveedor.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
// Buscar para cuando es más de un registro
  buscarProducto(productoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.productoProveedor+ util.producto + '/' + productoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
// Devuelve todos los registros
  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.productoProveedor, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta + util.productoProveedor, productoProveedor, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta + util.productoProveedor + '/' + productoProveedor.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
