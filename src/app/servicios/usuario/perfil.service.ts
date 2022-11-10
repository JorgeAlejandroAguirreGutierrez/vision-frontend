import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient,} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Perfil } from '../../modelos/usuario/perfil';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(perfil_id: number) {
    this.messageSource.next(perfil_id);
  }

  crear(perfil: Perfil): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.perfil, perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(perfilId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.perfil + '/' + perfilId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(perfilId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.perfil + '/' + perfilId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  actualizar(perfil: Perfil): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.perfil, perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(perfil: Perfil): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.perfil, perfil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(perfil: Perfil): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.perfil + '/' + perfil.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(perfil: Perfil): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.genero + urn.buscar+'/'+perfil.codigo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
