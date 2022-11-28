import { Injectable } from '@angular/core';
import { Estacion } from '../../modelos/usuario/estacion';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class EstacionService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(estacionId: number) {
    this.messageSource.next(estacionId);
  }

  crear(estacion: Estacion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.estacion, estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(estacionId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.estacion + '/' + estacionId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarEstablecimiento(establecimientoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.estacion + urn.establecimiento + '/' + establecimientoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  async obtenerAsync(estacionId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.estacion + '/' + estacionId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }


  actualizar(estacion: Estacion): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.estacion, estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(estacion: Estacion): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.segmento, estacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(estacion: Estacion): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.estacion + '/' + estacion.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(estacion: Estacion): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario + urn.buscar + '/' + estacion.codigo + '/'+ estacion.descripcion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscarIP(ip: String): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.usuario + urn.buscar + '/' + ip, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerIP(): Observable<string> {
    return this.http.get('https://api.ipify.org?format=json').pipe(
      map(response => response['ip'] as string),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

}
