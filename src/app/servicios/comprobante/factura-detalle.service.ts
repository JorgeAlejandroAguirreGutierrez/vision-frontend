import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { FacturaDetalle } from '../../modelos/comprobante/factura-detalle';

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
    return this.http.post(environment.host + urn.ruta + urn.facturaDetalle, facturaDetalle, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.facturaDetalle, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(facturaDetalleId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura+ '/' + facturaDetalleId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(facturaDetalle: FacturaDetalle): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.facturaDetalle, facturaDetalle, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(facturaDetalleId: number): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.facturaDetalle + '/' + facturaDetalleId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcular(facturaDetalle: FacturaDetalle): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.facturaDetalle + urn.calcular, facturaDetalle, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
}
