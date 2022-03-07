import { Injectable } from '@angular/core';
import { Auxiliar } from '../modelos/auxiliar';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuxiliarService {

  constructor(private http: HttpClient) { }

  crear(auxiliar: Auxiliar): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.auxiliar, JSON.stringify(auxiliar), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(auxiliarId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.auxiliar + '/' + auxiliarId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.auxiliar, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(auxiliar: Auxiliar): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.auxiliar, JSON.stringify(auxiliar), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(auxiliar: Auxiliar): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.auxiliar + '/' + auxiliar.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  consultarRazonSocial(auxiliar: Auxiliar): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.auxiliar+util.buscar+
      util.razonSocial+"/"+auxiliar.razonSocial+"/"+auxiliar.cliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }
  consultarClienteID(auxiliar: Auxiliar): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.auxiliar+util.cliente+
      "/"+auxiliar.cliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }
}
