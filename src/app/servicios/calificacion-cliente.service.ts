import { Injectable } from '@angular/core';
import { CalificacionCliente } from '../modelos/calificacion-cliente';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalificacionClienteService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  enviar(calificacionClienteId: number) {
    this.messageSource.next(calificacionClienteId);
  }

  crear(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.calificacionCliente, JSON.stringify(calificacionCliente), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(calificacionClienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.calificacionCliente + '/' + calificacionClienteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(calificacionClienteId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.calificacionCliente + '/' + calificacionClienteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.calificacionCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.calificacionCliente+util.buscar, calificacionCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.calificacionCliente, JSON.stringify(calificacionCliente), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.calificacionCliente + '/' + calificacionCliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
