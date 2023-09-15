import { Injectable } from '@angular/core';
import { Secuencial } from '../../modelos/configuracion/secuencial';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {BehaviorSubject, Observable, throwError, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecuencialService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(secuencial: Secuencial): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.secuencial, secuencial, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(secuencialId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.secuencial + urn.slash + secuencialId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.secuencial, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.secuencial + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.secuencial + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(secuencial: Secuencial): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.secuencial + urn.buscar, secuencial, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(secuencial: Secuencial): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.secuencial, secuencial, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(secuencial: Secuencial): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.secuencial + urn.activar, secuencial, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(secuencial: Secuencial): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.secuencial + urn.inactivar, secuencial, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
