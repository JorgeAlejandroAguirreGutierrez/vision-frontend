import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map, catchError, switchAll } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

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
    return this.http.post(environment.host + util.ruta + util.usuario, usuario, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(usuarioId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.usuario + '/' + usuarioId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.usuario, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(usuarioId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.usuario + '/' + usuarioId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  actualizar(usuario: Usuario): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.usuario, usuario, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(usuario: Usuario): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.servicio + '/' + usuario.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(usuario: Usuario): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.usuario+util.buscar+'/'+usuario.codigo + '/'+usuario.nombre+'/'+usuario.correo, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
