import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../modelos/producto';

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
    return this.http.post(environment.host + util.ruta + util.producto, producto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(productoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.producto + '/' + productoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(productoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.producto + '/' + productoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.producto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarBien(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.producto+util.tipo+util.bien, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarServicio(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.producto+util.tipo+util.servicio, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivoFijo(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.producto+util.tipo+util.activoFijo, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(producto: Producto): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.producto+util.buscar, producto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }


  actualizar(producto: Producto): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.producto, producto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(producto: Producto): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.producto + '/' + producto.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
