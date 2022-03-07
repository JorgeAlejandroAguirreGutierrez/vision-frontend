import { Injectable } from '@angular/core';
import { PuntoVenta } from '../modelos/punto-venta';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map, catchError, switchAll } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PuntoVentaService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(puntoVentaId: number) {
    this.messageSource.next(puntoVentaId);
  }

  crear(puntoVenta: PuntoVenta): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.puntoVenta, puntoVenta, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(puntoVentaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.puntoVenta + '/' + puntoVentaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarEstablecimiento(establecimientoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.puntoVenta+util.establecimiento + '/' + establecimientoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.puntoVenta, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(puntoVentaId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.puntoVenta + '/' + puntoVentaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }


  actualizar(puntoVenta: PuntoVenta): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.puntoVenta, puntoVenta, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(puntoVenta: PuntoVenta): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.puntoVenta + '/' + puntoVenta.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(puntoVenta: PuntoVenta): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.usuario+util.buscar+'/'+puntoVenta.codigo + '/'+puntoVenta.descripcion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
