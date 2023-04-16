import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoComprobante } from '../../modelos/venta/tipo-comprobante';

@Injectable({
  providedIn: 'root'
})
export class TipoComprobanteService {

  constructor(private http: HttpClient) { }

  crear(tipoComprobante: TipoComprobante): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.tipoComprobante, tipoComprobante, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(tipoComprobanteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoComprobante + urn.slash + tipoComprobanteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.tipoComprobante, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.tipoComprobante + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorElectronica(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoComprobante + urn.consultarElectronica, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(tipoComprobante: TipoComprobante): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.tipoComprobante, tipoComprobante, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(tipoComprobante: TipoComprobante): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.tipoComprobante + urn.activar, tipoComprobante, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(tipoComprobante: TipoComprobante): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.tipoComprobante + urn.inactivar, tipoComprobante, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
