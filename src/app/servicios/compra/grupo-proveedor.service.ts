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

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(grupoProveedorId: number) {
    this.messageSource.next(grupoProveedorId);
  }


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

  async obtenerAsync(grupoProveedorId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProveedor + urn.slash + grupoProveedorId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.grupoProveedor, options).pipe(
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
