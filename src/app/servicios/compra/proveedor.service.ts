import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Proveedor } from '../../modelos/compra/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private http: HttpClient) { }

  crear(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.proveedor, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(proveedorId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.proveedor + urn.slash + proveedorId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.proveedor + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.proveedor + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.proveedor + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.proveedor, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.proveedor + urn.activar, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.proveedor + urn.inactivar, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.post<Respuesta>(environment.host + urn.ruta + urn.proveedor + urn.buscar, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.proveedor + urn.identificacion + urn.slash + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  validarIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cliente + '/identificacion/validar/' + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
