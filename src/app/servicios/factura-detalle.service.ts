import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Respuesta } from '../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';
import { FacturaDetalle } from '../modelos/factura-detalle';

@Injectable({
  providedIn: 'root'
})
export class FacturaDetalleService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(facturaDetalleId: number) {
    this.messageSource.next(facturaDetalleId);
  }

  crear(facturaDetalle: FacturaDetalle): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.facturaDetalle, facturaDetalle, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.facturaDetalle, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(facturaDetalleId: number): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.factura+ '/' + facturaDetalleId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(facturaDetalle: FacturaDetalle): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.facturaDetalle, facturaDetalle, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(facturaDetalleId: number): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.facturaDetalle + '/' + facturaDetalleId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcular(facturaDetalle: FacturaDetalle): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.facturaDetalle+util.calcular, facturaDetalle, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
}
