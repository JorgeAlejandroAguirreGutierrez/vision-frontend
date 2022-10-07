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

  obtener(impuestoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.impuesto + '/' + impuestoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtenerImpuestoPorcentaje(porcentaje: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.impuesto + urn.porcentaje+'/'+porcentaje, options).pipe(
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

  eliminar(impuesto: Impuesto): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.impuesto + '/' + impuesto.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
