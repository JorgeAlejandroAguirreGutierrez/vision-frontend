import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductoProveedor } from '../../modelos/inventario/producto-proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProductoProveedorService {

  constructor(private http: HttpClient) { }

  crear(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.productoProveedor, productoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.productoProveedor + urn.slash + productoProveedor.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
  buscarProducto(productoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.productoProveedor + urn.producto + urn.slash + productoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.productoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.productoProveedor, productoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.productoProveedor + urn.activar, productoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(productoProveedor: ProductoProveedor): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.productoProveedor + urn.inactivar, productoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
