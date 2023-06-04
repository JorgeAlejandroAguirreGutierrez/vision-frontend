import { Injectable } from '@angular/core';
import { VehiculoTransporte } from '../../modelos/entrega/vehiculo-transporte';
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
export class VehiculoTransporteService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(vehiculoTransporte: VehiculoTransporte): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.vehiculoTransporte, vehiculoTransporte, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.vehiculoTransporte, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.vehiculoTransporte + urn.consultar + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.vehiculoTransporte + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(vehiculoTransporteId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.vehiculoTransporte + urn.slash + vehiculoTransporteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(vehiculoTransporte: VehiculoTransporte): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.vehiculoTransporte, vehiculoTransporte, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(vehiculoTransporte: VehiculoTransporte): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.vehiculoTransporte + urn.activar, vehiculoTransporte, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(vehiculoTransporte: VehiculoTransporte): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.vehiculoTransporte + urn.inactivar, vehiculoTransporte, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
