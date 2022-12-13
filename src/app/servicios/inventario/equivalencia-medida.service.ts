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

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.equivalenciaMedida, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtener(equivalenciaMedidaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.equivalenciaMedida + urn.slash + equivalenciaMedidaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.equivalenciaMedida, equivalenciaMedida, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.equivalenciaMedida + urn.activar, equivalenciaMedida, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(equivalenciaMedida: EquivalenciaMedida): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.equivalenciaMedida + urn.inactivar, equivalenciaMedida, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerMedida1Medida2(medidaIni: Medida, medidaFin: Medida): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.equivalenciaMedida + urn.slash + medidaIni.id + urn.slash + medidaFin.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscarMedidasEquivalentes(medidaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.equivalenciaMedida + urn.buscarMedidasEquivalentes + urn.slash + medidaId, options).pipe(
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
