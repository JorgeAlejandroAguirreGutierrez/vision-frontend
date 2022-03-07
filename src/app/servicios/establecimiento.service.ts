import { Injectable } from '@angular/core';
import { Establecimiento } from '../modelos/establecimiento';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(establecimiento_id: number) {
    this.messageSource.next(establecimiento_id);
  }

  crear(establecimiento: Establecimiento): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.establecimiento, JSON.stringify(establecimiento), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.establecimiento, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }
    ));
  }

  obtener(establecimientoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.establecimiento + '/' + establecimientoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
    
  }

  actualizar(establecimiento: Establecimiento): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.establecimiento, JSON.stringify(establecimiento), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(establecimiento: Establecimiento): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.servicio + '/' + establecimiento.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(establecimiento: Establecimiento): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.usuario+util.buscar+'/'+establecimiento.codigo + '/'+establecimiento.direccion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(establecimientoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.establecimiento + '/' + establecimientoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }
}
