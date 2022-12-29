import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OperadorTarjeta } from '../../modelos/recaudacion/operador-tarjeta';

@Injectable({
  providedIn: 'root'
})
export class OperadorTarjetaService {

  constructor(private http: HttpClient) { }

  crear(operadorTarjeta: OperadorTarjeta): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.operadorTarjeta, operadorTarjeta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(operadorTarjetaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.banco + urn.slash + operadorTarjetaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.operadorTarjeta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorTipo(tipo: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.operadorTarjeta + urn.consultarPorTipo + urn.slash + tipo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(operadorTarjeta: OperadorTarjeta): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.banco, operadorTarjeta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(operadorTarjeta: OperadorTarjeta): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.operadorTarjeta + urn.activar, operadorTarjeta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(operadorTarjeta: OperadorTarjeta): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.operadorTarjeta + urn.inactivar, operadorTarjeta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
