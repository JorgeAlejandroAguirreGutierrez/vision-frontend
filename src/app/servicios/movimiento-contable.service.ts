import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Modelo } from '../modelos/modelo';
import { MovimientoContable } from '../modelos/movimiento-contable';

@Injectable({
  providedIn: 'root'
})

export class MovimientoContableService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  enviar(movimiento_contable_id: number) {
    this.messageSource.next(movimiento_contable_id);
  }

  crear(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.movimientoContable, movimientoContable, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(movimientoContableId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.movimientoContable + '/' + movimientoContableId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(movimiento_contable_id: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.movimientoContable + '/' + movimiento_contable_id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.movimientoContable, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.movimientoContable, movimientoContable, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.movimientoContable + '/' + movimientoContable.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(movimiento_contable: MovimientoContable): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.movimientoContable+util.buscar+'/'+movimiento_contable.codigo + '/'+movimiento_contable.costoVenta+'/'+movimiento_contable.descuentoCompra, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  importar(archivo: File, modelo: Modelo): Observable<Respuesta> {
    const formData: FormData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    return this.http.post(environment.host + util.ruta + '/'+modelo.endpoint + util.importar, formData, util.optionsCargarArchivo).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  exportar(modelo: Modelo): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + '/'+modelo.endpoint + util.importar, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }


}
