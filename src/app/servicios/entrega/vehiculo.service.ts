import { Injectable } from '@angular/core';
import { Vehiculo } from '../../modelos/entrega/vehiculo';
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
export class VehiculoService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(vehiculo: Vehiculo): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.vehiculo, vehiculo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.vehiculo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.vehiculo + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.vehiculo + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.vehiculo + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(vehiculoTransporteId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.vehiculo + urn.slash + vehiculoTransporteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(vehiculo: Vehiculo): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.vehiculo, vehiculo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(vehiculo: Vehiculo): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.vehiculo + urn.activar, vehiculo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(vehiculo: Vehiculo): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.vehiculo + urn.inactivar, vehiculo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
