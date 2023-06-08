import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriaProducto } from '../../modelos/inventario/categoria-producto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProductoService {

  constructor(private http: HttpClient) { }

  crear(categoriaProducto: CategoriaProducto): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.categoriaProducto, categoriaProducto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(categoriaProducto: CategoriaProducto): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.categoriaProducto + urn.slash + categoriaProducto.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerPorAbreviatura(abreviatura: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.categoriaProducto + urn.obtenerPorAbreviatura + urn.slash + abreviatura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.categoriaProducto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(categoriaProducto: CategoriaProducto): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.categoriaProducto, categoriaProducto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
