import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GuiaRemision } from '../../modelos/entrega/guia-remision';

@Injectable({
  providedIn: 'root'
})
export class GuiaRemisionService {

  constructor(private http: HttpClient) { }

  crear(guiaRemision: GuiaRemision): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.guiaRemision, guiaRemision, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.guiaRemision + urn.slash + id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.guiaRemision + urn.factura + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.guiaRemision, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.guiaRemision + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstadoSRI(empresaId: number, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.guiaRemision + urn.consultarPorEmpresaYEstadoSRI + urn.slash + empresaId + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(guiaRemision: GuiaRemision): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.guiaRemision, guiaRemision, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
  
  anular(guiaRemision: GuiaRemision): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.guiaRemision + urn.anular, guiaRemision, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}