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
import { GastoPersonal } from 'src/app/modelos/compra/gasto-personal';

@Injectable({
  providedIn: 'root'
})
export class GastoPersonalService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(gastoPersonal: GastoPersonal): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.gastoPersonal, gastoPersonal, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(gastoPersonalId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.gastoPersonal + urn.slash + gastoPersonalId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.gastoPersonal, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.gastoPersonal + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.gastoPersonal + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorProveedorYEmpresaYEstado(proveedorId: number, empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.gastoPersonal + urn.consultarPorProveedorYEmpresaYEstado + urn.slash + proveedorId + urn.slash + empresaId  + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(gastoPersonal: GastoPersonal): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.gastoPersonal, gastoPersonal, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  anular(gastoPersonal: GastoPersonal): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.gastoPersonal + urn.anular, gastoPersonal, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}