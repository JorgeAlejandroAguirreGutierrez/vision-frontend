import { Injectable, EventEmitter, Output } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { NotaDebito } from 'src/app/modelos/venta/nota-debito';
import { NotaDebitoLinea } from 'src/app/modelos/venta/nota-debito-linea';

@Injectable({
  providedIn: 'root'
})
export class NotaDebitoService {

  constructor(private http: HttpClient) { }

  @Output() eventoRecaudacion = new EventEmitter<NotaDebito>();

  enviarEventoRecaudacion(data: NotaDebito) {
    this.eventoRecaudacion.emit(data);
  }

  crear(notaDebitoVenta: NotaDebito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebito, notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorCliente(clienteId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorCliente + urn.slash + clienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEstado(clienteId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorClienteYEstado + urn.slash + clienteId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorEmpresaYClienteYEstado(empresaId: number,clienteId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorEmpresaYClienteYEstado + urn.slash + empresaId + urn.slash + clienteId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEstadoYEstadoInternoYEstadoSri(clienteId: number, estado: string, estadoInterno: string, estadoSri: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorClienteYEstadoYEstadoInternoYEstadoSri + urn.slash + clienteId + urn.slash + estado + urn.slash + estadoInterno + urn.slash + estadoSri, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  obtener(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  validarIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.validarIdentificacion + urn.slash + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.notaDebito, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  recaudar(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaDebito + urn.recaudar, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaDebito + urn.activar, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaDebito + urn.inactivar, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcular(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebito + urn.calcular, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  calcularLinea(notaDebitoLinea: NotaDebitoLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebito + urn.calcularLinea, notaDebitoLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularRecaudacion(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebito + urn.calcularRecaudacion, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.obtenerPorFactura + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
