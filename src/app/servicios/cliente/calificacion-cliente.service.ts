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
    return this.http.post(environment.host + urn.ruta + urn.calificacionCliente, JSON.stringify(calificacionCliente), options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(calificacionClienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.calificacionCliente + '/' + calificacionClienteId, options).pipe(
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
    return this.http.put(environment.host + urn.ruta + urn.calificacionCliente, JSON.stringify(calificacionCliente), options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.calificacionCliente + '/' + calificacionCliente.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(calificacionCliente: CalificacionCliente): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.calificacionCliente, JSON.stringify(calificacionCliente), options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
