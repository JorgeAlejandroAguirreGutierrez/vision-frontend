import { Injectable } from '@angular/core';
import { Transportista } from '../modelos/transportista';
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
export class TransportistaService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(transportista: Transportista): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.transportista, transportista, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.transportista, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(transportistaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.transportista + '/' + transportistaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(transportista: Transportista): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.transportista, transportista, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(transportista: Transportista): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.servicio + '/' + transportista.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
