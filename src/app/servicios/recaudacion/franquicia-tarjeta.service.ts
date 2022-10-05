import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FranquiciaTarjeta } from '../../modelos/recaudacion/franquicia-tarjeta';

@Injectable({
  providedIn: 'root'
})
export class FranquiciaTarjetaService {

  constructor(private http: HttpClient) { }

  crear(franquiciaTarjeta: FranquiciaTarjeta): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.franquiciaTarjeta, franquiciaTarjeta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(franquiciaTarjetaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.banco + '/' + franquiciaTarjetaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.franquiciaTarjeta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(franquiciaTarjeta: FranquiciaTarjeta): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.banco, franquiciaTarjeta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(franquiciaTarjeta: FranquiciaTarjeta): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.banco + '/' + franquiciaTarjeta.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
