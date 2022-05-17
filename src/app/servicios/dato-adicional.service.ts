import { Injectable } from '@angular/core';
import { DatoAdicional } from '../modelos/dato-adicional';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DatoAdicionalService {

  constructor(private http: HttpClient) { }

  crear(datoAdicional: DatoAdicional): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.datoAdicional, datoAdicional, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(datoAdicionalId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.datoAdicional + '/' + datoAdicionalId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.datoAdicional, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(datoAdicional: DatoAdicional): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.datoAdicional, datoAdicional, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(datoAdicional: DatoAdicional): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.datoAdicional + '/' + datoAdicional.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(datoAdicional: DatoAdicional): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.datoAdicional+util.personalizado + '/' + datoAdicional.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
