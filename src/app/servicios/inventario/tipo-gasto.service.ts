import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoGasto } from '../../modelos/inventario/tipo-gasto';

@Injectable({
  providedIn: 'root'
})
export class TipoGastoService {

  constructor(private http: HttpClient) { }

  crear(tipoGasto: TipoGasto): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.tipoGasto, tipoGasto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(tipoGasto: TipoGasto): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoGasto + urn.slash + tipoGasto.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.tipoGasto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(tipoGasto: TipoGasto): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.tipoGasto, tipoGasto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
