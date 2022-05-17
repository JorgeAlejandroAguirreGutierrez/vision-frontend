import { Injectable } from '@angular/core';
import { Empresa } from '../modelos/empresa';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }

  crear(empresa: Empresa): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.empresa, empresa, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(empresaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.empresa + '/' + empresaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.empresa, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(empresa: Empresa): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.empresa, empresa, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(empresa: Empresa): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.empresa + '/' + empresa.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(empresa: Empresa): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.empresa+util.personalizado + '/' + empresa.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
