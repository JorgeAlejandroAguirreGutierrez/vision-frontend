import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Permiso } from '../../modelos/usuario/permiso';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(permiso: Permiso): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.permiso, permiso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(permisoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.permiso + urn.slash + permisoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.permiso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(permiso: Permiso): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.permiso, permiso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(permiso: Permiso): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.permiso + urn.activar, permiso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(permiso: Permiso): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.permiso + urn.inactivar, permiso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(permiso: Permiso): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.genero + urn.buscar + urn.slash + permiso.codigo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
