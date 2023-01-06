import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { optionsCargarArchivo } from '../../constantes';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Modelo } from '../../modelos/administracion/modelo';
import { Segmento } from '../../modelos/inventario/segmento';

@Injectable({
  providedIn: 'root'
})

export class SegmentoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  enviar(segmentoId: number) {
    this.messageSource.next(segmentoId);
  }

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

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.segmento + urn.consultarActivos, options).pipe(
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
