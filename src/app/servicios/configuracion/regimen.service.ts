import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Regimen } from '../../modelos/configuracion/regimen';

@Injectable({
  providedIn: 'root'
})
export class RegimenService {

  constructor(private http: HttpClient) { }

  crear(regimen: Regimen): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.regimen, regimen, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(regimenId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.regimen + urn.slash + regimenId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.regimen, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.regimen + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(regimen: Regimen): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.regimen + urn.buscar, regimen, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(regimen: Regimen): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.regimen, regimen, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(regimen: Regimen): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.regimen + urn.activar, regimen, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(regimen: Regimen): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.regimen + urn.inactivar, regimen, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
