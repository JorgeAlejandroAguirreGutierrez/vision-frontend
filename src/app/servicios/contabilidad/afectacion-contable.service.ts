import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AfectacionContable } from '../../modelos/contabilidad/afectacion-contable';

@Injectable({
  providedIn: 'root'
})
export class AfectacionContableService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  enviar(afectacionContableId: number) {
    this.messageSource.next(afectacionContableId);
  }

  crear(afectacionContable: AfectacionContable): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.afectacionContable, afectacionContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(afectacionContableId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.afectacionContable + urn.slash + afectacionContableId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.afectacionContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(afectacionContable: AfectacionContable): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.afectacionContable + urn.buscar, afectacionContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(afectacionContable: AfectacionContable): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.afectacionContable, afectacionContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(afectacionContable: AfectacionContable): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.afectacionContable + urn.activar, afectacionContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(afectacionContable: AfectacionContable): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.afectacionContable + urn.inactivar, afectacionContable, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
