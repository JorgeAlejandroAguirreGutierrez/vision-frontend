import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from '../../modelos/cliente/cliente';
import { Respuesta } from '../../respuesta';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(cliente: Cliente): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.cliente, JSON.stringify(cliente), options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cliente + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEmpresa(empresaId: number, pag: number, cant: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cliente + urn.consultarPorEmpresa + urn.slash + empresaId + urn.slash + pag + urn.slash + cant, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarFiltroPorEmpresa(filtro: string, empresaId: number, pag: number, cant: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cliente + urn.consultarFiltroPorEmpresa + urn.slash + filtro + urn.slash + empresaId + urn.slash + pag + urn.slash + cant, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cliente + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtener(clienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cliente + urn.slash + clienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtenerIdentificacionYEmpresaYEstado(identificacion: string, empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cliente + urn.obtenerIdentificacionYEmpresaYEstado + urn.slash + identificacion + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtenerRazonSocialYEmpresaYEstado(razonSocial: string, empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.cliente + urn.obtenerRazonSocialYEmpresaYEstado + urn.slash + razonSocial + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(cliente: Cliente): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.cliente, cliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(cliente: Cliente): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.cliente + urn.activar, cliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(cliente: Cliente): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.cliente + urn.inactivar, cliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  validarIdentificacionPorEmpresa(identificacion: string, empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cliente + urn.validarIdentificacionPorEmpresa + urn.slash + identificacion + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  validarTipoContribuyente(cliente: Cliente): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.cliente + '/tipocontribuyente/validar/' + cliente.identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(cliente: Cliente): Observable<Respuesta> {
    return this.http.post<Respuesta>(environment.host + urn.ruta + urn.cliente + urn.buscar, cliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  importar(archivo: File): Observable<Respuesta> {
    const formData: FormData = new FormData();
    formData.append('clientes', archivo, archivo.name);
    return this.http.post(environment.host + urn.ruta + urn.cliente + urn.importar, formData, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
