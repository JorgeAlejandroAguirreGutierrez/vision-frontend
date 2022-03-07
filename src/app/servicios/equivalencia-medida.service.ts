import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import * as util from '../util';
import { environment } from '../../environments/environment';
import { EquivalenciaMedida } from '../modelos/equivalencia-medida';
import { Medida } from '../modelos/medida';

@Injectable({
  providedIn: 'root'
})
export class EquivalenciaMedidaService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(equivalenciaMedidaId: number) {
    this.messageSource.next(equivalenciaMedidaId);
  }

  crear(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.equivalenciaMedida, JSON.stringify(equivalenciaMedida), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(equivalenciaMedidaId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.equivalenciaMedida + '/' + equivalenciaMedidaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.equivalenciaMedida, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.equivalenciaMedida, JSON.stringify(equivalenciaMedida), util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.equivalenciaMedida + '/' + equivalenciaMedida.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerMedida1Medida2(medidaIni: Medida, medidaFin: Medida): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.equivalenciaMedida+'/'+medidaIni.id + '/'+medidaFin.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscarMedidasEquivalentes(medidaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + util.ruta + util.equivalenciaMedida+util.buscarEquivalenciaMedida+'/'+medidaId, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.equivalenciaMedida+util.buscar, equivalenciaMedida, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
