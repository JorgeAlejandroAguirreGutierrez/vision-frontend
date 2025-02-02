import { Injectable } from '@angular/core';
import { Empresa } from '../../modelos/acceso/empresa';
import { Respuesta } from '../../respuesta';
import { urn, options, optionsCargarArchivo } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Nuevo } from 'src/app/modelos/acceso/nuevo';

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
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.empresa + urn.slash + empresaId, options).pipe(
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

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.empresa + urn.consultarPorEstado + urn.slash + estado, options).pipe(
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

  activar(empresa: Empresa): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.empresa + urn.activar, empresa, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(empresa: Empresa): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.empresa + urn.inactivar, empresa, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  validarIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.empresa + urn.validarIdentificacion + urn.slash + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  subirCertificado(empresaId: number, file: File): Observable<Respuesta> {
    // Create form data
    const formData = new FormData(); 
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    return this.http.post(environment.host + urn.ruta + urn.empresa + urn.subirCertificado + urn.slash + empresaId, formData, optionsCargarArchivo).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  subirLogo(empresaId: number, file: File): Observable<Respuesta> {
    // Create form data
    const formData = new FormData(); 
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    return this.http.post(environment.host + urn.ruta + urn.empresa + urn.subirLogo + urn.slash + empresaId, formData, optionsCargarArchivo).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
