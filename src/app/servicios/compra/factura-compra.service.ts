import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { FacturaCompra } from '../../modelos/compra/factura-compra';
import { FacturaCompraLinea } from 'src/app/modelos/compra/factura-compra-linea';

@Injectable({
  providedIn: 'root'
})
export class FacturaCompraService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(facturaCompra: FacturaCompra): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.facturaCompra, facturaCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(facturaCompraId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.facturaCompra + urn.slash + facturaCompraId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.facturaCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorProceso(proceso: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.facturaCompra + urn.consultarPorProceso + urn.slash + proceso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.facturaCompra + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYProceso(empresaId: number, proceso: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.facturaCompra + urn.consultarPorEmpresaYProceso + urn.slash + empresaId + urn.slash + proceso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorProveedorYEmpresaYProceso(empresaId: number, proveedorId: number, proceso: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.facturaCompra + urn.consultarPorProveedorYEmpresaYProceso + urn.slash + empresaId + urn.slash + proveedorId  + urn.slash + proceso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(facturaCompra: FacturaCompra): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.facturaCompra, facturaCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  anular(facturaCompra: FacturaCompra): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.facturaCompra + urn.anular, facturaCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcular(facturaCompra: FacturaCompra): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.facturaCompra + urn.calcular, facturaCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcularLinea(facturaCompraLinea: FacturaCompraLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.facturaCompra + urn.calcularLinea, facturaCompraLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  pagar(facturaCompraId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.facturaCompra + urn.pagar + urn.slash + facturaCompraId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
