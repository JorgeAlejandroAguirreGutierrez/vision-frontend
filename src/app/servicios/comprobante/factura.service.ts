import { EventEmitter, Injectable, Output } from '@angular/core';
import { Factura } from '../../modelos/comprobante/factura';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { FacturaLinea } from '../../modelos/comprobante/factura-linea';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient, private router: Router) { }

  @Output() eventoRecaudacion= new EventEmitter<number>();

  enviarEventoRecaudacion(data: number) {
    this.eventoRecaudacion.emit(data);
  }

  @Output() eventoEntrega= new EventEmitter<number>();

  enviarEventoEntrega(data: number) {
    this.eventoEntrega.emit(data);
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

  consultarPorCliente(clienteId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorCliente + urn.slash + clienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
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

  calcular(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcular, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  calcularLinea(facturaLinea: FacturaLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcularLinea, facturaLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
