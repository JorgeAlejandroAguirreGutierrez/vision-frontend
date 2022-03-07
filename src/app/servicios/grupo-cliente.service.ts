import { Injectable } from '@angular/core';
import { GrupoCliente } from '../modelos/grupo-cliente';
import { Respuesta } from '../respuesta';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoClienteService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(grupoClienteId: number) {
    this.messageSource.next(grupoClienteId);
  }


  crear(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.grupoCliente, grupoCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(grupoClienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoCliente + '/' + grupoClienteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(grupoClienteId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.grupoCliente + '/' + grupoClienteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.grupoCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.grupoCliente+util.buscar, grupoCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.grupoCliente, grupoCliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.grupoCliente + '/' + grupoCliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
