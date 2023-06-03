import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Banco } from '../../modelos/caja-banco/banco';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  constructor(private http: HttpClient) { }

  crear(banco: Banco): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.banco, banco, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(bancoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.banco + urn.slash + bancoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.banco, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.banco + urn.consultar + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.banco + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(banco: Banco): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.banco + urn.buscar, banco, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(banco: Banco): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.banco, banco, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(banco: Banco): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.banco + urn.activar, banco, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(banco: Banco): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.banco + urn.inactivar, banco, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
