import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
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

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultar + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarActivos, options).pipe(
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

  consultarBien(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarBien, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarBienPorProveedor(proveedorId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarBienPorProveedor + urn.slash + proveedorId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarServicio(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarServicio, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarServicioPorProveedor(proveedorId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarServicioPorProveedor + urn.slash + proveedorId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivoFijo(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarActivoFijo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivoFijoPorProveedor(proveedorId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.consultarActivoFijoPorProveedor + urn.slash + proveedorId, options).pipe(
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
