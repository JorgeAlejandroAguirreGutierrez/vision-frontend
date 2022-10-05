import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { optionsCargarArchivo } from '../../constantes';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Modelo } from '../../modelos/administracion/modelo';
import { CuentaContable } from '../../modelos/contabilidad/cuenta-contable';

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
    return this.http.post(environment.host + urn.ruta + urn.cuentaContable, cuentaContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(cuentaContableId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cuentaContable + '/' + cuentaContableId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(cuentaContableId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.cuentaContable + '/' + cuentaContableId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(cuentaContable: CuentaContable): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.cuentaContable, cuentaContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(cuentaContable: CuentaContable): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.cuentaContable + '/' + cuentaContable.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(cuentaContable: CuentaContable): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaContable + urn.buscar + '/' + cuentaContable.cuenta + '/' + cuentaContable.descripcion + '/' + cuentaContable.nivel, options).pipe(
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
