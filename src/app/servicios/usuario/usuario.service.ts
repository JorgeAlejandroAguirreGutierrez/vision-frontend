import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario/usuario';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(usuario: Usuario): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.usuario, usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(usuarioId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.usuario + urn.slash + usuarioId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(usuario: Usuario): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.usuario, usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(usuario: Usuario): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.usuario + urn.activar, usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(usuario: Usuario): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.usuario + urn.inactivar, usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(usuario: Usuario): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario + urn.buscar + urn.slash + usuario.codigo + urn.slash + usuario.nombre + urn.slash + usuario.correo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerPorApodo(apodo: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario + urn.obtenerPorApodo + urn.slash + apodo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
