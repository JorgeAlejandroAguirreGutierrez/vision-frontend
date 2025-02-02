import { Injectable } from '@angular/core';
import { EstadoCivil } from '../../modelos/cliente/estado-civil';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError, switchAll } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoCivilService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(estadoCivil: EstadoCivil): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.estadoCivil, estadoCivil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(estadoCivilId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.estadoCivil + urn.slash + estadoCivilId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.estadoCivil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.estadoCivil + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(estadoCivil: EstadoCivil): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.estadoCivil + urn.buscar, estadoCivil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(estadoCivil: EstadoCivil): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.estadoCivil, estadoCivil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(estadoCivil: EstadoCivil): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.estadoCivil + urn.activar, estadoCivil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(estadoCivil: EstadoCivil): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.estadoCivil + urn.inactivar, estadoCivil, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
