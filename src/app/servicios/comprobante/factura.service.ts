import { EventEmitter, Injectable, Output } from '@angular/core';
import { Factura } from '../../modelos/comprobante/factura';
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
export class FacturaService {

  constructor(private http: HttpClient, private router: Router) { }

  @Output() eventoRecaudacion= new EventEmitter<Factura>();

  enviarEventoRecaudacion(msg: Factura) {
    this.eventoRecaudacion.emit(msg);
  }

  @Output() eventoEntrega= new EventEmitter<Factura>();

  enviarEventoEntrega(msg: Factura) {
    this.eventoEntrega.emit(msg);
  }

  crear(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura+ urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(factura: Factura): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.factura, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  activar(factura: Factura): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.factura + urn.activar, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(factura: Factura): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.factura + urn.inactivar, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.buscar, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularFacturaDetalleTemp(facturaDetalle: FacturaDetalle){
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcularFacturaDetalleTemp, facturaDetalle, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcular(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcular, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }  
}
