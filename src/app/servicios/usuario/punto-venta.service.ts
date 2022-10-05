import { Injectable } from '@angular/core';
import { PuntoVenta } from '../../modelos/usuario/punto-venta';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; 

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
    return this.http.post(environment.host + urn.ruta + urn.puntoVenta, puntoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(puntoVentaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.puntoVenta + '/' + puntoVentaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarEstablecimiento(establecimientoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.puntoVenta + urn.establecimiento + '/' + establecimientoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.puntoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(puntoVentaId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.puntoVenta + '/' + puntoVentaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }


  actualizar(puntoVenta: PuntoVenta): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.puntoVenta, puntoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(puntoVenta: PuntoVenta): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.puntoVenta + '/' + puntoVenta.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(puntoVenta: PuntoVenta): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario + urn.buscar + '/' + puntoVenta.codigo + '/'+ puntoVenta.descripcion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
