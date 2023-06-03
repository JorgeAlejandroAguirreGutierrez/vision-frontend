import { Injectable } from '@angular/core';
import { FormaPago } from '../../modelos/cliente/forma-pago';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.formaPago, formaPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(formaPagoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.formaPago + urn.slash + formaPagoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.formaPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.formaPago + urn.consultar + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.formaPago + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.formaPago, formaPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.formaPago + urn.activar, formaPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.formaPago + urn.inactivar, formaPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(formaPago: FormaPago): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.formaPago + urn.buscar, formaPago, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
