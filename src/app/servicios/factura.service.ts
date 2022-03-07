import { Injectable } from '@angular/core';
import { Factura } from '../modelos/factura';
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
export class FacturaService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(facturaId: number) {
    this.messageSource.next(facturaId);
  }

  crear(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.factura, factura, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.factura, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.factura+ '/' + facturaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(factura: Factura): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.factura, factura, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(facturaId: number): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.factura + '/' + facturaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  buscar(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.factura+util.buscar, factura, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularFacturaDetalleTemp(facturaDetalle: FacturaDetalle){
    return this.http.post(environment.host + util.ruta + util.factura+util.calcularFacturaDetalleTemp, facturaDetalle, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcular(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.factura+util.calcular, factura, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  generar_pdf(facturaId: number){
    return this.http.get(environment.host + util.ruta + util.factura+util.generar+util.pdf+'/'+facturaId, util.optionsGenerarArchivo).pipe(
      map(response => response as Blob),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
}
