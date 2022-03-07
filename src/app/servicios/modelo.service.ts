import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Modelo } from '../modelos/modelo';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  constructor(private http: HttpClient) { }

  crear(modelo: Modelo): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.modelo, modelo, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(modelo_id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.amortizacion + '/' + modelo_id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.modelo, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(modelo: Modelo): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.modelo, modelo, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(modelo: Modelo): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.modelo + '/' + modelo.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  importar(archivo: File, modelo: Modelo): Observable<Respuesta> {
    const formData: FormData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    return this.http.post(environment.host + util.ruta + '/'+modelo.endpoint + util.importar, formData, util.optionsCargarArchivo).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  exportar(modelo: Modelo): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + '/'+modelo.endpoint + util.importar, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
