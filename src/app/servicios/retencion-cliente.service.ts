import { Injectable } from '@angular/core';
import { RetencionCliente } from '../modelos/retencion-cliente';
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
export class RetencionService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(retencionCliente: RetencionCliente): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.retencionCliente, retencionCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(retencionClienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.retencionCliente + '/' + retencionClienteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.retencionCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(retencionCliente: RetencionCliente): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.retencionCliente, retencionCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(retencionCliente: RetencionCliente): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.retencionCliente + '/' + retencionCliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
