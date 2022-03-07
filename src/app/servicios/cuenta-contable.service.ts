import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Modelo } from '../modelos/modelo';
import { CuentaContable } from '../modelos/cuenta-contable';

@Injectable({
  providedIn: 'root'
})

export class CuentaContableService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  enviar(cuenta_contable_id: number) {
    this.messageSource.next(cuenta_contable_id);
  }

  crear(cuentaContable: CuentaContable): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.cuentaContable, JSON.stringify(cuentaContable), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(cuentaContableId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.cuentaContable + '/' + cuentaContableId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(cuentaContableId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.cuentaContable + '/' + cuentaContableId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.cuentaContable, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(cuentaContable: CuentaContable): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.cuentaContable, JSON.stringify(cuentaContable), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(cuentaContable: CuentaContable): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.cuentaContable + '/' + cuentaContable.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(cuentaContable: CuentaContable): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.cuentaContable+util.buscar+'/'+cuentaContable.cuenta + '/'+cuentaContable.descripcion+'/'+cuentaContable.nivel, util.options).pipe(
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
