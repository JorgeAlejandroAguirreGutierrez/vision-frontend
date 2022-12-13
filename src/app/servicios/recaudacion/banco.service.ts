import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Banco } from '../../modelos/recaudacion/banco';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  enviar(calificacion_cliente_id: number) {
    this.messageSource.next(calificacion_cliente_id);
  }

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
