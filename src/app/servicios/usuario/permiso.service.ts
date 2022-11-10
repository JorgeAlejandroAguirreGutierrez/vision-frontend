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

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(perfil_id: number) {
    this.messageSource.next(perfil_id);
  }

  crear(permiso: Permiso): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.permiso, permiso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(permisoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.permiso + '/' + permisoId, options).pipe(
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

  async obtenerAsync(permisoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.permiso + '/' + permisoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  actualizar(permiso: Permiso): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.permiso, permiso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(permiso: Permiso): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.permiso, permiso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(permiso: Permiso): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.permiso + '/' + permiso.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(permiso: Permiso): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.genero + urn.buscar+'/'+permiso.codigo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
