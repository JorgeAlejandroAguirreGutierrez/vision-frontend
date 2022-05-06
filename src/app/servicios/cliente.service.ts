import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from '../modelos/cliente';
import { Respuesta } from '../respuesta';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(clienteId: number) {
    this.messageSource.next(clienteId);
  }

  crear(cliente: Cliente): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.cliente, JSON.stringify(cliente), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.cliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
  
  async consultarAsync(): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.cliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })));
  }

  async obtenerAsync(clienteId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.cliente + '/' + clienteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })));
  }

  obtener(clienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.cliente + '/' + clienteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtenerIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.cliente + util.identificacion+'/'+identificacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(cliente: Cliente): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.cliente, JSON.stringify(cliente), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(cliente: Cliente): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.cliente + '/' + cliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(cliente: Cliente): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.cliente+util.personalizado + '/' + cliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  validarIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get(environment.host+util.ruta+util.cliente + '/identificacion/validar/' + identificacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
  validarTipoContribuyente(cliente: Cliente): Observable<Respuesta> {
    return this.http.get(environment.host+util.ruta+util.cliente + '/tipocontribuyente/validar/' + cliente.identificacion, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(cliente: Cliente): Observable<Respuesta> {
    return this.http.post<Respuesta>(environment.host + util.ruta + util.cliente+util.buscar, cliente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  importar(archivo: File): Observable<Respuesta> {
    const formData: FormData = new FormData();
    formData.append('clientes', archivo, archivo.name);
    return this.http.post(environment.host + util.ruta + util.cliente+util.importar, formData, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
