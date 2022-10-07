import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bodega } from '../../modelos/inventario/bodega';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {

  constructor(private http: HttpClient) { }

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  enviar(bodega_id: number) {
    this.messageSource.next(bodega_id);
  }

  crear(bodega: Bodega): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.bodega, bodega, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(bodegaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.bodega + '/' + bodegaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(bodega_id: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.bodega + '/' + bodega_id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.bodega, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(bodega: Bodega): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.bodega, bodega, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(bodega: Bodega): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.bodega + '/' + bodega.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(bodega: Bodega): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.bodega + urn.personalizado + '/' + bodega.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
