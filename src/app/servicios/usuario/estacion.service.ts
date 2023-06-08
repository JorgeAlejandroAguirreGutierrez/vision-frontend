import { Injectable } from '@angular/core';
import { Estacion } from '../../modelos/usuario/estacion';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class EstacionService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(estacion: Estacion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.estacion, estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(estacionId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.estacion + urn.slash + estacionId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEstablecimiento(establecimientoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.estacion + urn.establecimiento + urn.slash + establecimientoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEstablecimientoPuntoVenta(establecimientoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.estacion + urn.establecimientoPuntoVenta + urn.slash + establecimientoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.estacion + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(estacion: Estacion): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.estacion, estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(estacion: Estacion): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.estacion + urn.activar, estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(estacion: Estacion): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.estacion + urn.inactivar, estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
