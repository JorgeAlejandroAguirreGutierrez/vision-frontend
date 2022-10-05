import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Kardex } from '../../modelos/inventario/kardex';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  constructor(private http: HttpClient) { }

  crear(kardex: Kardex): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.kardex, kardex, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(kardexId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.kardex + '/' + kardexId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.kardex, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(kardex: Kardex): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.kardex, kardex, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(kardex: Kardex): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.kardex + '/' + kardex.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
