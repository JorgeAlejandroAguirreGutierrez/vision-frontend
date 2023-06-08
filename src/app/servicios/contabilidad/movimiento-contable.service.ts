import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { optionsCargarArchivo } from '../../constantes';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovimientoContable } from '../../modelos/contabilidad/movimiento-contable';

@Injectable({
  providedIn: 'root'
})

export class MovimientoContableService {

  constructor(private http: HttpClient) { }

  crear(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.movimientoContable, movimientoContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(movimientoContableId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.movimientoContable + urn.slash + movimientoContableId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.movimientoContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.movimientoContable + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.movimientoContable + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.movimientoContable + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }
  
  actualizar(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.movimientoContable, movimientoContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.movimientoContable + urn.activar, movimientoContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.calificacionCliente + urn.inactivar, movimientoContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.movimientoContable + urn.buscar + urn.slash + movimientoContable.codigo + urn.slash + movimientoContable.costoVenta + urn.slash + movimientoContable.descuentoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

}
