import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import * as util from '../util';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AfectacionContable } from '../modelos/afectacion-contable';

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
    return this.http.post(environment.host + util.ruta + util.afectacionContable, JSON.stringify(afectacionContable), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(afectacionContableId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.afectacionContable + '/' + afectacionContableId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.afectacionContable, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(afectacionContable: AfectacionContable): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.afectacionContable+util.buscar, afectacionContable, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(afectacionContable: AfectacionContable): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.afectacionContable, JSON.stringify(afectacionContable), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(afectacionContable: AfectacionContable): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.afectacionContable + '/' + afectacionContable.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
