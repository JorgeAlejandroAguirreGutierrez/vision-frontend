import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { GrupoProveedor } from '../../modelos/compra/grupo-proveedor';

@Injectable({
  providedIn: 'root'
})
export class GrupoProveedorService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(grupoProveedor: GrupoProveedor): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.grupoProveedor, grupoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(grupoProveedorId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProveedor + urn.slash + grupoProveedorId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.grupoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.grupoProveedor + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.grupoProveedor + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.grupoProveedor + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(grupoProveedor: GrupoProveedor): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.grupoProveedor + urn.buscar, grupoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(grupoProveedor: GrupoProveedor): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.grupoProveedor, grupoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(grupoProveedor: GrupoProveedor): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.grupoProveedor + urn.activar, grupoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(grupoProveedor: GrupoProveedor): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.grupoProveedor + urn.inactivar, grupoProveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
