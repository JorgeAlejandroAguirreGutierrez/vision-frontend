import { Injectable, EventEmitter, Output } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { NotaDebitoVenta } from 'src/app/modelos/venta/nota-debito-venta';
import { NotaDebitoVentaLinea } from 'src/app/modelos/venta/nota-debito-venta-linea';

@Injectable({
  providedIn: 'root'
})
export class NotaDebitoVentaService {

  constructor(private http: HttpClient, private router: Router) { }

  @Output() eventoRecaudacion = new EventEmitter<NotaDebitoVenta>();

  enviarEventoRecaudacion(data: NotaDebitoVenta) {
    this.eventoRecaudacion.emit(data);
  }

  crear(notaDebitoVenta: NotaDebitoVenta): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebitoVenta, notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(notaDebitoVentaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.notaDebitoVenta + urn.slash + notaDebitoVentaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebitoVenta + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(notaDebitoVenta: NotaDebitoVenta): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.notaDebitoVenta, notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(notaDebitoVenta: NotaDebitoVenta): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaDebitoVenta + urn.activar, notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(notaDebitoVenta: NotaDebitoVenta): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaDebitoVenta + urn.inactivar, notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcular(notaDebitoVenta: NotaDebitoVenta): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebitoVenta + urn.calcular, notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  calcularLinea(notaDebitoVentaLinea: NotaDebitoVentaLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebitoVenta + urn.calcularLinea, notaDebitoVentaLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularRecaudacion(notaDebitoVenta: NotaDebitoVenta): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebitoVenta + urn.calcularRecaudacion, notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebitoVenta + urn.obtenerPorFactura + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
