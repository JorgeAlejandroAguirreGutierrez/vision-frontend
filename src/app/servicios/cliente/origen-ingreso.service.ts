import { Injectable } from '@angular/core';
import { OrigenIngreso } from '../../modelos/cliente/origen-ingreso';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrigenIngresoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(origenIngresoId: number) {
    this.messageSource.next(origenIngresoId);
  }

  crear(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.origenIngreso, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(origenIngresoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.origenIngreso + '/' + origenIngresoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.origenIngreso + urn.buscar, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.origenIngreso, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.origenIngreso + '/' + origenIngreso.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(origenIngreso: OrigenIngreso): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.origenIngreso, origenIngreso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
