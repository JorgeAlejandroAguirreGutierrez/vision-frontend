import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { NotaDebitoCompra } from 'src/app/modelos/compra/nota-debito-compra';
import { NotaDebitoCompraLinea } from 'src/app/modelos/compra/nota-debito-compra-linea';

@Injectable({
  providedIn: 'root'
})
export class NotaDebitoCompraService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(notaDebitoCompra: NotaDebitoCompra): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebitoCompra, notaDebitoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(notaDebitoCompraId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.notaDebitoCompra + urn.slash + notaDebitoCompraId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebitoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorProceso(proceso: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebitoCompra + urn.consultarPorProceso + urn.slash + proceso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebitoCompra + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYProceso(empresaId: number, proceso: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebitoCompra + urn.consultarPorEmpresaYProceso + urn.slash + empresaId + urn.slash + proceso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(notaDebitoCompra: NotaDebitoCompra): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.notaDebitoCompra, notaDebitoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  anular(notaDebitoCompra: NotaDebitoCompra): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaDebitoCompra + urn.anular, notaDebitoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcular(notaDebitoCompra: NotaDebitoCompra): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebitoCompra + urn.calcular, notaDebitoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularLinea(notaDebitoCompraLinea: NotaDebitoCompraLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebitoCompra + urn.calcularLinea, notaDebitoCompraLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  obtenerPorFacturaCompra(facturaCompraId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebitoCompra + urn.obtenerPorFacturaCompra + urn.slash + facturaCompraId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}