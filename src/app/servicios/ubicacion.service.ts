import { Injectable } from '@angular/core';
import { Ubicacion } from '../modelos/ubicacion';
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
export class UbicacionService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(factura_id: number) {
    this.messageSource.next(factura_id);
  }

  crear(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.ubicacion, ubicacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(ubicacionId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.ubicacion + '/' + ubicacionId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.ubicacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.ubicacion, ubicacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.ubicacion + '/' + ubicacion.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerProvincias(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.ubicacion + '/provincia', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerCantones(provincia: string): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.ubicacion + '/provincia/'+provincia+'/canton', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerParroquias(canton: string): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.ubicacion + '/provincia/canton/'+canton+'/parroquia', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerUbicacionIDAsync(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.ubicacion + '/'+ubicacion.provincia+'/'+ubicacion.canton+'/'+ubicacion.parroquia+'/id', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerUbicacionID(ubicacion: Ubicacion): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.ubicacion + '/'+ubicacion.provincia+'/'+ubicacion.canton+'/'+ubicacion.parroquia+'/id', util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  buscar(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.ubicacion+util.buscar+'/'+ubicacion.codigoNorma + '/'+ubicacion.provincia+'/'+ubicacion.canton+'/'+ubicacion.parroquia, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
