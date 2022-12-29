import { Injectable } from '@angular/core';
import { Parametro } from '../../modelos/configuracion/parametro';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(parametro: Parametro): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.parametro, parametro, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(parametro: Parametro): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.parametro + urn.slash + parametro.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.parametro, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(parametro: Parametro): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.parametro, parametro, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  activar(parametro: Parametro): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.parametro + urn.activar, parametro, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(parametro: Parametro): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.parametro + urn.inactivar, parametro, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerPorTipo(tipo: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.parametro + urn.obtenerPorTipo + urn.slash + tipo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  consultarPorTipo(tipo: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.parametro + urn.consultarPorTipo + urn.slash + tipo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }   
}
