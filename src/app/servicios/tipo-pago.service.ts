import { Injectable } from '@angular/core';
import { TipoPago } from '../modelos/tipo-pago';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {BehaviorSubject, Observable, throwError, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TipoPagoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(grupo_cliente_id: number) {
    this.messageSource.next(grupo_cliente_id);
  }

  crear(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.tipoPago, tipoPago, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(tipoPagoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.tipoPago + '/' + tipoPagoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.tipoPago, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(tipoPagoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.tipoPago + '/' + tipoPagoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  buscar(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.tipoPago+util.buscar, tipoPago, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.tipoPago, tipoPago, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.tipoPago + '/' + tipoPago.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
