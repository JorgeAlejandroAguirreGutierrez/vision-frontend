import { Injectable } from '@angular/core';
import { OrigenIngreso } from '../../modelos/cliente/origen-ingreso';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrigenIngresoService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.origenIngreso, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(origenIngresoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.origenIngreso + urn.slash + origenIngresoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.origenIngreso + urn.consultar + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.origenIngreso + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.origenIngreso + urn.buscar, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.origenIngreso, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.origenIngreso + urn.activar, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.origenIngreso + urn.inactivar, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
