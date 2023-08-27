import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { NotaCreditoCompra } from 'src/app/modelos/compra/nota-credito-compra';
import { NotaCreditoCompraLinea } from 'src/app/modelos/compra/nota-credito-compra-linea';

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoCompraService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(notaCreditoCompra: NotaCreditoCompra): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCreditoCompra, notaCreditoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(notaCreditoCompraId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.notaCreditoCompra + urn.slash + notaCreditoCompraId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorProceso(proceso: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoCompra + urn.consultarPorProceso + urn.slash + proceso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoCompra + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYProceso(empresaId: number, proceso: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoCompra + urn.consultarPorEmpresaYProceso + urn.slash + empresaId + urn.slash + proceso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(notaCreditoCompra: NotaCreditoCompra): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.notaCreditoCompra, notaCreditoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  anular(notaCreditoCompra: NotaCreditoCompra): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaCreditoCompra + urn.anular, notaCreditoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcular(notaCreditoCompra: NotaCreditoCompra): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCreditoCompra + urn.calcular, notaCreditoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularLinea(notaCreditoCompraLinea: NotaCreditoCompraLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCreditoCompra + urn.calcularLinea, notaCreditoCompraLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerPorFacturaCompra(facturaCompraId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoCompra + urn.obtenerPorFacturaCompra + urn.slash + facturaCompraId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}