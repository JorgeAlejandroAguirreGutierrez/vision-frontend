import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { TipoRetencion } from '../../modelos/configuracion/tipo-retencion';

@Injectable({
  providedIn: 'root'
})
export class TipoRetencionService {

  constructor(private http: HttpClient, private router: Router) { }

  obtenerIvaBien(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.ivaBien, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerIvaServicio(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.ivaServicio, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  obtenerRentaBien(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.rentaBien, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  obtenerRentaServicio(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.rentaServicio, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  crear(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.tipoRetencion, tipoRetencion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(tipoRetencionId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + '/' + tipoRetencionId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.tipoRetencion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.tipoRetencion + urn.buscar, tipoRetencion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.tipoRetencion, tipoRetencion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.tipoRetencion + '/' + tipoRetencion.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
