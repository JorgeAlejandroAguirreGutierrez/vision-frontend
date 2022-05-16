import { Injectable } from '@angular/core';
import { Dependiente } from '../modelos/dependiente';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DependienteService {

  constructor(private http: HttpClient) { }

  crear(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.dependiente, JSON.stringify(dependiente), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(dependienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.dependiente + '/' + dependienteId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.dependiente, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.dependiente, JSON.stringify(dependiente), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.dependiente + '/' + dependiente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  consultarRazonSocial(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.dependiente+util.buscar+
      util.razonSocial+"/"+dependiente.razonSocial+"/"+dependiente.cliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }
  consultarClienteID(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.dependiente+util.cliente+
      "/"+dependiente.cliente.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }
}
