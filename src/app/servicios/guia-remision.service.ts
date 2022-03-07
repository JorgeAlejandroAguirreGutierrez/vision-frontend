import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { GuiaRemision } from '../modelos/guia-remision';

@Injectable({
  providedIn: 'root'
})
export class GuiaRemisionService {

  constructor(private http: HttpClient) { }

  crear(guiaRemision: GuiaRemision): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.guiaRemision, guiaRemision, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(guiaRemisionId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.guiaRemision + '/' + guiaRemisionId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.guiaRemision, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(guiaRemision: GuiaRemision): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.guiaRemision, guiaRemision, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(guiaRemision: GuiaRemision): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.guiaRemision + '/' + guiaRemision.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
