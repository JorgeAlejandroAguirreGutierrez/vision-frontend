import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto } from '../../modelos/inventario/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  crear(producto: Producto): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.producto, producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(productoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.producto + urn.slash + productoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorProveedor(proveedorId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarPorProveedor + urn.slash + proveedorId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorCategoriaProductoYEstado(categoriaProducto: string, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarPorCategoriaProductoYEstado + urn.slash + categoriaProducto + urn.slash + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorCategoriaProductoYProveedorYEstado(categoriaProducto: string, proveedorId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarPorCategoriaProductoYProveedorYEstado + urn.slash + categoriaProducto + urn.slash + proveedorId + urn.slash + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorCategoriaProductoYEmpresaYEstado(categoriaProducto: string, empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarPorCategoriaProductoYEmpresaYEstado + urn.slash + categoriaProducto + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorCategoriaProductoYProveedorYEmpresaYEstado(categoriaProducto: string, proveedorId: number, empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarPorCategoriaProductoYProveedorYEmpresaYEstado + urn.slash + categoriaProducto + urn.slash + proveedorId +  urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(producto: Producto): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.producto + urn.buscar, producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }


  actualizar(producto: Producto): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.producto, producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(producto: Producto): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.producto + urn.activar, producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(producto: Producto): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.producto + urn.inactivar, producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
