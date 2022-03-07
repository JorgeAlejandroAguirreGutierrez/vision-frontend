import { Injectable } from '@angular/core';
import { TipoContribuyente } from '../modelos/tipo-contribuyente';
import { Respuesta } from '../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoContribuyenteService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(tipoContribuyente: TipoContribuyente): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.tipoContribuyente, JSON.stringify(tipoContribuyente), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(tipo_contribuyente_id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoContribuyente + '/' + tipo_contribuyente_id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.tipoContribuyente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(tipoContribuyente: TipoContribuyente): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.tipoContribuyente, tipoContribuyente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(tipoContribuyente: TipoContribuyente): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.servicio + '/' + tipoContribuyente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
