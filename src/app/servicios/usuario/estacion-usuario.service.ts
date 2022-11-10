import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EstacionUsuario } from '../../modelos/usuario/estacion-usuario';

@Injectable({
  providedIn: 'root'
})
export class EstacionUsuarioService {

  constructor(private http: HttpClient) { }

  crear(estacionUsuario: EstacionUsuario): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.estacionUsuario, estacionUsuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(estacionUsuario: EstacionUsuario): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.estacionUsuario + '/' + estacionUsuario.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
  buscarUsuario(usuarioId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.estacionUsuario + urn.usuario + '/' + usuarioId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.estacionUsuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(estacionUsuario: EstacionUsuario): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.estacionUsuario, estacionUsuario, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(estacionUsuario: EstacionUsuario): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.estacionUsuario + '/' + estacionUsuario.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
