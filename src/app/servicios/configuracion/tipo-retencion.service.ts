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

  consultarIvaBien(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.consultarIvaBien, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultarIvaServicio(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.consultarIvaServicio, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  consultarRentaBien(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.consultarRentaBien, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  consultarRentaServicio(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.consultarRentaServicio, options).pipe(
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
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoRetencion + urn.slash + tipoRetencionId, options).pipe(
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

  activar(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.tipoRetencion + urn.activar, tipoRetencion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(tipoRetencion: TipoRetencion): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.tipoRetencion + urn.inactivar, tipoRetencion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
