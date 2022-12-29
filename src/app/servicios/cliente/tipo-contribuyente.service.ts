import { Injectable } from '@angular/core';
import { TipoContribuyente } from '../../modelos/cliente/tipo-contribuyente';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoContribuyenteService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(tipoContribuyente: TipoContribuyente): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.tipoContribuyente, tipoContribuyente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(tipo_contribuyente_id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.tipoContribuyente + urn.slash + tipo_contribuyente_id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.tipoContribuyente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(tipoContribuyente: TipoContribuyente): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.tipoContribuyente, tipoContribuyente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
