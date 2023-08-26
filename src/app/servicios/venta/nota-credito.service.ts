import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { NotaCredito } from 'src/app/modelos/venta/nota-credito';
import { NotaCreditoLinea } from 'src/app/modelos/venta/nota-credito-linea';

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(notaCredito: NotaCredito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCredito, notaCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(notaCreditoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.notaCredito + urn.slash + notaCreditoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstadoSRI(estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCredito + urn.consultarPorEstadoSRI + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCredito + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYProcesoYEstadoSRI(empresaId: number, proceso: string, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCredito + urn.consultarPorEmpresaYProcesoYEstadoSRI + urn.slash + empresaId + urn.slash + proceso + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(notaCredito: NotaCredito): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.notaCredito, notaCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  anular(notaCredito: NotaCredito): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaCredito + urn.anular, notaCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcular(notaCredito: NotaCredito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCredito + urn.calcular, notaCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularLinea(notaCreditoLinea: NotaCreditoLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaCredito + urn.calcularLinea, notaCreditoLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCredito + urn.obtenerPorFactura + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
