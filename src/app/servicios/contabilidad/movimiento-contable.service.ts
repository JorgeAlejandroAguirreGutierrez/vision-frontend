import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { optionsCargarArchivo } from '../../constantes';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Modelo } from '../../modelos/administracion/modelo';
import { MovimientoContable } from '../../modelos/contabilidad/movimiento-contable';

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
    return this.http.post(environment.host + urn.ruta + urn.movimientoContable, movimientoContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(movimientoContableId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.movimientoContable + '/' + movimientoContableId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(movimiento_contable_id: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.movimientoContable + '/' + movimiento_contable_id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.movimientoContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.movimientoContable, movimientoContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(movimientoContable: MovimientoContable): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.movimientoContable + '/' + movimientoContable.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(movimiento_contable: MovimientoContable): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.movimientoContable + urn.buscar + '/' + movimiento_contable.codigo + '/' + movimiento_contable.costoVenta+'/'+movimiento_contable.descuentoCompra, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  importar(archivo: File, modelo: Modelo): Observable<Respuesta> {
    const formData: FormData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    return this.http.post(environment.host + urn.ruta + '/' + modelo.endpoint + urn.importar, formData, optionsCargarArchivo).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  exportar(modelo: Modelo): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + '/' + modelo.endpoint + urn.importar, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }


}
