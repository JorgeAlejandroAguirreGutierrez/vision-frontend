import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CierreCaja } from '../../modelos/venta/cierre-caja';

@Injectable({
  providedIn: 'root'
})
export class CierreCajaService {

  constructor(private http: HttpClient) { }

  crear(cierreCaja: CierreCaja): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.cierreCaja, cierreCaja, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(cierreCajaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cierreCaja + urn.slash + cierreCajaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cierreCaja, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cierreCaja + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cierreCaja + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cierreCaja + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(cierreCaja: CierreCaja): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.cierreCaja + urn.buscar, cierreCaja, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(cierreCaja: CierreCaja): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.cierreCaja, cierreCaja, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(cierreCaja: CierreCaja): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.cierreCaja + urn.activar, cierreCaja, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(cierreCaja: CierreCaja): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.cierreCaja + urn.inactivar, cierreCaja, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
