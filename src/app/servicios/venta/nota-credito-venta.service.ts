import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { NotaCreditoVenta } from 'src/app/modelos/venta/nota-credito-venta';
import { NotaCreditoVentaLinea } from 'src/app/modelos/venta/nota-credito-venta-linea';

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoVentaService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(notaCreditoVenta: NotaCreditoVenta): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCreditoVenta, notaCreditoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(notaCreditoVentaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.notaCreditoVenta + urn.slash + notaCreditoVentaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoVenta + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoVenta + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoVenta + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(notaCreditoVenta: NotaCreditoVenta): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.notaCreditoVenta, notaCreditoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(notaCreditoVenta: NotaCreditoVenta): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaCreditoVenta + urn.activar, notaCreditoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(notaCreditoVenta: NotaCreditoVenta): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaCreditoVenta + urn.inactivar, notaCreditoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcular(notaCreditoVenta: NotaCreditoVenta): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCreditoVenta + urn.calcular, notaCreditoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  calcularLinea(notaCreditoVentaLinea: NotaCreditoVentaLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCreditoVenta + urn.calcularLinea, notaCreditoVentaLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoVenta + urn.obtenerPorFactura + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
