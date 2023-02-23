import { Injectable } from '@angular/core';
import { TipoPago } from '../../modelos/configuracion/tipo-pago';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {BehaviorSubject, Observable, throwError, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TipoPagoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(tipoPagoId: number) {
    this.messageSource.next(tipoPagoId);
  }

  crear(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.tipoPago, tipoPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(tipoPagoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoPago + urn.slash + tipoPagoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.tipoPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.tipoPago + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.tipoPago + urn.buscar, tipoPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.tipoPago, tipoPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.tipoPago + urn.activar, tipoPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(tipoPago: TipoPago): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.tipoPago + urn.inactivar, tipoPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
