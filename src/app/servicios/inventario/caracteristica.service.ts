import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Caracteristica } from '../../modelos/inventario/caracteristica';
import { Producto } from '../../modelos/inventario/producto';
import { Bodega } from '../../modelos/inventario/bodega';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicaService {

  constructor(private http: HttpClient) { }

  crear(caracteristica: Caracteristica): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.caracteristica, caracteristica, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(caracteristicaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.caracteristica + urn.slash + caracteristicaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.caracteristica, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(caracteristica: Caracteristica): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.caracteristica, caracteristica, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

}
