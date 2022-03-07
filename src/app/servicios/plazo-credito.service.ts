import { Injectable } from '@angular/core';
import { PlazoCredito } from '../modelos/plazo-credito';
import { Respuesta } from '../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlazoCreditoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(plazoCreditoId: number) {
    this.messageSource.next(plazoCreditoId);
  }

  crear(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.plazoCredito, plazoCredito, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(plazoCreditoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.plazoCredito + '/' + plazoCreditoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(plazoCreditoId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.plazoCredito + '/' + plazoCreditoId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.plazoCredito, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.plazoCredito, plazoCredito, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.plazoCredito + '/' + plazoCredito.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.plazoCredito+util.buscar+'/'+plazoCredito.codigo + '/'+plazoCredito.descripcion+'/'+plazoCredito.plazo, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
