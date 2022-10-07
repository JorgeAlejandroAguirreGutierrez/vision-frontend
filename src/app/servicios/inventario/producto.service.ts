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

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  enviar(productoId: number) {
    this.messageSource.next(productoId);
  }

  crear(producto: Producto): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.producto, producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(productoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.producto + '/' + productoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(productoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.producto + '/' + productoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarBien(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.tipo + urn.bien, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarServicio(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.tipo + urn.servicio, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivoFijo(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.producto + urn.tipo + urn.activoFijo, options).pipe(
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

  eliminar(producto: Producto): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.producto + '/' + producto.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
