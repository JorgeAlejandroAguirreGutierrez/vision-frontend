import { Injectable } from '@angular/core';
import { FormaPago } from '../modelos/forma-pago';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(formaPagoId: number) {
    this.messageSource.next(formaPagoId);
  }

  crear(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.formaPago, JSON.stringify(formaPago), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(formaPagoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.formaPago + '/' + formaPagoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.formaPago, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(formaPagoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.formaPago + '/' + formaPagoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  actualizar(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.formaPago, JSON.stringify(formaPago), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.formaPago + '/' + formaPago.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.formaPago+util.personalizado + '/' + formaPago.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.formaPago+util.buscar, formaPago, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
