import { Injectable } from '@angular/core';
import { Impuesto } from '../../modelos/inventario/impuesto';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImpuestoService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(impuesto: Impuesto): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.impuesto, impuesto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.impuesto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.impuesto + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtener(impuestoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.impuesto + urn.slash + impuestoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtenerImpuestoPorcentaje(porcentaje: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.impuesto + urn.porcentaje + urn.slash + porcentaje, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(impuesto: Impuesto): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.impuesto, impuesto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(impuesto: Impuesto): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.impuesto + urn.activar, impuesto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(impuesto: Impuesto): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.impuesto + urn.inactivar, impuesto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
