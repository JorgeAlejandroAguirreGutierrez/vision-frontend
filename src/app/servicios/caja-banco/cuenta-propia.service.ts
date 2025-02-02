import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CuentaPropia } from '../../modelos/caja-banco/cuenta-propia';

@Injectable({
  providedIn: 'root'
})
export class CuentaPropiaService {

  constructor(private http: HttpClient) { }

  crear(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.cuentaPropia, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(cuentaPropiaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cuentaPropia + urn.slash + cuentaPropiaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaPropia + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaPropia + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaPropia + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarBancoDistintoPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaPropia + urn.consultarBancoDistintoPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorBancoYEmpresa(banco: string, empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaPropia + urn.consultarPorBancoYEmpresa + urn.slash + banco + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.cuentaPropia + urn.buscar, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.cuentaPropia, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.cuentaPropia + urn.activar, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.cuentaPropia + urn.inactivar, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

}