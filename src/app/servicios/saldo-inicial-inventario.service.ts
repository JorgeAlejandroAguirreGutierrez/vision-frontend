import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SaldoInicialInventario } from '../modelos/saldo-inicial-inventario';

@Injectable({
  providedIn: 'root'
})
export class SaldoInicialInventarioService {

  constructor(private http: HttpClient) { }

  crear(saldoInicialInventario: SaldoInicialInventario): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.saldoInicialInventario, saldoInicialInventario, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(saldoInicialInventarioId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.saldoInicialInventario + '/' + saldoInicialInventarioId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.saldoInicialInventario, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(saldoInicialInventario: SaldoInicialInventario): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.kardex, saldoInicialInventario, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(saldoInicialInventario: SaldoInicialInventario): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.saldoInicialInventario + '/' + saldoInicialInventario.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
