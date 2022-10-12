import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario/usuario';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(genero_id: number) {
    this.messageSource.next(genero_id);
  }

  crear(usuario: Usuario): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.usuario, usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(usuarioId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.usuario + '/' + usuarioId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(usuarioId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.usuario + '/' + usuarioId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  actualizar(usuario: Usuario): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.usuario, usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(usuario: Usuario): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.servicio + '/' + usuario.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(usuario: Usuario): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.usuario, usuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(usuario: Usuario): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario + urn.buscar + '/' + usuario.codigo + '/' + usuario.nombre + '/' + usuario.correo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
