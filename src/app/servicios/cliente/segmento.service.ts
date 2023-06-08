import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, map, catchError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { urn, options, optionsCargarArchivo } from '../../constantes';

import { Respuesta } from '../../respuesta';
import { environment } from '../../../environments/environment';
import { Modelo } from '../../modelos/administracion/modelo';
import { Segmento } from '../../modelos/cliente/segmento';

@Injectable({
  providedIn: 'root'
})

export class SegmentoService {

  constructor(private http: HttpClient) { }

  crear(segmento: Segmento): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.segmento, segmento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(segmentoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.segmento + urn.slash + segmentoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.segmento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.segmento + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.segmento + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.segmento + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(segmento: Segmento): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.segmento, segmento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(segmento: Segmento): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.segmento + urn.activar, segmento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(segmento: Segmento): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.segmento + urn.inactivar, segmento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(segmento: Segmento): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.segmento + urn.buscar + urn.slash + segmento.codigo + urn.slash + segmento.descripcion + urn.slash + segmento.margenGanancia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  importar(archivo: File, modelo: Modelo): Observable<Respuesta> {
    const formData: FormData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    return this.http.post(environment.host + urn.ruta + urn.slash + modelo.endpoint + urn.importar, formData, optionsCargarArchivo).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  exportar(modelo: Modelo): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.slash + modelo.endpoint + urn.importar, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }


}
