import { Injectable } from '@angular/core';
import { Empresa } from '../../modelos/configuracion/empresa';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }

  crear(empresa: Empresa): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.empresa, empresa, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(empresaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.empresa + '/' + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.empresa, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(empresa: Empresa): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.empresa, empresa, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(empresa: Empresa): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.empresa + '/' + empresa.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(empresa: Empresa): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.empresa + urn.personalizado + '/' + empresa.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
