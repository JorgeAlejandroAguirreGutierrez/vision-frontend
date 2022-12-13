import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CalificacionCliente } from '../../modelos/cliente/calificacion-cliente';

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
    return this.http.post(environment.host + urn.ruta + urn.calificacionCliente, calificacionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(calificacionClienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.calificacionCliente + urn.slash + calificacionClienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.calificacionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.calificacionCliente + urn.buscar, calificacionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.calificacionCliente, calificacionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.calificacionCliente + urn.activar, calificacionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.calificacionCliente + urn.inactivar, calificacionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
