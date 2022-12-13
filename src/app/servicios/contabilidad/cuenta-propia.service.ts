import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, of, Observable, throwError } from 'rxjs';
import { CuentaPropia } from '../../modelos/recaudacion/cuenta-propia';
import { environment } from '../../../environments/environment';
import { urn, options } from '../../constantes';
import { Respuesta } from '../../respuesta';

@Injectable({
  providedIn: 'root'
})
export class CuentaPropiaService {
  
  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(cuentaPropiaId: number) {
    this.messageSource.next(cuentaPropiaId);
  }

  crear(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.cuentaPropia, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(cuentaPropiaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cuentaPropia + urn.slash + cuentaPropiaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.cuentaPropia, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  activar(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.cuentaPropia + urn.activar, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(cuentaPropia: CuentaPropia): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.cuentaPropia + urn.inactivar, cuentaPropia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
