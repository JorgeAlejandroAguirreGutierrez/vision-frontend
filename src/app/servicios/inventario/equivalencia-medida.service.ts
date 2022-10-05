import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { EquivalenciaMedida } from '../../modelos/inventario/equivalencia-medida';
import { Medida } from '../../modelos/inventario/medida';

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
    return this.http.post(environment.host + urn.ruta + urn.equivalenciaMedida, equivalenciaMedida, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtenerAsync(equivalenciaMedidaId: number): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.equivalenciaMedida + '/' + equivalenciaMedidaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.equivalenciaMedida, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.equivalenciaMedida, equivalenciaMedida, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.equivalenciaMedida + '/' + equivalenciaMedida.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerMedida1Medida2(medidaIni: Medida, medidaFin: Medida): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.equivalenciaMedida + '/' + medidaIni.id + '/' + medidaFin.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscarMedidasEquivalentes(medidaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.equivalenciaMedida + urn.buscarEquivalenciaMedida + '/' + medidaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.equivalenciaMedida + urn.buscar, equivalenciaMedida, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
